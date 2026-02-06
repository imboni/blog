import { ref } from 'vue';

export type SiteConfig = {
  siteTitle: string;
  siteName: string;
  tagline: string;
  intro: string;
  footerTemplate: string;
  siteUrl?: string;
  repoUrl?: string;
  repoLabel?: string;
  nav: {
    posts: string;
    board: string;
    about: string;
    rss: string;
    themeLight: string;
    themeDark: string;
  };
  contacts: Array<{ label: string; href: string }>;
  projects: Array<{ period: string; name: string; desc: string; href: string }>;
  about: {
    title: string;
    subtitle: string;
    paragraphs: string[];
  };
};

const defaultConfig: SiteConfig = {
  siteTitle: 'Blog',
  siteName: 'Blog',
  tagline: '创作 / 代码 / 观察',
  intro: '一些学习和日常的记录。',
  footerTemplate: '© {year} / 保留所有权利',
  siteUrl: '',
  repoUrl: '',
  repoLabel: 'GitHub',
  nav: {
    posts: '文章',
    board: '留言',
    about: '关于',
    rss: 'RSS',
    themeLight: '日间',
    themeDark: '夜间',
  },
  contacts: [
    { label: '邮箱', href: 'mailto:hello@example.com' },
    { label: 'X', href: 'https://x.com/yourhandle' },
    { label: 'GitHub', href: 'https://github.com/yourname' },
  ],
  projects: [],
  about: {
    title: '关于',
    subtitle: '更少，但更清晰。',
    paragraphs: [
      '我用极简的方式整理内容，优先保留清晰与节制。',
      '这里记录创作过程、代码片段与日常观察，形式尽量克制，重点保持阅读的顺滑与专注。',
      '如果你有想法，欢迎留言或通过联系区域找到我。',
    ],
  },
};

export const siteConfig = ref<SiteConfig>(defaultConfig);

let loadPromise: Promise<void> | null = null;

export const loadSiteConfig = async () => {
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    try {
      const base = import.meta.env.BASE_URL || '/';
      const url = base.replace(/\/$/, '') + '/site.config.json';
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) return;
      const data = await res.json();
      siteConfig.value = {
        ...defaultConfig,
        ...data,
        nav: { ...defaultConfig.nav, ...(data.nav || {}) },
        about: { ...defaultConfig.about, ...(data.about || {}) },
        contacts: Array.isArray(data.contacts) ? data.contacts : defaultConfig.contacts,
        projects: Array.isArray(data.projects) ? data.projects : defaultConfig.projects,
      };
    } catch (_) {}
  })();
  return loadPromise;
};
