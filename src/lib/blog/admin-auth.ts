import 'server-only';
import { getSupabaseUser } from '@/lib/supabase/server';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type BlogAdminAuthResult =
  | {
      ok: true;
      user: {
        id: string;
        email?: string;
      };
    }
  | {
      ok: false;
      reason: 'unauthenticated' | 'forbidden';
    };

/**
 * Parses comma-separated admin UUID allowlist from YITATRO_BLOG_ADMIN_USER_IDS.
 * Empty or missing allowlist fails closed.
 */
export function getBlogAdminAllowlist(): Set<string> {
  const raw = process.env.YITATRO_BLOG_ADMIN_USER_IDS ?? '';
  const ids = raw
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter((item) => UUID_RE.test(item));
  return new Set(ids);
}

/**
 * Server-side authorization guard for blog admin pages, loaders, and actions.
 */
export async function requireBlogAdmin(): Promise<BlogAdminAuthResult> {
  const user = await getSupabaseUser();
  if (!user || !user.id) {
    return { ok: false, reason: 'unauthenticated' };
  }

  const allowlist = getBlogAdminAllowlist();
  if (allowlist.size === 0 || !allowlist.has(user.id.toLowerCase())) {
    return { ok: false, reason: 'forbidden' };
  }

  return {
    ok: true,
    user: {
      id: user.id,
      email: user.email
    }
  };
}
