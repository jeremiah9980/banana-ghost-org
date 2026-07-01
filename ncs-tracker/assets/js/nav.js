const logoStyle = 'width:42px;height:42px;border-radius:50%;object-fit:cover;display:block;border:2px solid #075DFF;box-shadow:0 0 18px rgba(7,93,255,.45);background:#02040A;';
const THEME_STORAGE_KEY = 'ctx-bombers-site-theme';
const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
document.documentElement.dataset.siteTheme = savedTheme;

const NAV_HTML = `
<nav>
  <div class="nav-inner">
    <a class="nav-brand" href="index.html">
      <img class="nav-logo" style="${logoStyle}" src="../assets/img/bombers-fastpitch-logo.svg" alt="Bombers Fastpitch logo">
      Bombers <span>FASTPITCH</span>
    </a>
    <div class="nav-links">
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="board.html">Board</a>
      <a href="coaching.html">Coaching</a>
      <a href="roster.html">Roster</a>
      <a href="bylaws.html">Bylaws</a>
      <a href="finances.html">Finances</a>
      <a href="policies.html">Policies</a>
      <a href="docs.html">Documents</a>
      <a href="fundraising.html">Support Us</a>
      <a href="contact.html">Contact</a>
    </div>
    <button class="theme-toggle" type="button" aria-label="Toggle dark and light theme" data-theme-toggle>
      <i class="ti ti-moon-stars"></i><span>Dark</span>
    </button>
  </div>
</nav>`;

function loadThemeStylesheet() {
  const href = '../assets/css/theme-toggle.css';
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
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (path.endsWith(a.getAttribute('href').split('/').pop())) a.classList.add('active');
  });
  applyTheme(savedTheme);
  document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
    const current = document.documentElement.dataset.siteTheme === 'light' ? 'light' : 'dark';
    applyTheme(current === 'light' ? 'dark' : 'light');
  });
});