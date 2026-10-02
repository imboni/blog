import { computed, onMounted, onUnmounted, shallowRef } from 'vue';
import { applyTheme, getStoredTheme, THEME_STORAGE_KEY, type ThemeMode } from '../utils/theme';

export function useTheme() {
  const theme = shallowRef<ThemeMode>(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  const isDark = computed(() => theme.value === 'dark');
  const setTheme = (value: ThemeMode) => { theme.value = value; applyTheme(value); };
  const toggleTheme = () => {
    const next = isDark.value ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch { /* Private browsing may disable storage. */ }
  };
  let media: MediaQueryList | undefined;
  const onSystemChange = (event: MediaQueryListEvent) => {
    if (!getStoredTheme()) setTheme(event.matches ? 'dark' : 'light');
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY || event.key === null) {
      setTheme(getStoredTheme() ?? (media?.matches ? 'dark' : 'light'));
    }
  };
  onMounted(() => {
    media = window.matchMedia('(prefers-color-scheme: dark)');
    if (media.addEventListener) media.addEventListener('change', onSystemChange);
    else media.addListener(onSystemChange);
    window.addEventListener('storage', onStorage);
  });
  onUnmounted(() => {
    if (media?.removeEventListener) media.removeEventListener('change', onSystemChange);
    else media?.removeListener(onSystemChange);
    window.removeEventListener('storage', onStorage);
  });
  return { isDark, toggleTheme };
}
