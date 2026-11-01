'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const themeSource = fs.readFileSync(path.join(__dirname, 'theme.js'), 'utf8');

function createEnvironment(options = {}) {
  const {
    storedValue = null,
    getItemThrows = false,
    setItemThrows = false,
    mediaMatches = false,
    readyState = 'loading',
    hasControl = true
  } = options;

  let store = {};
  if (storedValue !== null) {
    store['sentana-theme'] = storedValue;
  }

  const storage = {
    getItem(key) {
      if (getItemThrows) throw new Error('SecurityError: Access is denied for localStorage');
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key, value) {
      if (setItemThrows) throw new Error('QuotaExceededError: Storage quota exceeded');
      store[key] = String(value);
    }
  };

  const attributes = {};
  const rootStyle = {};
  const documentElement = {
    setAttribute(name, val) { attributes[name] = String(val); },
    getAttribute(name) { return attributes[name] ?? null; },
    style: rootStyle
  };

  const listeners = {};
  const mediaListeners = [];
  const media = {
    matches: Boolean(mediaMatches),
    addEventListener(event, fn) {
      if (event === 'change') mediaListeners.push(fn);
    },
    change(matches) {
      media.matches = matches;
      for (const fn of mediaListeners) fn({ matches });
    }
  };

  const controlListeners = [];
  const control = hasControl ? {
    value: '',
    addEventListener(event, fn) {
      if (event === 'change') controlListeners.push(fn);
    },
    triggerChange(newVal) {
      control.value = newVal;
      for (const fn of controlListeners) fn({ target: control });
    }
  } : null;

  const doc = {
    documentElement,
    readyState,
    addEventListener(event, fn) {
      (listeners[event] ??= []).push(fn);
    },
    getElementById(id) {
      if (id === 'theme') return control;
      return null;
    },
    fireDOMContentLoaded() {
      doc.readyState = 'interactive';
      for (const fn of listeners.DOMContentLoaded ?? []) fn();
    }
  };

  const context = {
    document: doc,
    localStorage: storage,
    matchMedia: () => media,
    setTimeout: undefined
  };

  vm.runInNewContext(themeSource, context);

  return {
    doc,
    documentElement,
    attributes,
    rootStyle,
    media,
    control,
    store,
    fireReady: () => doc.fireDOMContentLoaded()
  };
}

console.log('Running Sentana theme regression tests...');

// 1. Default to system mode when no storage
{
  const envLight = createEnvironment({ mediaMatches: false });
  assert.equal(envLight.attributes['data-bs-theme'], 'light');
  assert.equal(envLight.attributes['data-theme'], 'light');
  assert.equal(envLight.rootStyle.colorScheme, 'light');

  const envDark = createEnvironment({ mediaMatches: true });
  assert.equal(envDark.attributes['data-bs-theme'], 'dark');
  assert.equal(envDark.attributes['data-theme'], 'dark');
  assert.equal(envDark.rootStyle.colorScheme, 'dark');
}

// 2. Control value binding on DOMContentLoaded
{
  const env = createEnvironment({ mediaMatches: false });
  assert.equal(env.control.value, '');
  env.fireReady();
  assert.equal(env.control.value, 'system');
}

// 3. Follows system changes while in system mode
{
  const env = createEnvironment({ mediaMatches: false });
  env.fireReady();
  assert.equal(env.attributes['data-theme'], 'light');

  env.media.change(true);
  assert.equal(env.attributes['data-theme'], 'dark');
  assert.equal(env.attributes['data-bs-theme'], 'dark');
  assert.equal(env.rootStyle.colorScheme, 'dark');

  env.media.change(false);
  assert.equal(env.attributes['data-theme'], 'light');
  assert.equal(env.attributes['data-bs-theme'], 'light');
  assert.equal(env.rootStyle.colorScheme, 'light');
}

// 4. Manual selection overrides system and persists
{
  const env = createEnvironment({ mediaMatches: false });
  env.fireReady();

  // Select dark
  env.control.triggerChange('dark');
  assert.equal(env.attributes['data-theme'], 'dark');
  assert.equal(env.store['sentana-theme'], 'dark');

  // System media changes should now be ignored
  env.media.change(false);
  assert.equal(env.attributes['data-theme'], 'dark');
  assert.equal(env.attributes['data-bs-theme'], 'dark');

  // Select light
  env.control.triggerChange('light');
  assert.equal(env.attributes['data-theme'], 'light');
  assert.equal(env.store['sentana-theme'], 'light');

  env.media.change(true);
  assert.equal(env.attributes['data-theme'], 'light');

  // Switch back to system
  env.control.triggerChange('system');
  assert.equal(env.store['sentana-theme'], 'system');
  // System media was true, so now theme becomes dark
  assert.equal(env.attributes['data-theme'], 'dark');
}

// 5. Restores persisted manual preference on startup
{
  const envDark = createEnvironment({ storedValue: 'dark', mediaMatches: false });
  assert.equal(envDark.attributes['data-theme'], 'dark');
  envDark.fireReady();
  assert.equal(envDark.control.value, 'dark');

  const envLight = createEnvironment({ storedValue: 'light', mediaMatches: true });
  assert.equal(envLight.attributes['data-theme'], 'light');
  envLight.fireReady();
  assert.equal(envLight.control.value, 'light');

  // Corrupted/unknown value in storage safely defaults to system
  const envInvalid = createEnvironment({ storedValue: 'neon-cyberpunk', mediaMatches: false });
  assert.equal(envInvalid.attributes['data-theme'], 'light');
  envInvalid.fireReady();
  assert.equal(envInvalid.control.value, 'system');
}

// 6. Storage error resilience (disabled localStorage / SecurityError)
{
  const envThrowGet = createEnvironment({ getItemThrows: true, mediaMatches: true });
  assert.equal(envThrowGet.attributes['data-theme'], 'dark');
  envThrowGet.fireReady();
  assert.equal(envThrowGet.control.value, 'system');

  const envThrowSet = createEnvironment({ setItemThrows: true, mediaMatches: false });
  envThrowSet.fireReady();
  // Changing theme should not throw even if localStorage.setItem fails
  assert.doesNotThrow(() => {
    envThrowSet.control.triggerChange('dark');
  });
  assert.equal(envThrowSet.attributes['data-theme'], 'dark');
}

// 7. Late execution when document.readyState is already complete
{
  const envComplete = createEnvironment({ readyState: 'complete', storedValue: 'dark' });
  assert.equal(envComplete.control.value, 'dark');
  assert.equal(envComplete.attributes['data-theme'], 'dark');
}

console.log('PASS: theme storage errors, system follow, manual modes, and flash prevention verified.');
