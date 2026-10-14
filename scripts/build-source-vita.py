#!/usr/bin/env python3
"""Erzeugt js/source-vita.js aus dem englischen Text der Vita Constantini (NPNF, Band 2/1).

Aufruf:  python3 scripts/build-source-vita.py <textdatei.txt>

Die Textdatei stammt von CCEL (npnf201). Der Text ist gemeinfrei (Übersetzer Ernest Cushing
Richardson, gest. 1939; Erstausgabe 1890). Fußnoten, Seitenzahlen und Kopfzeilen werden
entfernt, Fußnoten-Hochzahlen aus dem Fließtext ebenfalls.
"""
import json
import re
import sys
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "js" / "source-vita.js"

PAGE_NUM = re.compile(r"^\d{3,4}$")
PAGE_HEAD = re.compile(r"^NPNF \(V2-01\)")
FOOT_START = re.compile(r"^3\d{3} ")
INLINE_NOTE = re.compile(r"(?<=[A-Za-z\.,;:’”\)\]\?!])3\d{3}(?=$|[\s,.;:)\]A-Za-z’”—])")
BOOK = re.compile(r"^Book (I|II|III|IV)\.$")
CHAPTER = re.compile(r"^Chapter ([IVXLC]+)\.—(.*)$")
ROMAN = {"I": 1, "II": 2, "III": 3, "IV": 4}


def body_lines(raw_lines):
    """Entfernt Fußnoten (Block vor einer Seitenzahl) und Kopfzeilen; liefert Textzeilen."""
    out, page = [], []

    def flush():
        cut = len(page)
        for i, ln in enumerate(page):
            if FOOT_START.match(ln):
                cut = i
                break
        out.extend(page[:cut])
        page.clear()

    for ln in raw_lines:
        s = ln.strip()
        # Zeilen mit dem Herausgeber-Vermerk "Bag.]" gehören immer zu Fußnoten
        if "Bag.]" in s:
            continue
        if PAGE_NUM.match(s):
            flush()
            continue
        if PAGE_HEAD.match(s) or not s:
            if not s:
                page.append("")
            continue
        page.append(s)
    flush()
    return [strip_notes(l) for l in out]


def strip_notes(line):
    """Entfernt Fußnoten-Hochzahlen; steht danach ein Buchstabe, wird ein Leerzeichen gesetzt."""
    def repl(m):
        nxt = line[m.end():m.end() + 1]
        return " " if nxt.isalpha() else ""
    return re.sub(r"\s+", " ", INLINE_NOTE.sub(repl, line)).strip()


def paragraphs(lines):
    """Fasst Zeilen zu Absätzen zusammen. Kurze Zeile mit Satzende = Absatzende."""
    paras, cur = [], ""
    for ln in lines:
        if not ln:
            if cur:
                paras.append(cur)
                cur = ""
            continue
        cur = f"{cur} {ln}".strip() if cur else ln
        if len(ln) < 70 and ln[-1] in ".!?:”’\"":
            paras.append(cur)
            cur = ""
    if cur:
        paras.append(cur)
    return paras


def main(path):
    raw = Path(path).read_text(encoding="utf-8").splitlines()
    start = next(i for i, l in enumerate(raw) if l.strip() == "Book I.")
    lines = body_lines(raw[start:])

    books = []
    book = None
    chapter = None
    buf = []

    def close_chapter():
        if chapter is not None:
            chapter["paragraphs"] = paragraphs(buf)
            buf.clear()

    i = 0
    while i < len(lines):
        ln = lines[i]
        m_book = BOOK.match(ln)
        m_ch = CHAPTER.match(ln)
        if m_book:
            close_chapter()
            chapter = None
            book = {"number": ROMAN[m_book.group(1)], "chapters": []}
            books.append(book)
        elif m_ch and book is not None:
            close_chapter()
            title = m_ch.group(2).strip()
            # Überschrift kann in die nächste Zeile umbrechen: weiterlesen, solange sie nicht endet
            # Nur wenn die Zeile mit einem Füllwort oder Komma endet, geht die Überschrift weiter
            while title and title.endswith((",", " and", " of", " the", " his", " to", " a", " in", " by", " with", " for", " or", " from", " at", " on", " Diocletian,")) and i + 1 < len(lines):
                i += 1
                title = f"{title} {lines[i]}"
            chapter = {"number": m_ch.group(1), "title": title, "paragraphs": []}
            book["chapters"].append(chapter)
        elif chapter is not None:
            buf.append(ln)
        i += 1
    close_chapter()

    data = {
        "id": "vita-constantini",
        "title": "Vita Constantini – Das Leben des Kaisers Konstantin",
        "author": "Eusebius von Cäsarea",
        "translator": "Ernest Cushing Richardson (NPNF, Serie 2, Band 1)",
        "license": "Gemeinfrei (Übersetzer gest. 1939; Erstausgabe 1890)",
        "source": "https://www.ccel.org/ccel/schaff/npnf201.html",
        "books": books,
    }
    OUT.write_text(
        "// Erzeugt von scripts/build-source-vita.py. Nicht von Hand ändern.\n"
        "window.SOURCE_VITA = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n",
        encoding="utf-8",
    )
    total = sum(len(c["paragraphs"]) for b in books for c in b["chapters"])
    print("Bücher:", [(b["number"], len(b["chapters"])) for b in books], "Absätze:", total)


if __name__ == "__main__":
    main(sys.argv[1])
