const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const compactViewport = window.matchMedia('(max-width: 700px)');

function setMenuOpen(open) {
  menu.setAttribute('aria-expanded', String(open));
  navigation.hidden = compactViewport.matches && !open;
}

function syncMenu() {
  const focusWasInNavigation = navigation.contains(document.activeElement);
  const focusWasOnMenu = document.activeElement === menu;
  menu.hidden = !compactViewport.matches;
  setMenuOpen(false);

  if (compactViewport.matches && focusWasInNavigation) menu.focus();
  if (!compactViewport.matches && focusWasOnMenu) navigation.querySelector('a').focus();
}

menu.addEventListener('click', () => {
  setMenuOpen(menu.getAttribute('aria-expanded') === 'false');
});

navigation.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (!compactViewport.matches || !link) return;

  const section = document.querySelector(link.hash);
  setMenuOpen(false);
  section.setAttribute('tabindex', '-1');
  section.focus({ preventScroll: true });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
    menu.focus();
  }
});

compactViewport.addEventListener('change', syncMenu);
syncMenu();

const filterBar = document.querySelector('.filter-bar');
const filters = Array.from(filterBar.querySelectorAll('button'));
const products = Array.from(document.querySelectorAll('.product'));
const filterStatus = document.querySelector('#filter-status');

filterBar.addEventListener('click', (event) => {
  const selected = event.target.closest('button[data-filter]');
  if (!selected || selected.getAttribute('aria-pressed') === 'true') return;

  filters.forEach((filter) => filter.setAttribute('aria-pressed', String(filter === selected)));
  const form = selected.dataset.filter;
  let count = 0;

  products.forEach((product) => {
    const matches = form === 'all' || product.dataset.form === form;
    product.hidden = !matches;
    if (matches) count += 1;
  });

  filterStatus.textContent = `${count} ${count === 1 ? 'fragrance' : 'fragrances'} shown.`;
});

filterBar.hidden = false;
