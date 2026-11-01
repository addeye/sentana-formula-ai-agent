'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(`${__dirname}/demo.js`, 'utf8');
// A small DOM double exercises application transitions, not browser accessibility.
class Element {
  constructor() { this.children = []; this.events = {}; this.attributes = {}; this.value = ''; this.hidden = false; }
  addEventListener(type, fn) { (this.events[type] ??= []).push(fn); }
  fire(type, extra = {}) { for (const fn of this.events[type] ?? []) fn({ preventDefault() {}, target: this, ...extra }); }
  setAttribute(k, v) { this.attributes[k] = v; }
  append(child) { child.parentNode?.remove(child); this.children.push(child); child.parentNode = this; }
  prepend(child) { child.parentNode?.remove(child); this.children.unshift(child); child.parentNode = this; }
  remove(child) { this.children = this.children.filter(x => x !== child); }
  replaceChildren() { this.children = []; }
  contains(child) { return this === child || this.children.some(x => x.contains(child)); }
  querySelector(selector) {
    const all = this.children.flatMap(x => [x, ...x.all()]);
    if (selector.startsWith('[data-product-id')) return all.find(x => x.attributes['data-product-id'] === selector.match(/"(\d+)"/)[1]);
    return all.find(x => x.tag === selector);
  }
  all() { return this.children.flatMap(x => [x, ...x.all()]); }
  focus() { document.activeElement = this; }
  reset() {}
  setCustomValidity() {}
  reportValidity() { return true; }
  showModal() { this.open = true; }
  close() { this.open = false; this.fire('close'); }
}
const ids = Object.fromEntries([...source.matchAll(/byId\('([^']+)'\)/g)].map(x => [x[1], new Element()]));
delete ids['login-form'];
const document = { getElementById: id => ids[id], createElement: tag => Object.assign(new Element(), { tag }) };
const media = new Element();
media.matches = false;
const shell = new Element();
shell.append(ids.navigation);
const summary = Object.assign(new Element(), { tag: 'summary' });
const link = Object.assign(new Element(), { tag: 'a' });
ids.navigation.append(summary);
ids.navigation.append(link);
ids['demo-state'].value = 'normal';
vm.runInNewContext(source, { document, matchMedia: () => media });
const row = () => ids.rows.querySelector('[data-product-id="2"]');
row().fire('click');
ids['cancel-edit'].fire('click');
assert.equal(document.activeElement, row(), 'cancel restores invoking row');
const old = row();
old.fire('click');
ids.name.value = 'Changed tea'; ids.category.value = 'Grocery'; ids.stock.value = '8'; ids.notes.value = '';
ids['product-form'].fire('submit');
assert.notEqual(row(), old);
assert.equal(document.activeElement, row(), 'save restores replacement row');
ids['demo-state'].value = 'error'; ids['demo-state'].fire('change');
ids.retry.fire('click');
assert.equal(document.activeElement, ids['demo-state']);
assert.equal(ids['error-state'].hidden, true);
assert.equal(ids.navigation.parentNode, ids['navigation-dialog']);
assert.equal(ids['open-navigation'].hidden, false);
ids['open-navigation'].fire('click');
assert.equal(ids['navigation-dialog'].open, true);
ids['close-navigation'].fire('click');
assert.equal(document.activeElement, ids['open-navigation']);
ids['navigation-dialog'].getBoundingClientRect = () => ({ left: 0, right: 260, top: 0, bottom: 800 });
ids['open-navigation'].fire('click');
ids['navigation-dialog'].fire('click', { clientX: 300, clientY: 100 });
assert.equal(ids['navigation-dialog'].open, false, 'backdrop click closes drawer');
assert.equal(document.activeElement, ids['open-navigation']);
ids['open-navigation'].fire('click'); link.focus();
media.matches = true; media.fire('change');
assert.equal(ids.navigation.parentNode, shell);
assert.equal(ids['navigation-dialog'].open, false);
assert.equal(document.activeElement, link);
media.matches = false; media.fire('change');
assert.equal(document.activeElement, ids['open-navigation']);
console.log('PASS: retry, edit cancel/save across rerender, drawer close and breakpoint transitions (DOM double).');
