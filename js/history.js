// Kirchengeschichte: Zeitstrahl (vertikal oder horizontal), wichtige Ereignisse
// als Kästen mit Bildfläche, und die Heiligen mit Detailseiten.
// Ereignisse mit "major": true bekommen einen Kasten. Bilder: Feld "image" im Eintrag,
// bis dahin zeigt die Seite einen neutralen Platzhalter.

const TIMELINE_KEY = 'cf-timeline';

function timelineMode() {
  try {
    return localStorage.getItem(TIMELINE_KEY) === 'horizontal' ? 'horizontal' : 'vertical';
  } catch (e) {
    return 'vertical';
  }
}

// Wird von den Schaltflächen im Zeitstrahl aufgerufen.
function setTimelineMode(mode) {
  try { localStorage.setItem(TIMELINE_KEY, mode); } catch (e) { /* nicht schlimm */ }
  renderPage();
}

// Klappt die Detailansicht eines Ereignisses auf und zu.
function toggleEvent(btn) {
  const detail = document.getElementById(btn.getAttribute('aria-controls'));
  const open = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!open));
  if (detail) detail.hidden = open;
}

// Bildfläche: echtes Bild, sonst neutraler Platzhalter.
function eventArt(e) {
  if (e.image) return `<img src="${esc(e.image)}" alt="" loading="lazy">`;
  return `<svg class="art-placeholder" viewBox="0 0 80 60" aria-hidden="true" focusable="false">
      <rect x="2" y="2" width="76" height="56" rx="12" fill="none" stroke="currentColor" stroke-dasharray="4 4" opacity=".45"/>
      <path d="M40 22v16M32 30h16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity=".55"/>
    </svg>`;
}

// Kasten für ein wichtiges Ereignis: Bildfläche, darunter nur der Name. Tippen klappt Details auf.
function eventBox(e, id) {
  return `
    <div class="event">
      <button class="event-box" type="button" aria-expanded="false" aria-controls="${id}" onclick="toggleEvent(this)">
        <span class="event-art">${eventArt(e)}</span>
        <span class="event-name">${esc(pick(e.title))}</span>
      </button>
      <div class="event-detail" id="${id}" hidden>
        <p class="meta">${esc(e.year)}</p>
        <p>${esc(pick(e.text))}</p>
        ${reviewBadge()}
      </div>
    </div>`;
}

function timelineVertical(events) {
  const rows = events.map((e, i) => {
    const body = e.major
      ? eventBox(e, `ev-${i}`)
      : `<p class="tl-minor"><strong>${esc(pick(e.title))}</strong></p>`;
    return `
      <li class="tl-row ${e.major ? 'is-major' : ''}">
        <span class="tl-year">${esc(e.year)}</span>
        <span class="tl-stem" aria-hidden="true"></span>
        <div class="tl-body">${body}</div>
      </li>`;
  }).join('');
  return `<ol class="tl-vertical">${rows}</ol>`;
}

function timelineHorizontal(events) {
  const cols = events.map((e, i) => {
    const top = e.major
      ? eventBox(e, `ev-${i}`)
      : `<p class="tl-minor"><strong>${esc(pick(e.title))}</strong></p>`;
    return `
      <li class="tl-col ${e.major ? 'is-major' : ''}">
        <div class="tl-col-top">${top}</div>
        <span class="tl-stem-v" aria-hidden="true"></span>
        <span class="tl-dot" aria-hidden="true"></span>
        <span class="tl-year">${esc(e.year)}</span>
      </li>`;
  }).join('');
  return `<div class="tl-scroll"><ol class="tl-horizontal">${cols}</ol></div>`;
}

function viewHistory(sub) {
  if (sub[0] === 'heilige' && sub[1]) return viewSaint(sub[1]);
  return viewHistoryOverview();
}

function viewHistoryOverview() {
  const h = state.content.history || {};
  const events = h.timeline || [];
  const mode = timelineMode();
  const saints = (h.persons || []).map((p) => `
    <a class="card saint" href="#/geschichte/heilige/${esc(p.id)}">
      <span class="saint-name">${esc(pick(p.name))}</span>
      <span class="meta">${esc(pick(p.dates))}</span>
    </a>`).join('');
  const isOn = (m) => (m === mode ? 'true' : 'false');
  return `
    <section class="history">
      <h2>${esc(t('history_title'))}</h2>
      <p class="muted">${esc(t('history_intro'))}</p>

      <div class="view-switch" role="group" aria-label="${esc(t('timeline_title'))}">
        <button type="button" aria-pressed="${isOn('vertical')}" onclick="setTimelineMode('vertical')">${esc(t('history_view_vertical'))}</button>
        <button type="button" aria-pressed="${isOn('horizontal')}" onclick="setTimelineMode('horizontal')">${esc(t('history_view_horizontal'))}</button>
      </div>

      <h3 class="subhead">${esc(t('timeline_title'))}</h3>
      ${mode === 'horizontal' ? timelineHorizontal(events) : timelineVertical(events)}

      <h3 class="subhead">${esc(t('history_saints'))}</h3>
      <p class="muted">${esc(t('history_saints_intro'))}</p>
      <div class="saint-grid">${saints}</div>
    </section>`;
}

function viewSaint(id) {
  const h = state.content.history || {};
  const p = (h.persons || []).find((x) => x.id === id);
  if (!p) return viewHistoryOverview();
  return `
    <section class="history">
      <a class="back" href="#/geschichte">${esc(t('history_back'))}</a>
      <article class="card saint-detail">
        <header class="card-head">
          <h2>${esc(pick(p.name))}</h2>
          ${reviewBadge()}
        </header>
        <p class="meta">${esc(pick(p.dates))}</p>
        <p>${esc(pick(p.text))}</p>
      </article>
    </section>`;
}
