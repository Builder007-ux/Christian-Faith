// Bibel-Ansicht: Altes Testament (Brenton-Septuaginta) mit Buchauswahl,
// Kapitelnavigation und Suche. Der Text wird erst bei Bedarf geladen (js/bible-ot.js).

const BIBLE_GROUPS = [
  { key: 'bible_group_law', from: 0, to: 4 },
  { key: 'bible_group_history', from: 5, to: 16 },
  { key: 'bible_group_wisdom', from: 17, to: 21 },
  { key: 'bible_group_major', from: 22, to: 26 },
  { key: 'bible_group_minor', from: 27, to: 38 },
];

const BIBLE_LAST_KEY = 'cf-bible-last';
let bibleLoadPromise = null;

function bibleSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

function loadBible() {
  if (window.BIBLE_OT) return Promise.resolve();
  if (!bibleLoadPromise) {
    bibleLoadPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'js/bible-ot.js';
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('bible-ot.js konnte nicht geladen werden'));
      document.head.appendChild(s);
    });
  }
  return bibleLoadPromise;
}

function bibleLastRead() {
  try {
    return JSON.parse(localStorage.getItem(BIBLE_LAST_KEY)) || null;
  } catch (e) {
    return null;
  }
}

function rememberBible(bookIndex, chapter) {
  try {
    localStorage.setItem(BIBLE_LAST_KEY, JSON.stringify({ book: bookIndex, ch: chapter }));
  } catch (e) { /* Speicher nicht verfügbar: nicht schlimm */ }
}

// Bücher gruppiert, mit Link und Markierung des aktuellen Buchs.
function bibleBookNav(current) {
  return BIBLE_GROUPS.map((g) => {
    const items = [];
    for (let i = g.from; i <= g.to; i++) {
      const b = window.BIBLE_OT[i];
      items.push(`<a class="pill" href="#/bibel/${bibleSlug(b.book)}/1" ${i === current ? 'aria-current="page"' : ''}>${esc(b.book)}</a>`);
    }
    return `
      <div class="bible-group">
        <h4>${esc(t(g.key))}</h4>
        <div class="pill-row">${items.join('')}</div>
      </div>`;
  }).join('');
}

function bibleChapterNav(book, current, bookIndex) {
  const links = book.chapters.map((c) => `
    <a class="chip ${c.chapter === current ? 'is-current' : ''}" href="#/bibel/${bibleSlug(book.book)}/${c.chapter}">${c.chapter}</a>`).join('');
  return `<div class="chip-grid" data-book="${bookIndex}">${links}</div>`;
}

function bibleFindChapter(bookIndex, chapter) {
  const book = window.BIBLE_OT[bookIndex];
  const ch = book.chapters.find((c) => c.chapter === chapter) || book.chapters[0];
  return { book, ch };
}

