'use strict';

const byId = id => document.getElementById(id);
const login = byId('login-form');
if (login) {
  const password = byId('password');
  const toggleBtn = byId('toggle-password');
  const toggleText = toggleBtn?.querySelector?.('.toggle-text');
  const iconShow = toggleBtn?.querySelector?.('.toggle-icon-show');
  const iconHide = toggleBtn?.querySelector?.('.toggle-icon-hide');
  const updateToggle = visible => {
    password.type = visible ? 'text' : 'password';
    if (toggleText) toggleText.textContent = visible ? 'Hide password' : 'Show password';
    else if (toggleBtn) toggleBtn.textContent = visible ? 'Hide password' : 'Show password';
    if (iconShow) iconShow.hidden = visible;
    if (iconHide) iconHide.hidden = !visible;
    if (toggleBtn) toggleBtn.setAttribute('aria-pressed', String(visible));
  };
  toggleBtn?.addEventListener('click', () => {
    updateToggle(password.type === 'password');
  });
  login.addEventListener('submit', event => {
    event.preventDefault();
    if (!login.reportValidity()) return;
    password.value = '';
    updateToggle(false);
    byId('login-status').textContent = 'Demo complete. No authentication occurred and no credentials were sent or saved. Open the admin preview below.';
  });
}

const productForm = byId('product-form');
if (productForm) {
  // ponytail: memory-only sample records; replace with an authorized API for production.
  const products = [
    { id: 1, name: 'Demo notebook', category: 'Stationery', stock: 24, notes: 'Sample record only.' },
    { id: 2, name: 'Demo tea', category: 'Grocery', stock: 8, notes: '' },
    { id: 3, name: 'Demo pencil', category: 'Stationery', stock: 0, notes: '' }
  ];
  let editingId = null;
  let lastEditId = null;
  let nextId = 4;
  const search = byId('search');
  const state = byId('demo-state');
  const rows = byId('rows');
  const notice = byId('list-status');
  const editor = byId('editor');
  const list = byId('list-view');
  const fields = ['name', 'category', 'stock', 'notes'];

  function render() {
    rows.replaceChildren();
    const mode = state.value;
    byId('table-region').hidden = mode !== 'normal';
    byId('loading-state').hidden = mode !== 'loading';
    byId('empty-state').hidden = mode !== 'empty';
    byId('error-state').hidden = mode !== 'error';
    byId('table-region').setAttribute('aria-busy', String(mode === 'loading'));
    if (mode !== 'normal') {
      notice.textContent = `Demo ${mode} state selected. No network request is running.`;
      return;
    }
    const query = search.value.trim().toLocaleLowerCase();
    const matches = products.filter(product => `${product.name} ${product.category}`.toLocaleLowerCase().includes(query));
    byId('empty-state').hidden = matches.length !== 0;
    byId('table-region').hidden = matches.length === 0;
    notice.textContent = `${matches.length} demo record(s). All changes reset on reload.`;
    for (const product of matches) {
      const row = document.createElement('tr');
      for (const value of [product.name, product.category, product.stock]) {
        const cell = document.createElement('td');
        cell.textContent = String(value);
        row.append(cell);
      }
      const actions = document.createElement('td');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'demo-edit';
      button.setAttribute('data-product-id', String(product.id));
      button.setAttribute('aria-label', `Edit ${product.name}`);
      button.addEventListener('click', () => openEditor(product));
      button.innerHTML = '<svg class="demo-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/></svg><span>Edit</span>';
      actions.append(button);
      row.append(actions);
      rows.append(row);
    }
  }

  function openEditor(product = null) {
    editingId = product ? product.id : null;
    lastEditId = editingId;
    productForm.reset();
    byId('name').setCustomValidity('');
    if (product) fields.forEach(field => { byId(field).value = product[field]; });
    byId('editor-title').textContent = product ? 'Edit demo product' : 'Create demo product';
    byId('form-status').textContent = '';
    list.hidden = true;
    editor.hidden = false;
    byId('name').focus();
  }

  function closeEditor() {
    editor.hidden = true;
    list.hidden = false;
    const targetId = lastEditId;
    editingId = null;
    lastEditId = null;
    if (targetId) {
      const rowButton = rows.querySelector(`[data-product-id="${targetId}"]`);
      if (rowButton) {
        rowButton.focus();
        return;
      }
    }
    byId('create-product').focus();
  }

  search.addEventListener('input', render);
  state.addEventListener('change', render);
  byId('reset-search').addEventListener('click', () => {
    search.value = '';
    state.value = 'normal';
    render();
    search.focus();
  });
  byId('retry').addEventListener('click', () => {
    state.value = 'normal';
    render();
    state.focus();
  });
  byId('create-product').addEventListener('click', () => openEditor());
  byId('empty-create').addEventListener('click', () => openEditor());
  byId('cancel-edit').addEventListener('click', closeEditor);
  byId('name').addEventListener('input', () => byId('name').setCustomValidity(''));
  productForm.addEventListener('submit', event => {
    event.preventDefault();
    byId('name').setCustomValidity(byId('name').value.trim() ? '' : 'Enter a product name, not only spaces.');
    if (!productForm.reportValidity()) return;
    const product = {
      id: editingId ?? nextId++, name: byId('name').value.trim(),
      category: byId('category').value, stock: Number(byId('stock').value),
      notes: byId('notes').value.trim()
    };
    if (!['Stationery', 'Grocery'].includes(product.category) || !Number.isSafeInteger(product.stock) || product.stock < 0 || product.stock > 999999) {
      byId('form-status').textContent = 'Choose a valid category and whole-number stock between 0 and 999999.';
      return;
    }
    const targetId = editingId;
    const index = products.findIndex(item => item.id === editingId);
    if (index < 0) products.push(product); else products[index] = product;
    search.value = '';
    state.value = 'normal';
    render();
    lastEditId = targetId;
    closeEditor();
    notice.textContent = 'Demo product saved in memory only. Reloading discards all changes.';
  });
  render();
}

