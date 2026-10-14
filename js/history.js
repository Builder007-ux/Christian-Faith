// Kirchengeschichte: großer Zeitstrahl (horizontal oder vertikal) mit Ereignissen und
// Heiligen. Jeder Kasten zeigt nur den Namen und führt zur Detailseite.
// Bilder: Feld "image" im Eintrag, bis dahin ein neutraler Platzhalter.

const TIMELINE_KEY = 'cf-timeline';

function timelineMode() {
  try {
    return localStorage.getItem(TIMELINE_KEY) === 'vertical' ? 'vertical' : 'horizontal';
  } catch (e) {
    return 'horizontal';
  }
}

// Wird von den Schaltflächen aufgerufen.
function setTimelineMode(mode) {
  try { localStorage.setItem(TIMELINE_KEY, mode); } catch (e) { /* nicht schlimm */ }
  renderPage();
}

function startYear(y) {
  return parseInt(String(y).split(/[–-]/)[0], 10);
}

// Ereignisse und Heilige in einer Reihe, nach Jahr sortiert.
function timelineItems(h) {
  const events = (h.timeline || []).map((e) => ({
    kind: 'event', id: e.id, start: startYear(e.year), label: e.year,
    name: pick(e.title), major: !!e.major, entry: e,
  }));
  const persons = (h.persons || []).map((p) => ({
    kind: 'person', id: p.id, start: p.start, label: String(p.start),
    name: pick(p.name), major: true, entry: p,
  }));
  return [...events, ...persons].sort((a, b) => a.start - b.start);
}

function href(it) {
  return it.kind === 'event'
    ? `#/geschichte/ereignis/${esc(it.id)}`
    : `#/geschichte/heilige/${esc(it.id)}`;
}

// Bildfläche: echtes Bild, sonst neutraler Platzhalter.
function artOf(entry, kind) {
  if (entry.image) return `<img src="${esc(entry.image)}" alt="" loading="lazy">`;
  if (kind === 'person') {
    return `<svg class="art-placeholder" viewBox="0 0 80 80" aria-hidden="true" focusable="false">
        <circle cx="40" cy="30" r="13" fill="none" stroke="currentColor" stroke-dasharray="4 4" opacity=".5"/>
        <path d="M16 70c3-14 13-22 24-22s21 8 24 22" fill="none" stroke="currentColor" stroke-dasharray="4 4" opacity=".5"/>
      </svg>`;
  }
  return `<svg class="art-placeholder" viewBox="0 0 80 60" aria-hidden="true" focusable="false">
      <rect x="2" y="2" width="76" height="56" rx="12" fill="none" stroke="currentColor" stroke-dasharray="4 4" opacity=".45"/>
      <path d="M40 22v16M32 30h16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity=".55"/>
    </svg>`;
}

// Kasten mit Bild und Name. Ereignisse sind breiter, Personen höher.
function card(it) {
  return `
    <a class="tl-card tl-${it.kind}" href="${href(it)}">
      <span class="tl-card-art">${artOf(it.entry, it.kind)}</span>
      <span class="tl-card-name">${esc(it.name)}</span>
    </a>`;
}

// Unwichtige Ereignisse: nur der Name als Link, kein Kasten.
function minorLabel(it) {
  return `<a class="tl-minor" href="${href(it)}">${esc(it.name)}</a>`;
}

function timelineHorizontal(items) {
  // Ereignisse oben, Personen unten. Die Linie läuft durch alle Punkte.
  const cols = items.map((it) => {
    const body = it.kind === 'event' && !it.major ? minorLabel(it) : card(it);
    const upper = it.kind === 'event' ? `${body}<span class="th-stem"></span>` : '';
    const lower = it.kind === 'person' ? `<span class="th-stem"></span>${body}` : '';
    return `
      <li class="th-item">
        <div class="th-upper">${upper}</div>
        <div class="th-line"><span class="th-dot ${it.major ? 'is-major' : ''}"></span></div>
        <span class="th-year">${esc(it.label)}</span>
        <div class="th-lower">${lower}</div>
      </li>`;
  }).join('');
  return `<div class="tl-scroll" tabindex="0" aria-label="${esc(t('history_timeline_scroll'))}"><ol class="tl-h">${cols}</ol></div>`;
}

