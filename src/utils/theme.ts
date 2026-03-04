export type ThemeMode = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'boni-theme';

export const CHROME_COLOR_BY_THEME: Record<ThemeMode, string> = {
  light: '#ffffff',
  dark: '#0c0e12',
};

const getThemeColorMeta = () => {
  const existingDynamic = document.head.querySelector<HTMLMetaElement>('meta[name="theme-color"][data-dynamic-theme-color="1"]');
  if (existingDynamic) {
    return existingDynamic;
  }
  const existing = document.head.querySelector<HTMLMetaElement>('meta[name="theme-color"]:not([media])');
  if (existing) {
    existing.setAttribute('data-dynamic-theme-color', '1');
    return existing;
  }

  const meta = document.createElement('meta');
  meta.setAttribute('name', 'theme-color');
  meta.setAttribute('data-dynamic-theme-color', '1');
  document.head.appendChild(meta);
  return meta;
};

const forceMetaRepaint = (meta: HTMLMetaElement) => {
  const parent = meta.parentElement;
  if (!parent) {
    return;
  }
  parent.removeChild(meta);
  parent.appendChild(meta);
};

export const getStoredTheme = (): ThemeMode | null => {
  const value = localStorage.getItem(THEME_STORAGE_KEY);
  if (value === 'light' || value === 'dark') {
    return value;
  }
  return null;
};

export const getSystemTheme = (): ThemeMode => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const getInitialTheme = (): ThemeMode => {
  return getStoredTheme() ?? getSystemTheme();
};

export const syncThemeColorMeta = (theme: ThemeMode) => {
  const color = CHROME_COLOR_BY_THEME[theme];
  const meta = getThemeColorMeta();
  meta.setAttribute('content', color);
  forceMetaRepaint(meta);

  const appleMeta = document.head.querySelector<HTMLMetaElement>('meta[name="apple-mobile-web-app-status-bar-style"]');
  if (appleMeta) {
    appleMeta.setAttribute('content', theme === 'dark' ? 'black-translucent' : 'default');
  }
};

export const applyTheme = (theme: ThemeMode) => {
  document.documentElement.setAttribute('data-theme', theme);
  syncThemeColorMeta(theme);
};
