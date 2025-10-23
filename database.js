(function(){
  const THEME_KEY = 'roc-theme';
  const root = document.documentElement;

  function applyTheme(theme){
    root.setAttribute('data-theme', theme);
    updateIcon(theme);
  }
  function getTheme(){
    return root.getAttribute('data-theme') || 'light';
  }
  function updateIcon(theme){
    const btn = document.querySelector('.theme-toggle');
    if(!btn) return;
    if(theme === 'dark'){
      btn.textContent = '☀️';
      btn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      btn.textContent = '🌙';
      btn.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  // Initialize from saved choice or system preference
  const saved = localStorage.getItem(THEME_KEY);
  const initial = saved ? saved :
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(initial);

  // Toggle on click
  document.addEventListener('click', (e) => {
    const t = e.target;
    if(t && t.classList && t.classList.contains('theme-toggle')){
      const next = getTheme() === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    }
  });

  console.log(document.title + ' Loaded');
})();

(function () {
  const mq = window.matchMedia('(max-width: 768px)');

  function setMenu(open) {
    const nav = document.getElementById('primary-navigation');
    const btn = document.querySelector('.menu-toggle');
    if (!nav || !btn) return;
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  // 1) Open/close when tapping the hamburger (capture=true beats other listeners)
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.menu-toggle');
    if (!btn) return;
    e.preventDefault();
    e.stopImmediatePropagation();   // ignore any conflicting handlers
    const nav = document.getElementById('primary-navigation');
    setMenu(!nav.classList.contains('open'));
  }, true);

  // 2) Close on leaf links (submenu items + top-level non-dropdowns) on phones
  document.addEventListener('click', function (e) {
    if (!mq.matches) return;
    const leaf = e.target.closest('#primary-navigation .dropdown-menu a, #primary-navigation > li:not(.dropdown) > a');
    if (!leaf) return;
    setMenu(false);
  }, true);

  // 3) Parent labels toggle their own submenu on phones (do NOT close panel)
  document.addEventListener('click', function (e) {
    const parentLabel = e.target.closest('#primary-navigation > li.dropdown > a');
    if (!parentLabel || !mq.matches) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const li = parentLabel.parentElement;
    document.querySelectorAll('#primary-navigation li.dropdown.open').forEach(other => {
      if (other !== li) other.classList.remove('open');
    });
    li.classList.toggle('open');
  }, true);

  // 4) Tap outside closes menu on phones
  document.addEventListener('click', function (e) {
    if (!mq.matches) return;
    const inside = e.target.closest('.nav-inner') || e.target.closest('.menu-toggle');
    if (!inside) setMenu(false);
  }, true);

  // 5) Reset when breakpoint changes
  mq.addEventListener?.('change', () => {
    document.querySelectorAll('#primary-navigation li.dropdown').forEach(li => li.classList.remove('open'));
    setMenu(false);
  });
})();


// --- Masonry sizing for .exam-grid ---
(function () {
  const grids = document.querySelectorAll('.exam-grid');
if (!grids.length) return;

grids.forEach(grid => {
  const rowSize = parseFloat(getComputedStyle(grid).gridAutoRows);
  const rowGap = parseFloat(getComputedStyle(grid).gap) || 0;

  function spanFor(el) {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    const total = rect.height
      + parseFloat(style.marginTop) + parseFloat(style.marginBottom);
    return Math.ceil((total + rowGap) / (rowSize + rowGap));
  }

  function sizeItem(item) {
    item.style.gridRowEnd = `span ${spanFor(item)}`;
  }

  function sizeAll() {
    const items = grid.querySelectorAll('.exam-block');
    items.forEach(sizeItem);
  }

  window.addEventListener('load', sizeAll);
  window.addEventListener('resize', sizeAll);

  grid.querySelectorAll('.exam-block details').forEach(d => {
    d.addEventListener('toggle', () => {
      const card = d.closest('.exam-block');
      if (card) sizeItem(card);
    });
  });
});

  const rowSize = parseFloat(getComputedStyle(grid).gridAutoRows); // 8px
  const rowGap = parseFloat(getComputedStyle(grid).gap) || 0;

  function spanFor(el) {
    // total height including margins
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    const total = rect.height
      + parseFloat(style.marginTop) + parseFloat(style.marginBottom);
    // number of rows this item should span
    return Math.ceil((total + rowGap) / (rowSize + rowGap));
  }

  function sizeItem(item) {
    item.style.gridRowEnd = `span ${spanFor(item)}`;
  }

  function sizeAll() {
    const items = grid.querySelectorAll('.exam-block');
    items.forEach(sizeItem);
  }

  // initial + on resize
  window.addEventListener('load', sizeAll);
  window.addEventListener('resize', sizeAll);

  // reflow the specific card when its <details> opens/closes
  grid.querySelectorAll('.exam-block details').forEach(d => {
    d.addEventListener('toggle', () => {
      const card = d.closest('.exam-block');
      if (card) sizeItem(card);
    });
  });
})();


// --- Disable navigation on parent dropdown links ("Education", "Competition") but keep hover dropdown ---
document.querySelectorAll('.nav-links li.dropdown > a[href="education.html"], .nav-links li.dropdown > a[href="competition.html"], .nav-links li.dropdown > a[href="education_th.html"], .nav-links li.dropdown > a[href="competition_th.html"]').forEach(a => {
  a.addEventListener('click', function(e){ e.preventDefault(); });
  a.setAttribute('aria-disabled', 'true');
});