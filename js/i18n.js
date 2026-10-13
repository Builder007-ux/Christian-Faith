// Sprachen und Oberflächentexte.
// Neue Sprache hinzufügen: Eintrag in LANGS, einen Block in UI, und Felder in data/content.json.
// Geplant: ru (Russisch), bg (Bulgarisch), el (Griechisch).

const LANGS = [
  { code: 'de', label: 'Deutsch', locale: 'de-DE' },
  { code: 'en', label: 'English', locale: 'en-GB' },
];

const UI = {
  de: {
    nav_bibel: 'Bibel',
    nav_gebete: 'Gebete',
    nav_geschichte: 'Geschichte',
    nav_kalender: 'Kalender',
    nav_info: 'Info',

    bible_title: 'Bibel',
    bible_intro: 'Ausgewählte Texte. Der Umfang wird schrittweise erweitert.',
    bible_numbering: 'Hinweis zur Zählung: In der orthodoxen Tradition (Septuaginta) entspricht Psalm 22 hier dem Psalm 23 der üblichen deutschen Zählung.',
    translation: 'Übersetzung',
    bible_group_law: 'Gesetz',
    bible_group_history: 'Geschichte',
    bible_group_wisdom: 'Weisheit und Dichtung',
    bible_group_major: 'Große Propheten',
    bible_group_minor: 'Kleine Propheten',
    bible_chapters: 'Kapitel',
    bible_search: 'Im Alten Testament suchen …',
    bible_results: 'Treffer',
    bible_no_results: 'Keine Treffer gefunden.',
    bible_loading: 'Bibeltext wird geladen …',
    bible_only_en: 'Die vollständige Übersetzung ist derzeit nur auf Englisch verfügbar. Unten stehen vorerst die Auszüge.',
    bible_review_note: 'Die Versnummerierung dieses Kapitels ist noch nicht vollständig geprüft.',

    prayers_title: 'Gebete',
    prayers_intro: 'Kurze Gebete zum Mitbeten. Aufklappen, um den Text zu lesen.',

    history_title: 'Kirchengeschichte',
    history_intro: 'Die großen Ereignisse und einige Menschen, die die Kirche geprägt haben.',
    timeline_title: 'Zeitstrahl',
    persons_title: 'Personen',

    calendar_title: 'Kalender',
    calendar_intro: 'Heutiges Datum im gregorianischen und im julianischen Kalender.',
    calendar_gregorian: 'Gregorianisch (bürgerlich)',
    calendar_julian: 'Julianisch (in manchen orthodoxen Kirchen)',
    calendar_note: 'Die Festordnung und die Lesungen des Tages sind noch nicht hinterlegt. Dieser Bereich folgt in einer späteren Version.',
    calendar_range_note: 'Die Umrechnung (Differenz 13 Tage) gilt für die Jahre 1900 bis 2099.',

    info_title: 'Über Christian Faith',
    info_body: 'Ziel ist eine Website, die es einfacher macht, etwas über den christlichen Glauben zu lernen und ihn zu praktizieren. Der Start erfolgt mit dem orthodoxen Teil, später folgt der katholische Teil. Es geht nicht ums Geld.',
    info_status_title: 'Stand',
    info_status_body: 'Erste Version. Alle Inhalte sind als „in Prüfung“ markiert, bis sie von einem Theologen freigegeben wurden. Nur kanonisierte Schriften und geprüfte Inhalte werden veröffentlicht.',
    info_roadmap_title: 'Geplant',
    info_roadmap: 'Weitere Sprachen (Russisch, Bulgarisch, Griechisch) · Gesänge mit Audio · Gebetsregel mit Erinnerungen · Glossar · Katholischer Teil · Offline-Nutzung',

    review_badge: 'In Prüfung',
    theme_label: 'Design wechseln',
    lang_label: 'Sprache',
    footer: 'Christian Faith · Inhalte werden vor Veröffentlichung theologisch geprüft.',
    load_error: 'Die Inhalte konnten nicht geladen werden. Bitte die Seite über einen lokalen Server öffnen (siehe README).',
  },
  en: {
    nav_bibel: 'Bible',
    nav_gebete: 'Prayers',
    nav_geschichte: 'History',
    nav_kalender: 'Calendar',
    nav_info: 'About',

    bible_title: 'Bible',
    bible_intro: 'Selected texts. The scope will be expanded step by step.',
    bible_numbering: 'Note on numbering: In the Orthodox tradition (Septuagint), Psalm 22 here corresponds to Psalm 23 in the common Western numbering.',
    translation: 'Translation',
    bible_group_law: 'The Law',
    bible_group_history: 'History',
    bible_group_wisdom: 'Wisdom & Poetry',
    bible_group_major: 'Major Prophets',
    bible_group_minor: 'Minor Prophets',
    bible_chapters: 'Chapters',
    bible_search: 'Search the Old Testament …',
    bible_results: 'results',
    bible_no_results: 'No results found.',
    bible_loading: 'Loading Bible text …',
    bible_only_en: 'The full translation is currently available in English only. For now the excerpts are shown below.',
    bible_review_note: 'The verse numbering of this chapter has not yet been fully verified.',

    prayers_title: 'Prayers',
    prayers_intro: 'Short prayers to pray along. Expand to read the text.',

    history_title: 'Church History',
    history_intro: 'The major events and some of the people who shaped the Church.',
    timeline_title: 'Timeline',
    persons_title: 'People',

    calendar_title: 'Calendar',
    calendar_intro: "Today's date in the Gregorian and the Julian calendar.",
    calendar_gregorian: 'Gregorian (civil)',
    calendar_julian: 'Julian (used by some Orthodox churches)',
    calendar_note: 'The feast cycle and the daily readings are not yet included. This section follows in a later version.',
    calendar_range_note: 'The conversion (difference of 13 days) applies to the years 1900 to 2099.',

    info_title: 'About Christian Faith',
    info_body: 'The goal is a website that makes it easier to learn about the Christian faith and to practice it. We start with the Orthodox part; the Catholic part follows later. This is not about making money.',
    info_status_title: 'Status',
    info_status_body: 'First version. All content is marked "under review" until approved by a theologian. Only canonical scripture and reviewed content is published.',
    info_roadmap_title: 'Planned',
    info_roadmap: 'More languages (Russian, Bulgarian, Greek) · Hymns with audio · Prayer rule with reminders · Glossary · Catholic section · Offline use',

    review_badge: 'Under review',
    theme_label: 'Switch theme',
    lang_label: 'Language',
    footer: 'Christian Faith · Content is theologically reviewed before publication.',
    load_error: 'The content could not be loaded. Please open the site through a local server (see README).',
  },
};
