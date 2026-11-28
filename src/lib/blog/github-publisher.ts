import 'server-only';
import crypto from 'node:crypto';
import {
  BlogLang,
  buildSafeBlogContentPath,
  computeContentRevisionHash
} from './admin-validation';

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_API_VERSION = '2022-11-28';
const GITHUB_FETCH_TIMEOUT_MS = 10_000;
const DEFAULT_REPOSITORY = 'hhc883/yitarot';
const REPO_RE = /^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/;

export interface PublishBlogPrInput {
  mode: 'create' | 'edit';
  lang: BlogLang;
  slug: string;
  title: string;
  normalizedMarkdown: string;
  revisionHash: string;
  originalRevisionHash?: string;
}

export type PublishBlogPrResult =
  | {
      ok: true;
      prUrl: string;
      prNumber: number;
      branchName: string;
      reusedExistingPr: boolean;
    }
  | {
      ok: false;
      code:
        | 'GITHUB_UNCONFIGURED'
        | 'INVALID_CONFIG'
        | 'CONFLICT'
        | 'STALE_CONTENT'
        | 'NO_CHANGES'
        | 'GITHUB_ERROR';
      message: string;
    };

interface GitHubContentResponse {
  sha: string;
  content?: string;
  encoding?: string;
}

interface GitHubRefResponse {
  object?: {
    sha?: string;
  };
}

interface GitHubPullResponse {
  number: number;
  html_url: string;
}

function getGitHubHeaders(token: string): Record<string, string> {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': GITHUB_API_VERSION,
    'User-Agent': 'YiTatro-Blog-Admin/1.0',
    'Content-Type': 'application/json'
  };
}

async function githubFetch(url: string, init: RequestInit): Promise<Response> {
  return fetch(url, {
    ...init,
    cache: 'no-store',
    signal: init.signal ?? AbortSignal.timeout(GITHUB_FETCH_TIMEOUT_MS)
  });
}

async function findOpenReviewPr(
  owner: string,
  repo: string,
  branchName: string,
  headers: Record<string, string>
): Promise<GitHubPullResponse | null> {
  const res = await githubFetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/pulls?state=open&head=${encodeURIComponent(`${owner}:${branchName}`)}&base=main`,
    { method: 'GET', headers }
  );
  if (!res.ok) return null;
  const prs = (await res.json()) as GitHubPullResponse[];
  return Array.isArray(prs) && prs.length > 0 ? prs[0] : null;
}

function encodeRepoPath(repoPath: string): string {
  return repoPath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

function sanitizePrUrl(rawUrl: string, owner: string, repo: string, prNumber: number): string {
  const fallback = `https://github.com/${owner}/${repo}/pull/${prNumber}`;
  try {
    const parsed = new URL(rawUrl);
    if (
      parsed.protocol === 'https:' &&
      parsed.hostname === 'github.com' &&
      parsed.pathname.startsWith(`/${owner}/${repo}/pull/`)
    ) {
      return parsed.toString();
    }
  } catch {
    // Fall back to canonical GitHub PR URL
  }
  return fallback;
}

function mapGitHubHttpError(status: number, lang: BlogLang): string {
  const isEn = lang === 'en';
  if (status === 401 || status === 403) {
    return isEn
      ? 'GitHub token is unauthorized or lacks Contents / Pull requests write permission.'
      : 'GitHub 令牌无效或缺少 Contents / Pull requests 写入权限。';
  }
  if (status === 404) {
    return isEn
      ? 'Configured GitHub repository or main branch was not found.'
      : '未找到配置的 GitHub 仓库或 main 分支。';
  }
  if (status === 422) {
    return isEn
      ? 'GitHub rejected the branch or pull request payload (422).'
      : 'GitHub 拒绝了分支或拉取请求参数（422）。';
  }
  if (status === 429) {
    return isEn
      ? 'GitHub API rate limit reached. Please retry shortly or export Markdown.'
      : '已触发 GitHub API 速率限制，请稍后重试或先导出 Markdown。';
  }
  return isEn
    ? `GitHub API request failed with status ${status}. You can export Markdown as a fallback.`
    : `GitHub API 请求失败（状态码 ${status}），可先导出 Markdown 备份。`;
}

