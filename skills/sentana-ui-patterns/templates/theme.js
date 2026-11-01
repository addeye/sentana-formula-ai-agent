'use strict';

(() => {
  const key = 'sentana-theme';
  const media = matchMedia('(prefers-color-scheme: dark)');
  const valid = value => ['system', 'light', 'dark'].includes(value);
  let selection = 'system';
  try {
    const saved = localStorage.getItem(key);
    if (valid(saved)) selection = saved;
  } catch {}
  const apply = () => {
    const theme = selection === 'system' ? (media.matches ? 'dark' : 'light') : selection;
    document.documentElement.setAttribute('data-bs-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
  };
  apply();
  media.addEventListener('change', () => { if (selection === 'system') apply(); });
  const bindControl = () => {
    const control = document.getElementById('theme');
    if (!control) return;
    control.value = selection;
    control.addEventListener('change', () => {
      if (!valid(control.value)) return;
      selection = control.value;
      try { localStorage.setItem(key, selection); } catch {}
      apply();
    });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindControl);
  } else {
    bindControl();
  }
})();
