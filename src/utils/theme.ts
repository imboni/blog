export type ThemeMode = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'boni-theme';

const statusBarColorByTheme: Record<ThemeMode, string> = {
  light: '#ffffff',
  dark: '#0b0d10',
};

const getThemeColorMeta = () => {
  const existing = document.head.querySelector<HTMLMetaElement>('meta[name="theme-color"]:not([media])');
  if (existing) {
    return existing;
  }
  const meta = document.createElement('meta');
  meta.setAttribute('name', 'theme-color');
  document.head.appendChild(meta);
  return meta;
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
  const meta = getThemeColorMeta();
  meta.setAttribute('content', statusBarColorByTheme[theme]);
};

export const applyTheme = (theme: ThemeMode) => {
  document.documentElement.setAttribute('data-theme', theme);
  syncThemeColorMeta(theme);
};