/**
 * Publishes a validated blog Markdown file to a deterministic review branch
 * and opens (or reuses) a Pull Request against `main`. Never writes `main` or merges.
 */
export async function publishBlogReviewPr(
  input: PublishBlogPrInput
): Promise<PublishBlogPrResult> {
  const isEn = input.lang === 'en';
  const token = (process.env.YITATRO_BLOG_GITHUB_TOKEN ?? '').trim();
  if (!token) {
    return {
      ok: false,
      code: 'GITHUB_UNCONFIGURED',
      message: isEn
        ? 'GitHub review publishing is not configured (missing YITATRO_BLOG_GITHUB_TOKEN). Export Markdown below.'
        : '未配置 GitHub 审稿发布令牌（YITATRO_BLOG_GITHUB_TOKEN），请使用下方导出 Markdown。'
    };
  }

  const repoRaw = (process.env.YITATRO_BLOG_GITHUB_REPOSITORY ?? DEFAULT_REPOSITORY).trim();
  const repoMatch = REPO_RE.exec(repoRaw);
  if (!repoMatch) {
    return {
      ok: false,
      code: 'INVALID_CONFIG',
      message: isEn
        ? 'Invalid YITATRO_BLOG_GITHUB_REPOSITORY format (expected owner/repo).'
        : 'YITATRO_BLOG_GITHUB_REPOSITORY 格式无效（应为 owner/repo）。'
    };
  }
  const owner = repoMatch[1];
  const repo = repoMatch[2];

  const filePath = buildSafeBlogContentPath(input.lang, input.slug);
  if (!filePath) {
    return {
      ok: false,
      code: 'INVALID_CONFIG',
      message: isEn ? 'Invalid blog target path.' : '博客目标路径无效。'
    };
  }

  const encodedPath = encodeRepoPath(filePath);
  const headers = getGitHubHeaders(token);

  try {
    // 1. Fetch `main` HEAD SHA first so content validation and branch creation use the same immutable commit
    const mainRefRes = await githubFetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/ref/heads/main`,
      { method: 'GET', headers }
    );
    if (!mainRefRes.ok) {
      return {
        ok: false,
        code: 'GITHUB_ERROR',
        message: mapGitHubHttpError(mainRefRes.status, input.lang)
      };
    }
    const mainRefJson = (await mainRefRes.json()) as GitHubRefResponse;
    const mainHeadSha = mainRefJson.object?.sha;
    if (!mainHeadSha) {
      return {
        ok: false,
        code: 'GITHUB_ERROR',
        message: isEn
          ? 'Unable to resolve GitHub main branch HEAD SHA.'
          : '无法获取 GitHub main 分支的 HEAD 提交哈希。'
      };
    }

    // 2. Inspect actual file on GitHub `main` at that exact immutable SHA
    const mainFileRes = await githubFetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${encodedPath}?ref=${encodeURIComponent(mainHeadSha)}`,
      { method: 'GET', headers }
    );

    let mainFileSha: string | undefined;

    if (input.mode === 'create') {
      if (mainFileRes.status === 200) {
        return {
          ok: false,
          code: 'CONFLICT',
          message: isEn
            ? `An article already exists at ${filePath} on GitHub main.`
            : `GitHub main 分支已存在 ${filePath}，无法新建同名文章。`
        };
      }
      if (mainFileRes.status !== 404) {
        return {
          ok: false,
          code: 'GITHUB_ERROR',
          message: mapGitHubHttpError(mainFileRes.status, input.lang)
        };
      }
    } else {
      if (mainFileRes.status === 404) {
        return {
          ok: false,
          code: 'CONFLICT',
          message: isEn
            ? `Target article ${filePath} does not exist on GitHub main.`
            : `GitHub main 分支上未找到目标文章 ${filePath}。`
        };
      }
      if (!mainFileRes.ok) {
        return {
          ok: false,
          code: 'GITHUB_ERROR',
          message: mapGitHubHttpError(mainFileRes.status, input.lang)
        };
      }

      const mainFileJson = (await mainFileRes.json()) as GitHubContentResponse;
      mainFileSha = mainFileJson.sha;
      const decodedMainContent = mainFileJson.content
        ? Buffer.from(mainFileJson.content.replace(/\n/g, ''), 'base64').toString('utf8')
        : '';
      const mainRevisionHash = computeContentRevisionHash(decodedMainContent);

      if (!input.originalRevisionHash || mainRevisionHash !== input.originalRevisionHash) {
        return {
          ok: false,
          code: 'STALE_CONTENT',
          message: isEn
            ? 'The file on GitHub main has changed since you loaded it. Refresh or export Markdown to avoid overwriting newer edits.'
            : 'GitHub main 分支上的文件自你加载后已发生变化。请刷新页面或先导出 Markdown，避免覆盖他人更新。'
        };
      }

      if (mainRevisionHash === input.revisionHash) {
        return {
          ok: false,
          code: 'NO_CHANGES',
          message: isEn
            ? 'No changes detected compared to GitHub main.'
            : '当前内容与 GitHub main 分支完全一致，无需创建审稿 PR。'
        };
      }
    }

    // 3. Compute deterministic branch name including expected base revision so older edits cannot collide
    const baseRevisionKey = input.mode === 'edit' ? (input.originalRevisionHash ?? '') : 'new';
    const submissionDigest = crypto
      .createHash('sha256')
      .update(
        `${input.mode}:${input.lang}:${input.slug}:${baseRevisionKey}:${input.revisionHash}`,
        'utf8'
      )
      .digest('hex')
      .slice(0, 12);
    const branchName = `blog/${input.lang}-${input.slug}-${submissionDigest}`;

    // 4. Ensure deterministic branch exists using the exact same `mainHeadSha`
    const branchRefRes = await githubFetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(branchName)}`,
      { method: 'GET', headers }
    );

    if (branchRefRes.status === 404) {
      const createRefRes = await githubFetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/refs`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ref: `refs/heads/${branchName}`,
          sha: mainHeadSha
        })
      });

      if (!createRefRes.ok && createRefRes.status !== 422) {
        return {
          ok: false,
          code: 'GITHUB_ERROR',
          message: mapGitHubHttpError(createRefRes.status, input.lang)
        };
      }
    } else if (!branchRefRes.ok) {
      return {
        ok: false,
        code: 'GITHUB_ERROR',
        message: mapGitHubHttpError(branchRefRes.status, input.lang)
      };
    }

    // 5. Verify review branch state before PUT (recover partial writes, reject unexpected divergence)
    const branchFileRes = await githubFetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${encodedPath}?ref=${encodeURIComponent(branchName)}`,
      { method: 'GET', headers }
    );

    let needsContentWrite = true;
    let branchFileSha = mainFileSha;

    if (branchFileRes.status === 200) {
      const branchFileJson = (await branchFileRes.json()) as GitHubContentResponse;
      branchFileSha = branchFileJson.sha;
      const decodedBranchContent = branchFileJson.content
        ? Buffer.from(branchFileJson.content.replace(/\n/g, ''), 'base64').toString('utf8')
        : '';
      const branchRevisionHash = computeContentRevisionHash(decodedBranchContent);

      if (branchRevisionHash === input.revisionHash) {
        needsContentWrite = false;
      } else if (input.mode === 'create') {
        return {
          ok: false,
          code: 'CONFLICT',
          message: isEn
            ? `Review branch ${branchName} already contains an unexpected file at ${filePath}.`
            : `审稿分支 ${branchName} 已意外存在文件 ${filePath}，已中止写入以防冲突。`
        };
      } else if (branchRevisionHash !== input.originalRevisionHash) {
        return {
          ok: false,
          code: 'CONFLICT',
          message: isEn
            ? `Review branch ${branchName} has diverged from the validated base revision of ${filePath}.`
            : `审稿分支 ${branchName} 中的 ${filePath} 与已校验的基线版本不一致，已中止覆盖。`
        };
      }
    } else if (branchFileRes.status === 404) {
      if (input.mode === 'edit') {
        return {
          ok: false,
          code: 'CONFLICT',
          message: isEn
            ? `Target article ${filePath} is missing on existing review branch ${branchName}.`
            : `现有审稿分支 ${branchName} 中缺少目标文章 ${filePath}，已中止覆盖。`
        };
      }
    } else {
      return {
        ok: false,
        code: 'GITHUB_ERROR',
        message: mapGitHubHttpError(branchFileRes.status, input.lang)
      };
    }

    if (needsContentWrite) {
      const commitMessage =
        input.mode === 'create'
          ? `blog(${input.lang}): add ${input.slug}`
          : `blog(${input.lang}): update ${input.slug}`;

      const putBody: Record<string, string> = {
        message: commitMessage,
        content: Buffer.from(input.normalizedMarkdown, 'utf8').toString('base64'),
        branch: branchName
      };
      if (branchFileSha) {
        putBody.sha = branchFileSha;
      }

      const putRes = await githubFetch(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${encodedPath}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify(putBody)
        }
      );

      if (!putRes.ok) {
        return {
          ok: false,
          code: 'GITHUB_ERROR',
          message: mapGitHubHttpError(putRes.status, input.lang)
        };
      }
    }

    // 6. Reuse an existing open PR for this deterministic branch, or open a new PR against `main`
    const existingPr = await findOpenReviewPr(owner, repo, branchName, headers);
    if (existingPr) {
      return {
        ok: true,
        prUrl: sanitizePrUrl(existingPr.html_url, owner, repo, existingPr.number),
        prNumber: existingPr.number,
        branchName,
        reusedExistingPr: true
      };
    }

    const prTitle =
      input.mode === 'create'
        ? `[Blog/${input.lang}] Add: ${input.title}`
        : `[Blog/${input.lang}] Update: ${input.title}`;
    const prBody = [
      `Submitted via YiTatro Blog Admin (\`/${input.lang}/admin/blog\`).`,
      '',
      `- **Action**: ${input.mode === 'create' ? 'Create' : 'Update'}`,
      `- **Target**: \`${filePath}\``,
      `- **Revision SHA-256**: \`${input.revisionHash.slice(0, 16)}\``,
      '',
      'Please review the Markdown diff and Vercel preview before merging into `main`.'
    ].join('\n');

    const createPrRes = await githubFetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/pulls`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: prTitle,
        head: branchName,
        base: 'main',
        body: prBody
      })
    });

    if (!createPrRes.ok) {
      const racedPr = await findOpenReviewPr(owner, repo, branchName, headers);
      if (racedPr) {
        return {
          ok: true,
          prUrl: sanitizePrUrl(racedPr.html_url, owner, repo, racedPr.number),
          prNumber: racedPr.number,
          branchName,
          reusedExistingPr: true
        };
      }

      return {
        ok: false,
        code: 'GITHUB_ERROR',
        message: mapGitHubHttpError(createPrRes.status, input.lang)
      };
    }

    const createdPr = (await createPrRes.json()) as GitHubPullResponse;
    return {
      ok: true,
      prUrl: sanitizePrUrl(createdPr.html_url, owner, repo, createdPr.number),
      prNumber: createdPr.number,
      branchName,
      reusedExistingPr: false
    };
  } catch {
    return {
      ok: false,
      code: 'GITHUB_ERROR',
      message: isEn
        ? 'Network error while contacting GitHub. Please retry or export Markdown.'
        : '连接 GitHub 时发生网络异常，请重试或先导出 Markdown。'
    };
  }
}
