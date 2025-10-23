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


document.addEventListener('DOMContentLoaded', () => {
  const details = {
    "1EN": {
      title: "ROC Version alpha.0.0 Released!",
      date: "2025-10-22",
      content: `
              We’ve added a brand new chemistry study guide covering basic concepts and practice problems.
              This is the first public (demo) release of ROC (version alpha.0.0)!
              Here are current features:
                <ul>
                  <li>Contents for the webpage: what is this page, news, who I am</li>
                  <li>Contents for education: junior high school, high school, undergraduate</li>
                  <li>Contents for competition: IJSO, POSN&TChO</li>
                  <li>Contents for database exam: POSN preliminary round, TChO</li>
                  <li>Dark, light theme are available!</li>
                  <li>Thai language are available for those page!</li>
                </ul>
              Please check it out and stay tuned for the next version!
              `,
    },
    "1TH": {
      title: "เปิดตัว ROC เวอร์ชัน alpha.0.0!",
      date: "2025-10-22",
      content: `
              และนี่ก็คือเว็ปไซต์ที่จะช่วยไกด์คุณในเส้นทางของเคมี! โดยไกด์นี้จะประกอบไปด้วยข้อมูลต่าง ๆ เกี่ยวกับเคมี และโจทย์ฝึกมากมาย
              โดยนี่คือการเปิดตัวครั้งแรก (แบบ demo) ของ ROC (เวอร์ชัน alpha.0.0)!
              เนื้อหาในเว็ปไซต์มีอะไรบ้าง:
                <ul>
                  <li>เนื้อหาสำหรับตัวเว็ป: เว็ปนี้คืออะไร, ผมเป็นใคร</li>
                  <li>เนื้อหาสำหรับการศึกษา: มัธยมต้น, มัธยมปลาย, ปริญญาตรี</li>
                  <li>เนื้อหาสำหรับการแข่งขัน: IJSO, สอวน. & TChO</li>
                  <li>เนื้อหาสำหรับคลังข้อสอบ: สอวน.รอบคัดเลือก, TChO</li>
                  <li>ธีมสว่างและธีมมืดพร้อมให้ใช้งาน!</li>
                  <li>ภาษาอังกฤษก็มีให้ใช้!</li>
                </ul>
              สามารถชมได้ตามอัธยาศัยและรอสำหรับการอัพเดทครั้งต่อไปได้เลย!
              `,
    },
  };

  const card = document.getElementById('news-card');

  document.querySelectorAll('.news-list tr[data-topic]').forEach(row => {
    row.addEventListener('click', () => {
      const id = row.getAttribute('data-topic');
      const news = details[id];
      card.innerHTML = `
        <h3>${news.title}</h3>
        <p><strong>Date:</strong> ${news.date}</p>
        <p>${news.content}</p>
      `;
    });
  });

});
