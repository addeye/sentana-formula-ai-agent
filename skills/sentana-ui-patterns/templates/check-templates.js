#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert');

const baseDir = __dirname;
const files = [
  'tailwind/login.html',
  'tailwind/admin.html',
  'bootstrap5/login.html',
  'bootstrap5/admin.html',
  'theme.js',
  'demo.js',
  'demo.css',
  'check-behavior.js',
  'check-theme.js',
  'README.md'
];

console.log('Running Sentana UI Patterns template structural checks...');

for (const relativePath of files) {
  const fullPath = path.join(baseDir, relativePath);
  assert.ok(fs.existsSync(fullPath), `Missing expected file: ${relativePath}`);
  const content = fs.readFileSync(fullPath, 'utf8');
  assert.ok(content.length > 50, `File is unexpectedly short: ${relativePath}`);

  if (relativePath.endsWith('.html')) {
    assert.match(content, /<!doctype html>/i, `${relativePath} must include <!doctype html>`);
    assert.match(content, /<meta charset=["']utf-8["']/i, `${relativePath} must declare utf-8 charset`);
    assert.match(content, /<meta name=["']viewport["']/i, `${relativePath} must include responsive viewport meta tag`);
    assert.match(content, /preview|demo/i, `${relativePath} must be clearly labeled as preview or demo`);

    // Verify CDN tags
    if (relativePath.startsWith('tailwind/')) {
      assert.match(content, /https:\/\/cdn\.jsdelivr\.net\/npm\/@tailwindcss\/browser@4/, `${relativePath} must reference official Tailwind v4 Play CDN`);
    } else if (relativePath.startsWith('bootstrap5/')) {
      assert.match(content, /https:\/\/cdn\.jsdelivr\.net\/npm\/bootstrap@5\.3\.8\/dist\/css\/bootstrap\.min\.css/, `${relativePath} must reference official Bootstrap 5.3.8 CDN CSS`);
    }

    const ids = [...content.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(ids.length, new Set(ids).size, `${relativePath} has duplicate IDs`);
    for (const match of content.matchAll(/<(?:input|select|textarea)\b[^>]*\bid="([^"]+)"[^>]*>/g)) {
      assert.ok(content.includes(`for="${match[1]}"`), `${relativePath}: missing label for ${match[1]}`);
    }
    for (const match of content.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const target = match[1];
      if (/^https:/.test(target)) continue;
      if (target.startsWith('#')) assert.ok(ids.includes(target.slice(1)), `Missing fragment ${target}`);
      else assert.ok(fs.existsSync(path.resolve(path.dirname(fullPath), target)), `Broken local resource ${target}`);
    }
    assert.ok(content.includes('../demo.js'), `${relativePath} must load demo behavior`);
    assert.ok(content.includes('../demo.css'), `${relativePath} must load shared styles`);
    assert.ok(content.includes('../theme.js'), `${relativePath} must load theme behavior`);
    assert.ok(content.includes('id="theme"'), `${relativePath} must declare #theme selector`);

    // Verify form input labels association
    const inputMatches = [...content.matchAll(/<input[^>]+id=["']([^"']+)["'][^>]*>/g)];
    for (const match of inputMatches) {
      const id = match[1];
      if (id === 'password' || id === 'email' || id === 'name' || id === 'stock' || id === 'search') {
        const hasLabel = content.includes(`for="${id}"`);
        const hasAria = match[0].includes('aria-label');
        assert.ok(hasLabel || hasAria, `Input id="${id}" in ${relativePath} must have an associated <label for="${id}"> or aria-label`);
      }
    }

    // Verify state handling and accessible mobile drawer in admin files
    if (relativePath.includes('admin.html')) {
      assert.ok(content.includes('id="table-region"'), `${relativePath} must contain #table-region`);
      assert.ok(content.includes('id="empty-state"'), `${relativePath} must contain #empty-state`);
      assert.ok(content.includes('id="loading-state"'), `${relativePath} must contain #loading-state`);
      assert.ok(content.includes('id="error-state"'), `${relativePath} must contain #error-state`);
      assert.ok(content.includes('id="product-form"'), `${relativePath} must contain #product-form`);
      assert.ok(content.includes('id="navigation"'), `${relativePath} must contain #navigation`);
      assert.ok(content.includes('id="navigation-dialog"'), `${relativePath} must contain #navigation-dialog`);
      assert.ok(content.includes('id="open-navigation"'), `${relativePath} must contain #open-navigation`);
      assert.ok(content.includes('id="close-navigation"'), `${relativePath} must contain #close-navigation`);
      assert.ok(content.includes('<details id="navigation" open>'), `${relativePath} must keep #navigation open initially for desktop/no-JS resilience`);
    }

    // Verify login password toggle and touch targets in login files
    if (relativePath.includes('login.html')) {
      assert.ok(content.includes('id="toggle-password"'), `${relativePath} must contain password toggle button`);
      assert.ok(content.includes('id="login-form"'), `${relativePath} must contain #login-form`);
      assert.ok(content.includes('id="login-status"'), `${relativePath} must contain #login-status`);
      assert.ok(content.includes('class="demo-link'), `${relativePath} must style links with demo-link`);
    }
  }
}

// Verify demo.js has no credential storage
const demoJsContent = fs.readFileSync(path.join(baseDir, 'demo.js'), 'utf8');
assert.ok(!demoJsContent.includes('localStorage'), 'demo.js must not persist credentials to localStorage');
assert.ok(!demoJsContent.includes('sessionStorage'), 'demo.js must not persist credentials to sessionStorage');
assert.ok(!demoJsContent.includes('document.cookie'), 'demo.js must not persist credentials to document.cookie');
assert.ok(demoJsContent.includes('password.value = \'\''), 'demo.js must wipe password value on submit');

// Non-text contrast verification (WCAG 1.4.11 >= 3:1)
function srgbToLinear(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}
function luminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}
function contrastRatio(hex1, hex2) {
  const l1 = luminance(hex1);
  const l2 = luminance(hex2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const inputBorderContrastWhite = contrastRatio('#64748b', '#ffffff');
const inputBorderContrastSlate50 = contrastRatio('#64748b', '#f8fafc');
assert.ok(inputBorderContrastWhite >= 3.0, `Input boundary contrast on white (${inputBorderContrastWhite.toFixed(2)}) must be >= 3.0`);
assert.ok(inputBorderContrastSlate50 >= 3.0, `Input boundary contrast on slate-50 (${inputBorderContrastSlate50.toFixed(2)}) must be >= 3.0`);

// Check CSS specifications for contrast, touch targets, and drawer
const demoCssContent = fs.readFileSync(path.join(baseDir, 'demo.css'), 'utf8');
assert.ok(demoCssContent.includes('border: 1px solid #64748b;'), 'demo.css must set resting input border to #64748b (>= 3:1 contrast)');
assert.ok(demoCssContent.includes('.demo-link { display: inline-flex; align-items: center; }'), 'demo.css must size .demo-link with inline-flex for 44px min-height');
assert.ok(demoCssContent.includes('#navigation-dialog::backdrop'), 'demo.css must define backdrop styling for mobile drawer');
assert.ok(demoCssContent.includes('#navigation[open] > summary { display: none; }'), 'demo.css must hide summary on desktop when open');

// Run regression behavioral tests
require('./check-behavior.js');
require('./check-theme.js');
for (const [surface, muted, accent, onAccent] of [
  ['#ffffff', '#475569', '#0f766e', '#ffffff'],
  ['#111827', '#94a3b8', '#2dd4bf', '#042f2e']
]) {
  assert.ok(contrastRatio('#64748b', surface) >= 3, 'input boundary contrast in each theme');
  assert.ok(contrastRatio(muted, surface) >= 4.5, 'muted text contrast in each theme');
  assert.ok(contrastRatio(accent, onAccent) >= 4.5, 'primary action contrast in each theme');
}

// Seek browser executables in standard Windows paths
const browserCandidates = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  path.join(process.env.LOCALAPPDATA || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
  'C:\\Program Files\\Mozilla Firefox\\firefox.exe',
  'C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe'
];
const foundBrowsers = browserCandidates.filter(p => fs.existsSync(p));
let automationAvailable = false;
for (const pkg of ['playwright', 'puppeteer', '@playwright/test']) {
  try { require.resolve(pkg); automationAvailable = true; break; } catch {}
}

console.log(`Browser executable discovery: ${foundBrowsers.length ? foundBrowsers.join(', ') : 'None found'}`);
console.log(`Browser automation driver: ${automationAvailable ? 'Available' : 'Not installed (Playwright/Puppeteer missing)'}`);
if (!automationAvailable) {
  console.log('Verification status: Structural, contrast math, and DOM double regression PASSED; browser rendering and accessibility NOT RUN (no installed automation driver).');
}

console.log(`All template structural checks passed successfully (${files.length}/${files.length} files validated).`);
