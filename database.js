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
