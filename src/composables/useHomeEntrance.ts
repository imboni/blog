import { onDeactivated, onMounted, onUnmounted, type ShallowRef } from 'vue';

/** A one-time introduction. Elements stay visible if animation is unavailable. */
export function useHomeEntrance(
  root: Readonly<ShallowRef<HTMLElement | null>>,
  options: { enabled: boolean },
) {
  let animations: Animation[] = [];
  let motionPreference: MediaQueryList | undefined;

  function finishEntrance() {
    document.removeEventListener('keydown', onKeydown, true);
    motionPreference?.removeEventListener('change', onMotionChange);
    motionPreference = undefined;
    // Cancel restores each element's resting CSS and releases animation layers.
    animations.forEach((animation) => animation.cancel());
    animations = [];
  }

  function onKeydown(event: KeyboardEvent) {
    if (!['Shift', 'Control', 'Meta', 'Alt'].includes(event.key)) finishEntrance();
  }

  function onMotionChange(event: MediaQueryListEvent) {
    if (event.matches) finishEntrance();
  }

  onMounted(() => {
    if (!options.enabled || !root.value || typeof root.value.animate !== 'function') return;
    if (document.documentElement.dataset.input === 'keyboard') return;
    motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionPreference.matches) {
      motionPreference = undefined;
      return;
    }

    // Read all resting transforms first, retaining the portrait's slight rotation.
    const targets = [...root.value.querySelectorAll<HTMLElement>('[data-home-enter]')]
      .map((element) => ({ element, transform: getComputedStyle(element).transform }));

    animations = targets.map(({ element, transform }) => element.animate([
      { opacity: 0, transform: `translateY(22px)${transform === 'none' ? '' : ` ${transform}`}` },
      { opacity: 1, transform },
    ], {
      duration: 560,
      delay: Number(element.dataset.homeEnter) || 0,
      easing: 'cubic-bezier(.23, 1, .32, 1)',
      fill: 'both',
    }));

    document.addEventListener('keydown', onKeydown, true);
    motionPreference.addEventListener('change', onMotionChange);
    void Promise.allSettled(animations.map((animation) => animation.finished)).then(finishEntrance);
  });

  // KeepAlive reactivates the existing view without replaying its introduction.
  onDeactivated(finishEntrance);
  onUnmounted(finishEntrance);
}
