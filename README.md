# Boni's Blog

开源的极简个人博客，内容来自 GitHub Issues。无需后端与数据库，专注于写作与阅读体验。适合部署到 GitHub Pages 或任意静态托管平台。你可以在[这里](https://imboni.github.io/blog/)查看。

示例截图：

<p align="center">
  <img src="public/demo.png" alt="首页预览" width="760" style="border:1px solid #e5e7eb; border-radius:8px;" />
</p>



## 特性
- **内容来源**：GitHub Issues 作为文章与留言的唯一数据源
- **极简视觉**：单栏布局、统一字号与间距规则
- **日/夜模式**：跟随系统，支持手动切换
- **Markdown 渲染**：支持代码高亮与图片展示

---

## 技术栈
- Vue 3 + Vite
- Tailwind CSS + Less
- Octokit（GitHub API）
- MarkdownIt（Markdown 渲染）

## 字体说明
本项目使用开源字体 **Moon Stars Kai（月星楷）**：
[https://github.com/GuiWonder/MoonStarsKai](https://github.com/GuiWonder/MoonStarsKai)

---

## 快速开始
```bash
npm install
```

### 站点配置
项目会在运行时读取 `public/site.config.json`，用于统一配置站点名称、介绍文案、导航文案、联系方式与关于页内容。  
该文件会随仓库提交，你可以直接修改它来替换所有个人信息。

### 环境变量
创建本地环境变量文件（不会提交到仓库）：
```bash
cp .env.example .env
```

然后在 `.env` 中填写：
- `VITE_GITHUB_TOKEN`：GitHub 个人访问令牌（用于读取 Issues）
- `VITE_REPO_OWNER`：仓库所有者
- `VITE_REPO_NAME`：仓库名称

本地开发：
```bash
npm run dev
```

构建：
```bash
npm run build
```

---

## 部署
项目内置 GitHub Actions 部署流程：`.github/workflows/deploy.yml`  
如果仓库名变更，请同步更新：
- `.env` 中的 `VITE_REPO_NAME`
- `vite.config.ts` 中的 `base` 路径

---

## 安全提示
`.env` 仅用于本地开发，不应提交到仓库。建议在仓库中维护 `.env.example` 作为模板。