const navigation = byId('navigation');
const drawer = byId('navigation-dialog');
if (navigation && typeof drawer?.showModal === 'function') {
  const media = matchMedia('(min-width: 768px)');
  const shell = navigation.parentNode;
  const openNav = byId('open-navigation');
  const summary = navigation.querySelector('summary');
  const syncNavigation = () => {
    const hadFocus = navigation.contains(document.activeElement) || drawer.contains(document.activeElement);
    if (drawer.open) drawer.close();
    navigation.open = true;
    summary.hidden = !media.matches;
    openNav.hidden = media.matches;
    if (media.matches) {
      shell.prepend(navigation);
      if (hadFocus) navigation.querySelector('a').focus();
    } else {
      drawer.append(navigation);
      if (hadFocus) openNav.focus();
    }
  };
  openNav.addEventListener('click', () => drawer.showModal());
  byId('close-navigation').addEventListener('click', () => drawer.close());
  drawer.addEventListener('close', () => {
    if (!media.matches) openNav.focus();
  });
  drawer.addEventListener('click', event => {
    if (event.target !== drawer) return;
    const rect = drawer.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) drawer.close();
  });
  media.addEventListener('change', syncNavigation);
  syncNavigation();
}

const themeSelect = byId('theme');
if (themeSelect) {
  const syncThemeIcons = () => {
    const mode = themeSelect.value;
    const icons = typeof document.querySelectorAll === 'function' ? document.querySelectorAll('[data-theme-icon]') : [];
    for (let i = 0; i < icons.length; i++) {
      icons[i].hidden = icons[i].getAttribute('data-theme-icon') !== mode;
    }
  };
  themeSelect.addEventListener('change', syncThemeIcons);
  syncThemeIcons();
}
