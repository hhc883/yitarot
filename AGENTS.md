<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## YiTatro 改版接手顺序

1. **接手改版**：先用 `git status --short --branch` 确认当前分支和未提交工作。打开[改版进度](docs/design/yitatro/STATUS.md)，再看[设计方案](docs/design/yitatro/README.md)中当前任务对应的章节和图稿。
2. **确定下一步**：用户指定任务时优先做该任务。用户只说「接手」「继续」或「开始改版」时，直接做进度页的「下一项」。结合当前分支和已有改动核对进度，已经有实现与验证证据的项从后续继续。仅要求方案、审稿或审查时，按该请求的范围工作。
3. **实施改版**：按静态骨架 → 首页动效 → 其他页面 → 发布前检查推进。关键约定是黑白主题、性能优先、太极开屏后上滑进入；内页支持直接访问。原生滚动先可用，Lenis 限于桌面首页；保留现有路由和业务行为。细节以本轮要求和设计方案为准。
4. **验收和交接**：按设计方案的本批验收项执行验证。完成或遇到实际阻塞时，在进度页写清已完成范围、验证结果、待确认项和下一项具体任务。为换电脑准备交接时，记录对应分支和可定位的代码提交。