function timelineVertical(items) {
  const rows = items.map((it, i) => {
    const side = i % 2 === 0 ? 'left' : 'right';
    const body = it.kind === 'event' && !it.major ? minorLabel(it) : card(it);
    const left = side === 'left' ? body : '';
    const right = side === 'right' ? body : '';
    return `
      <li class="tv-row side-${side}">
        <div class="tv-left">${left}</div>
        <div class="tv-axis"><span class="tv-year">${esc(it.label)}</span><span class="tv-dot ${it.major ? 'is-major' : ''}"></span></div>
        <div class="tv-right">${right}</div>
      </li>`;
  }).join('');
  return `<ol class="tv">${rows}</ol>`;
}

function viewHistory(sub) {
  if (sub[0] === 'heilige' && sub[1]) return viewSaint(sub[1]);
  if (sub[0] === 'ereignis' && sub[1]) return viewEvent(sub[1]);
  return viewHistoryOverview();
}

function viewHistoryOverview() {
  const h = state.content.history || {};
  const items = timelineItems(h);
  const mode = timelineMode();
  const isOn = (m) => (m === mode ? 'true' : 'false');
  const saints = (h.persons || []).map((p) => `
    <a class="card saint" href="#/geschichte/heilige/${esc(p.id)}">
      <span class="saint-name">${esc(pick(p.name))}</span>
      <span class="meta">${esc(pick(p.dates))}</span>
    </a>`).join('');
  return `
    <section class="history">
      <h2>${esc(t('history_title'))}</h2>
      <p class="muted">${esc(t('history_intro'))}</p>

      <div class="view-switch" role="group" aria-label="${esc(t('timeline_title'))}">
        <button type="button" aria-pressed="${isOn('horizontal')}" onclick="setTimelineMode('horizontal')">${esc(t('history_view_horizontal'))}</button>
        <button type="button" aria-pressed="${isOn('vertical')}" onclick="setTimelineMode('vertical')">${esc(t('history_view_vertical'))}</button>
      </div>

      <div class="tl-wrap ${mode === 'horizontal' ? 'is-full' : ''}">
        ${mode === 'horizontal' ? timelineHorizontal(items) : timelineVertical(items)}
      </div>

      <h3 class="subhead">${esc(t('history_saints'))}</h3>
      <p class="muted">${esc(t('history_saints_intro'))}</p>
      <div class="saint-grid">${saints}</div>
    </section>`;
}

function viewEvent(id) {
  const h = state.content.history || {};
  const e = (h.timeline || []).find((x) => x.id === id);
  if (!e) return viewHistoryOverview();
  return `
    <section class="history">
      <a class="back" href="#/geschichte">${esc(t('history_back_timeline'))}</a>
      <article class="card saint-detail">
        <header class="card-head">
          <h2>${esc(pick(e.title))}</h2>
          ${reviewBadge()}
        </header>
        <p class="meta">${esc(e.year)}</p>
        <div class="detail-art">${artOf(e, 'event')}</div>
        <p>${esc(pick(e.text))}</p>
      </article>
    </section>`;
}

function viewSaint(id) {
  const h = state.content.history || {};
  const p = (h.persons || []).find((x) => x.id === id);
  if (!p) return viewHistoryOverview();
  return `
    <section class="history">
      <a class="back" href="#/geschichte">${esc(t('history_back_timeline'))}</a>
      <article class="card saint-detail">
        <header class="card-head">
          <h2>${esc(pick(p.name))}</h2>
          ${reviewBadge()}
        </header>
        <p class="meta">${esc(pick(p.dates))}</p>
        <div class="detail-art">${artOf(p, 'person')}</div>
        <p>${esc(pick(p.text))}</p>
      </article>
    </section>`;
}

// Zeitstrahl mit der Maus ziehen (Ziehen nach links/rechts). Ein Klick auf einen Kasten
// nach dem Ziehen wird nicht als Link gewertet.
(function initTimelineDrag() {
  let drag = null;
  document.addEventListener('pointerdown', (e) => {
    const box = e.target.closest && e.target.closest('.tl-scroll');
    if (!box || e.pointerType !== 'mouse') return;
    drag = { box, x: e.clientX, left: box.scrollLeft, moved: false };
  });
  document.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 4) drag.moved = true;
    drag.box.scrollLeft = drag.left - dx;
  });
  document.addEventListener('pointerup', () => {
    if (drag && drag.moved) {
      drag.box.classList.add('was-dragged');
      setTimeout(() => drag && drag.box.classList.remove('was-dragged'), 0);
    }
    drag = null;
  });
  document.addEventListener('click', (e) => {
    const box = e.target.closest && e.target.closest('.tl-scroll');
    if (box && box.classList.contains('was-dragged')) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
})();
