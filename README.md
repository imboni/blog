# Boni's Blog 2.0

开源的极简个人博客。文章来自 GitHub Issues，评论使用 GitHub Discussions（giscus），支持 RSS 订阅，无需自建后端与数据库。

[在线访问](https://imboni.cn/) · [更新记录](CHANGELOG.md)

## 2.0 带来了什么

2.0 保留原有单栏布局、首页 / 文章 / 留言 / 关于页面、GitHub 数据源和月星楷字体，以 Catfish 的灰紫配色、纸面与玻璃材质重新整理视觉和交互。

- **玻璃界面**：半透明导航、搜索框与首页卡片，搭配柔和背景、反光边缘和层次阴影。
- **浅色 / 深色主题**：默认跟随系统，手动选择会保存；导航、正文代码高亮、评论区与移动端浏览器主题色同步切换。
- **克制的动效**：首页首次打开时分层入场，页面与按钮提供轻量反馈；返回首页不重播入场，支持系统“减少动态效果”和键盘操作。
- **移动端适配**：折叠导航、触控反馈、安全区域间距，以及适合窄屏的文章与项目布局。
- **文章搜索**：搜索标题、标签或正文，显示标题命中高亮、结果数量与空状态，支持清空、展开和收起列表。
- **连续阅读**：调整正文、代码块、表格和引用排版；图片支持点击或键盘打开大图，按 Escape 关闭。由文章返回目录时保留首页搜索词、已展开列表和滚动位置。

## 快速开始

使用 Node.js 20.19+ 或 22.12+。

```bash
npm ci
cp .env.example .env
```

填写 `.env` 中的仓库信息，再启动开发服务：

```bash
npm run dev
```

默认地址为 `http://localhost:8003/`。

| 环境变量 | 用途 |
| --- | --- |
| `VITE_REPO_OWNER` | 必填，GitHub 仓库所有者 |
| `VITE_REPO_NAME` | 必填，作为文章数据源的仓库名 |
| `VITE_SITE_URL` | 可选，覆盖站点配置中的 `siteUrl`，用于 RSS 链接 |
| `GITHUB_TOKEN` | 可选，仅用于构建时生成 RSS，提升 GitHub API 请求限额 |

浏览器通过匿名请求读取公开文章与项目。`.env` 不应提交，也不要把私密令牌写入 `VITE_*` 变量，这类变量会进入浏览器构建产物。

## 站点与内容配置

编辑 [public/site.config.json](public/site.config.json) 可修改站点名称、介绍、导航文案、联系方式、页脚与关于页内容。`siteUrl` 应填写部署后的完整站点地址。头像位于 `public/logo.png`。

文章读取 `VITE_REPO_OWNER` / `VITE_REPO_NAME` 指定仓库的 Issues，使用标题、正文、标签和创建日期，排除 Pull Requests，仅展示仓库所有者、成员和协作者发布的文章。文章地址继续使用 `/post/<issue 编号>`。

首页“业余项目”自动读取该所有者的公开仓库（包含 fork），排除已归档仓库、博客仓库、`imboni-blog` 及与用户名同名的 profile 仓库；当前列表不使用 `site.config.json` 中的 `projects` 字段。

### 评论与留言

1. 在仓库启用 Discussions，并安装、授权 giscus GitHub App。
2. 在 [giscus 配置页](https://giscus.app/zh-CN) 生成参数。
3. 更新 [src/components/Giscus.vue](src/components/Giscus.vue) 中 `baseConfig` 的 `repo`、`repoId`、`category` 和 `categoryId`。

文章评论使用 `specific` 映射，标识为 `post-<issue 编号>`；留言页使用 `board`。升级时保留这些标识与原 Discussions 配置即可继续关联已有评论。评论主题由组件跟随站点自动同步。

## 构建与部署

```bash
npm run build
npm run preview
```

`build` 先生成 RSS，再执行 TypeScript 检查与 Vite 构建，输出目录为 `dist/`。RSS 生成需要访问 GitHub API，并要求配置仓库信息与 `siteUrl`；也可用 `npm run rss` 单独生成。生成文件为 `public/rss.xml`，部署后位于站点的 `/rss.xml`。

内置 [GitHub Actions 工作流](.github/workflows/deploy.yml) 会在 `main` 分支推送及指定 Issue 事件后构建，部署到 `gh-pages` 分支。RSS 使用工作流提供的临时 `GITHUB_TOKEN`。使用自己的站点时，请检查工作流中的仓库环境变量、部署域名与 `public/CNAME`，并在 GitHub Pages 中配置发布来源。

当前默认部署在域名根路径（`vite.config.ts` 中 `base: '/'`）。如需部署到仓库子路径，请同时核对 `base`、静态资源路径和深层路由回退；其他静态托管平台也需让文章等深层路由能够回到应用入口。

发布版本时同步更新 `package.json`、`package-lock.json` 和 `CHANGELOG.md`，使用 `## [版本号] - YYYY-MM-DD` 作为更新记录标题。推送 `v*` 标签后，[Release 工作流](.github/workflows/release.yml) 会提取对应更新记录并创建 GitHub Release。

## 源码维护

技术栈：Vue 3、TypeScript、Vite、Vue Router、Tailwind CSS、Less、Fuse.js、MarkdownIt 与 highlight.js。

| 位置 | 职责 |
| --- | --- |
| `src/style.less` | 浅深色主题变量、玻璃材质、全局布局、Markdown 排版与通用动效 |
| `src/components/Navbar.vue` | 桌面 / 移动导航、主题切换与 RSS 入口 |
| `src/components/home/` | 首页搜索、文章列表、项目和联系方式 |
| `src/components/reading/` | Markdown 渲染与图片预览 |
| `src/composables/` | 数据加载、搜索分页、主题同步和首页入场逻辑 |
| `src/views/` | 首页、文章、留言与关于页面的组合 |
| `src/App.vue`、`src/router/index.ts` | 页面过渡、首页缓存与返回位置恢复 |
| `src/api/`、`src/config/site.ts` | GitHub 请求与站点配置加载 |
| `scripts/generate-rss.mjs` | 构建时生成 RSS |
| `scripts/release-notes.mjs` | 从更新记录提取指定版本的 Release 说明 |

首页入场使用原生 Web Animations API；通用过渡参数集中在 `src/style.less`。修改交互后应检查浅深色、窄屏、键盘焦点、“减少动态效果”及文章返回目录的状态恢复。

## 字体

2.0 沿用原版开源字体 [Moon Stars Kai（月星楷）](https://github.com/GuiWonder/MoonStarsKai)，保留已有的 WOFF2 子集与预加载优化，生产字体位于 [public/fonts/MoonStarsKai.woff2](public/fonts/MoonStarsKai.woff2)。未包含的字形回退到原有系统字体；完整 WOFF 字体不再随站点发布。字体说明与许可证位于 [src/assets/fonts/MoonStarsKai/](src/assets/fonts/MoonStarsKai/)。