// Ansicht: wird von renderPage aufgerufen, Unterpfad z. B. ['genesis', '1'].
function viewBible(sub) {
  // Deutsche Fassung: vorläufig nur die Auszüge aus content.json.
  if (state.lang !== 'en') {
    const passages = (state.content.bible || []).map((p) => `
      <article class="card">
        <header class="card-head">
          <h3>${esc(pick(p.ref))}</h3>
          ${reviewBadge()}
        </header>
        <p class="meta">${esc(t('translation'))}: ${esc(pick(p.translation))}</p>
        <p class="verse">${esc(pick(p.text))}</p>
      </article>`).join('');
    return `
      <section>
        <h2>${esc(t('bible_title'))}</h2>
        <p class="muted">${esc(t('bible_intro'))}</p>
        <p class="note">${esc(t('bible_only_en'))}</p>
        ${passages}
      </section>`;
  }

  if (!window.BIBLE_OT) {
    loadBible()
      .then(() => renderPage())
      .catch(() => { document.getElementById('app').innerHTML = `<p class="note">${esc(t('load_error'))}</p>`; });
    return `<section><p class="muted">${esc(t('bible_loading'))}</p></section>`;
  }

  // Buch und Kapitel aus dem Pfad, sonst zuletzt gelesen, sonst Genesis 1.
  const last = bibleLastRead();
  let bookIndex = window.BIBLE_OT.findIndex((b) => bibleSlug(b.book) === (sub[0] || ''));
  if (bookIndex < 0) bookIndex = last && window.BIBLE_OT[last.book] ? last.book : 0;
  const book = window.BIBLE_OT[bookIndex];
  const requested = parseInt(sub[1], 10);
  const { ch } = bibleFindChapter(bookIndex, Number.isNaN(requested) ? 1 : requested);
  rememberBible(bookIndex, ch.chapter);

  const chIdx = book.chapters.indexOf(ch);
  const prev = book.chapters[chIdx - 1];
  const next = book.chapters[chIdx + 1];
  const pager = `
    <nav class="pager" aria-label="${esc(t('bible_chapters'))}">
      ${prev ? `<a href="#/bibel/${bibleSlug(book.book)}/${prev.chapter}">← ${esc(book.book)} ${prev.chapter}</a>` : '<span></span>'}
      ${next ? `<a href="#/bibel/${bibleSlug(book.book)}/${next.chapter}">${esc(book.book)} ${next.chapter} →</a>` : '<span></span>'}
    </nav>`;

  const verses = ch.verses.map((v) => `
    <li><span class="vnum">${v.verse}</span>${esc(v.text)}</li>`).join('');

  return `
    <section class="bible">
      <h2>${esc(t('bible_title'))}</h2>
      <p class="muted">${esc(t('bible_intro'))}</p>

      <input class="search" type="search" placeholder="${esc(t('bible_search'))}"
             aria-label="${esc(t('bible_search'))}" oninput="bibleSearch(this.value)">
      <div id="bible-results"></div>

      ${bibleBookNav(bookIndex)}

      <h3 class="subhead">${esc(book.book)} · ${esc(t('bible_chapters'))}</h3>
      ${bibleChapterNav(book, ch.chapter, bookIndex)}

      <article class="card reading">
        <header class="card-head">
          <h3>${esc(book.book)} ${ch.chapter}</h3>
          <span class="meta">${esc(t('translation'))}: Brenton (1851)</span>
        </header>
        ${ch.status === 'review' ? `<p class="note">${esc(t('bible_review_note'))}</p>` : ''}
        <ol class="verses">${verses}</ol>
      </article>

      ${pager}
      <p class="note">${esc(t('bible_numbering'))}</p>
    </section>`;
}

// Suche über alle Kapitel. Mindestens 3 Zeichen, maximal 60 Treffer.
function bibleSearch(query) {
  const box = document.getElementById('bible-results');
  if (!box) return;
  const q = (query || '').trim().toLowerCase();
  if (q.length < 3 || !window.BIBLE_OT) {
    box.innerHTML = '';
    return;
  }
  const hits = [];
  for (const book of window.BIBLE_OT) {
    for (const ch of book.chapters) {
      for (const v of ch.verses) {
        const at = v.text.toLowerCase().indexOf(q);
        if (at >= 0) {
          hits.push({ book, ch, v, at });
          if (hits.length >= 60) break;
        }
      }
      if (hits.length >= 60) break;
    }
    if (hits.length >= 60) break;
  }
  if (!hits.length) {
    box.innerHTML = `<p class="note">${esc(t('bible_no_results'))}</p>`;
    return;
  }
  box.innerHTML = `
    <p class="meta">${hits.length >= 60 ? '60+' : hits.length} ${esc(t('bible_results'))}</p>
    <ul class="results">${hits.map((h) => {
      const start = Math.max(0, h.at - 60);
      const snippet = h.v.text.slice(start, h.at + q.length + 80);
      return `<li>
        <a href="#/bibel/${bibleSlug(h.book.book)}/${h.ch.chapter}">
          <strong>${esc(h.book.book)} ${h.ch.chapter}:${h.v.verse}</strong>
          <span>${start > 0 ? '…' : ''}${esc(snippet)}…</span>
        </a>
      </li>`;
    }).join('')}</ul>`;
}
