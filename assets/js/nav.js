const currentPath = window.location.pathname;
const currentFile = currentPath.split('/').pop() || 'index.html';
const isHomePage = currentFile === 'index.html' || currentFile === '';
const isPlayerPage = currentPath.includes('/players/');
const isRosterPage = currentPath.includes('/roster/');
const sitePrefix = isPlayerPage || isRosterPage ? '../' : '';
const assetPrefix = sitePrefix;
const THEME_STORAGE_KEY = 'ctx-bombers-site-theme';

const NAV_LINKS = [
  ['HOME', `${sitePrefix}index.html#home`, 'home'],
  ['Team Info', `${sitePrefix}index.html#team-info`, 'team-info'],
  ['Roster', `${sitePrefix}roster/`, 'roster'],
  ['Schedule', `${sitePrefix}index.html#schedule`, 'schedule'],
  ['GC Stats', `${sitePrefix}index.html#stats`, 'stats'],
  ['Social', `${sitePrefix}index.html#social`, 'social'],
  ['NCS Dashboard', `${sitePrefix}ncs-tracker/`, 'ncs-dashboard'],
  ['Fundraising', `${sitePrefix}index.html#fundraising`, 'fundraising'],
];

const logoStyle = 'width:42px;height:42px;border-radius:50%;object-fit:cover;display:block;border:2px solid #075DFF;box-shadow:0 0 18px rgba(7,93,255,.45);background:#02040A;';

const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
document.documentElement.dataset.siteTheme = savedTheme;

const NAV_HTML = `
<nav>
  <div class="nav-inner">
    <a class="nav-brand" href="${sitePrefix}index.html#home">
      <img class="nav-logo" style="${logoStyle}" src="${assetPrefix}assets/img/bombers-fastpitch-logo.svg" alt="Bombers Fastpitch logo">
      Bombers <span>FASTPITCH</span>
    </a>
    <div class="nav-links">
      ${NAV_LINKS.map(([label, href, id]) => `<a href="${href}" data-anchor-id="${id}">${label}</a>`).join('')}
    </div>
    <button class="theme-toggle" type="button" aria-label="Toggle dark and light theme" data-theme-toggle>
      <i class="ti ti-moon-stars"></i><span>Dark</span>
    </button>
  </div>
</nav>`;

function setActiveAnchor() {
  const activeId = isRosterPage || isPlayerPage ? 'roster' : (window.location.hash || '#home').replace('#', '');
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.anchorId === activeId);
  });
}

function loadPlayerImageData() {
  if (document.querySelector('script[data-bombers-player-images]')) return;
  const script = document.createElement('script');
  script.src = `${assetPrefix}assets/js/player-image-data.js`;
  script.defer = true;
  script.dataset.bombersPlayerImages = 'true';
  document.head.appendChild(script);
}

function loadThemeStylesheet() {
  const href = `${assetPrefix}assets/css/theme-toggle.css`;
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

function applyTheme(theme) {
  const mode = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.siteTheme = mode;
  document.body.dataset.siteTheme = mode;
  localStorage.setItem(THEME_STORAGE_KEY, mode);

  const toggle = document.querySelector('[data-theme-toggle]');
  if (!toggle) return;
  const icon = toggle.querySelector('i');
  const label = toggle.querySelector('span');
  if (icon) icon.className = mode === 'light' ? 'ti ti-sun' : 'ti ti-moon-stars';
  if (label) label.textContent = mode === 'light' ? 'Light' : 'Dark';
  toggle.setAttribute('aria-pressed', mode === 'light' ? 'true' : 'false');
}

document.addEventListener('DOMContentLoaded', () => {
  loadThemeStylesheet();
  document.body.insertAdjacentHTML('afterbegin', NAV_HTML);
  setActiveAnchor();
  loadPlayerImageData();
  applyTheme(savedTheme);
  document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
    const current = document.documentElement.dataset.siteTheme === 'light' ? 'light' : 'dark';
    applyTheme(current === 'light' ? 'dark' : 'light');
  });
  window.addEventListener('hashchange', setActiveAnchor);
});