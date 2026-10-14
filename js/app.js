// Christian Faith – kleine Single-Page-App ohne Framework.
// Inhalte kommen aus data/content.json, Texte aus js/i18n.js.

const state = {
  content: null,
  lang: localStorage.getItem('cf-lang') || 'de',
  theme: localStorage.getItem('cf-theme') || 'auto',
};

const ROUTES = ['bibel', 'gebete', 'geschichte', 'kalender', 'info'];

// ---------- Hilfsfunktionen ----------

function t(key) {
  return (UI[state.lang] && UI[state.lang][key]) || UI.en[key] || UI.de[key] || key;
}

// Wählt den Text in der aktuellen Sprache, sonst Englisch, sonst Deutsch.
function pick(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return value[state.lang] || value.en || value.de || '';
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function localeOf(code) {
  const l = LANGS.find((x) => x.code === code);
  return l ? l.locale : 'de-DE';
}

// Pfad wie "#/bibel/genesis/1" in Teile zerlegen: ['bibel', 'genesis', '1'].
function routeParts() {
  return location.hash.replace(/^#\//, '').split('/').filter(Boolean);
}

function currentRoute() {
  const r = routeParts()[0] || '';
  return ROUTES.includes(r) ? r : 'bibel';
}

function reviewBadge() {
  return `<span class="badge">${esc(t('review_badge'))}</span>`;
}

// ---------- Ansichten ----------

function viewPrayers() {
  const items = (state.content.prayers || []).map((p) => `
    <details class="card">
      <summary>
        <span class="summary-title">${esc(pick(p.title))}</span>
        ${reviewBadge()}
      </summary>
      <p class="prayer">${esc(pick(p.text)).replace(/\n/g, '<br>')}</p>
    </details>`).join('');
  return `
    <section>
      <h2>${esc(t('prayers_title'))}</h2>
      <p class="muted">${esc(t('prayers_intro'))}</p>
      ${items}
    </section>`;
}

function viewCalendar() {
  const now = new Date();
  // Heutiges Datum (lokal) als UTC-Datum, damit keine Zeitzonenverschiebung entsteht.
  const gregorian = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  // Julianischer Kalender liegt im 20./21. Jahrhundert 13 Tage hinter dem gregorianischen.
  const julian = new Date(gregorian.getTime() - 13 * 24 * 60 * 60 * 1000);
  const fmt = new Intl.DateTimeFormat(localeOf(state.lang), {
    dateStyle: 'full', timeZone: 'UTC',
  });
  return `
    <section>
      <h2>${esc(t('calendar_title'))}</h2>
      <p class="muted">${esc(t('calendar_intro'))}</p>
      <article class="card">
        <p class="meta">${esc(t('calendar_gregorian'))}</p>
        <p class="big">${esc(fmt.format(gregorian))}</p>
      </article>
      <article class="card">
        <p class="meta">${esc(t('calendar_julian'))}</p>
        <p class="big">${esc(fmt.format(julian))}</p>
      </article>
      <p class="note">${esc(t('calendar_range_note'))}</p>
      <p class="note">${esc(t('calendar_note'))}</p>
    </section>`;
}

function viewInfo() {
  return `
    <section>
      <h2>${esc(t('info_title'))}</h2>
      <p>${esc(t('info_body'))}</p>
      <h3 class="subhead">${esc(t('info_status_title'))}</h3>
      <p>${esc(t('info_status_body'))}</p>
      <h3 class="subhead">${esc(t('info_roadmap_title'))}</h3>
      <p>${esc(t('info_roadmap'))}</p>
    </section>`;
}

const VIEWS = {
  bibel: viewBible,
  gebete: viewPrayers,
  geschichte: viewHistory,
  kalender: viewCalendar,
  info: viewInfo,
};

// ---------- Rendering ----------

function renderNav() {
  const route = currentRoute();
  document.getElementById('nav').innerHTML = ROUTES.map((r) => `
    <a href="#/${r}" ${r === route ? 'aria-current="page"' : ''}>${esc(t('nav_' + r))}</a>`).join('');
}

function renderLangSelect() {
  const sel = document.getElementById('lang');
  sel.innerHTML = LANGS.map((l) => `
    <option value="${l.code}" ${l.code === state.lang ? 'selected' : ''}>${esc(l.label)}</option>`).join('');
  sel.setAttribute('aria-label', t('lang_label'));
  document.getElementById('theme').setAttribute('aria-label', t('theme_label'));
}

function renderFooter() {
  document.getElementById('footer').textContent = t('footer');
}

function renderPage() {
  const route = currentRoute();
  const app = document.getElementById('app');
  if (!state.content) {
    app.innerHTML = `<p class="note">${esc(t('load_error'))}</p>`;
    return;
  }
  app.innerHTML = VIEWS[route](routeParts().slice(1));
  document.documentElement.lang = state.lang;
  document.title = `${t('nav_' + route)} · Christian Faith`;
  app.focus({ preventScroll: true });
}

function renderAll() {
  document.documentElement.lang = state.lang;
  renderLangSelect();
  renderNav();
  renderFooter();
  renderPage();
}

// ---------- Theme ----------

function applyTheme() {
  const root = document.documentElement;
  if (state.theme === 'auto') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', state.theme);
}

function toggleTheme() {
  const isDark = state.theme === 'dark' ||
    (state.theme === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  state.theme = isDark ? 'light' : 'dark';
  localStorage.setItem('cf-theme', state.theme);
  applyTheme();
}

// ---------- Start ----------

async function init() {
  applyTheme();

  document.getElementById('lang').addEventListener('change', (e) => {
    state.lang = e.target.value;
    localStorage.setItem('cf-lang', state.lang);
    renderAll();
  });
  document.getElementById('theme').addEventListener('click', toggleTheme);
  window.addEventListener('hashchange', () => {
    renderNav();
    renderPage();
    // Neue Seite beginnt oben, nicht an der alten Scrollposition
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  });

  // Inhalte: zuerst die eingebettete Fassung (funktioniert auch per Doppelklick),
  // sonst die JSON-Datei über einen Webserver.
  if (window.CONTENT_DATA) {
    state.content = window.CONTENT_DATA;
  } else {
    try {
      const res = await fetch('data/content.json');
      if (!res.ok) throw new Error(res.statusText);
      state.content = await res.json();
    } catch (err) {
      console.error('Inhalte konnten nicht geladen werden:', err);
    }
  }

  if (!location.hash) history.replaceState(null, '', '#/bibel');
  renderAll();

  // Offline-Funktion gibt es nur über http(s), nicht bei Doppelklick (file://).
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch((err) => console.warn('SW:', err));
  }
}

init();
