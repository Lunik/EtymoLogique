#!/usr/bin/env python3
"""Régénère la liste des ADR dans docs/adr.html à partir des fichiers docs/adr/*.md.

Usage : python3 docs/scripts/build_adr.py

Le contenu est inséré entre les marqueurs <!-- ADR:START --> et <!-- ADR:END -->.
Le convertisseur ne gère que le sous-ensemble Markdown utilisé par les ADR :
titres, paragraphes, listes (imbriquées), tableaux, citations, gras, italique, code et liens.
"""
import html
import re
from pathlib import Path

DOCS = Path(__file__).resolve().parent.parent
ADR_DIR = DOCS / "adr"
PAGE = DOCS / "adr.html"

# Renvois vers les pages qui illustrent chaque décision.
XREFS = {
    "0001": [("index.html", "Le dossier, pensé mobile d’abord"), ("design-system.html#ds-1-7", "Grille et points de rupture"), ("interfaces.html", "L’inventaire des interfaces"), ("maquettes.html", "Chaque écran sur mobile et ordinateur")],
    "0002": [("codex.html#filiation", "La filiation dans le codex"), ("codex.html#carte-etymologique", "Une carte et ses formes")],
    "0003": [("jeu.html#table", "Des recettes ordonnées sur la table"), ("codex.html#carte-geologie", "Une transformation expliquée")],
    "0004": [("plis.html#chances", "Garantie et filet d’utilité"), ("jeu.html#table", "La réserve de départ")],
    "0005": [("codex.html", "Les cartes éditoriales du codex")],
    "0006": [("codex.html#carte-grec", "Une carte de langue"), ("typographie.html", "Chaque écriture garde sa forme")],
    "0007": [("plis.html", "Tirages et énergie de la démo")],
    "0008": [("plis.html", "L’atelier des plis"), ("mouvement.html", "Le rituel d’ouverture")],
    "0009": [("plis.html#chances", "Poids et chances affichés")],
    "0010": [("design-system.html#accessibilite", "Accessibilité et respect du joueur")],
    "0011": [("plis.html#chances", "Chances par rareté et par brique"), ("identite.html#formes", "Les formes de rareté")],
    "0012": [("jeu.html#table", "Compteurs, « −1 » et briques épuisées"), ("plis.html", "Exemplaires, plafond et filet"), ("design-system.html#ds-3-2", "Réserve et rationnement")],
    "0016": [("plis.html#pkChooser", "Choisir un fascicule"), ("plis.html#jaquettes", "Une jaquette par fascicule")],
    "0015": [("codex.html#codex", "Complétude par fascicule"), ("plis.html#chances", "Légendaires inconnues regroupées")],
    "0014": [("modele.html#sources", "Sources et fascicules"), ("plis.html#fascicules", "Les fascicules côté joueur")],
    "0017": [("modele.html#sources", "Sources et licence du catalogue")],
    "0018": [("plis.html#sablier", "Le sablier dans l’atelier des plis")],
    "0019": [("plis.html#encre", "L’encre gagnée à chaque doublon")],
    "0020": [("plis.html#energie", "Deux plis en attente"), ("plis.html#sablier", "Une goutte, une heure")],
    "0021": [("logo.html#piste-1", "Le sceau retenu et ses déclinaisons"), ("plis.html#plis", "Le logo monochrome sur la face du pli"), ("identite.html#logo", "Le logo dans la charte")],
    "0024": [("interfaces.html#i-04", "Hors connexion et resynchronisation"), ("interfaces.html#i-25", "Action refusée par le serveur"), ("modele.html", "Le modèle éditorial, compilé en artefact")],
    "0023": [("codex.html#codex", "Les textures dans le codex"), ("identite.html#textures", "La règle des textures"), ("cartes-visuels.html#declinaison", "Les dix pistes et la piste retenue")],
    "0022": [("plis.html#fascicules", "Les fascicules côté joueur"), ("modele.html#sources", "Le choix d’un fascicule")],
    "0013": [("modele.html", "Le modèle de données"), ("modele.html#decisions", "Quatre cas, quatre règles"), ("codex.html#filiation", "Formes et filiation dans le codex")],
}


def inline(text: str) -> str:
    text = html.escape(text, quote=False)
    text = re.sub(r"`([^`]+)`", r"<code>\1</code>", text)
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])", r"<em>\1</em>", text)

    def link(match: re.Match) -> str:
        label, href = match.group(1), match.group(2)
        adr = re.match(r"(\d{4})-[\w-]+\.md$", href)
        if adr:
            href = f"#adr-{adr.group(1)}"
        elif href == "README.md":
            href = "#adr-index"
        elif href.startswith("../"):
            href = href[3:]
        return f'<a href="{html.escape(href)}">{label}</a>'

    return re.sub(r"\[([^\]]+)\]\(([^)]+)\)", link, text)


def render_list(lines: list[str]) -> str:
    """Rend une liste Markdown, imbriquée par indentation de deux espaces."""
    out, stack = [], []
    for raw in lines:
        indent = len(raw) - len(raw.lstrip(" "))
        stripped = raw.strip()
        ordered = bool(re.match(r"\d+\. ", stripped))
        item = re.sub(r"^(?:[-*]|\d+\.) ", "", stripped)
        level = indent // 2
        while len(stack) > level + 1:
            out.append(f"</li></{stack.pop()}>")
        if len(stack) == level + 1:
            out.append("</li>")
        while len(stack) < level + 1:
            tag = "ol" if ordered else "ul"
            stack.append(tag)
            out.append(f"<{tag}>")
        out.append(f"<li>{inline(item)}")
    while stack:
        out.append(f"</li></{stack.pop()}>")
    return "".join(out)


def render_table(lines: list[str]) -> str:
    rows = [[c.strip() for c in l.strip().strip("|").split("|")] for l in lines]
    head, body = rows[0], rows[2:]
    thead = "".join(f"<th>{inline(c)}</th>" for c in head)
    tbody = "".join("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>" for r in body)
    return f'<div class="table-scroll"><table><thead><tr>{thead}</tr></thead><tbody>{tbody}</tbody></table></div>'


def render_body(md: str) -> str:
    lines = md.split("\n")
    out, i = [], 0
    is_item = lambda l: bool(re.match(r"\s*(?:[-*]|\d+\.) ", l))
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
        elif line.startswith("#"):
            level = len(line) - len(line.lstrip("#"))
            out.append(f"<h{level + 1}>{inline(line[level:].strip())}</h{level + 1}>")
            i += 1
        elif line.startswith("|"):
            block = []
            while i < len(lines) and lines[i].startswith("|"):
                block.append(lines[i])
                i += 1
            out.append(render_table(block))
        elif line.startswith(">"):
            block = []
            while i < len(lines) and lines[i].startswith(">"):
                block.append(lines[i][1:].strip())
                i += 1
            out.append(f"<blockquote><p>{inline(' '.join(block))}</p></blockquote>")
        elif is_item(line):
            block = []
            while i < len(lines) and (is_item(lines[i]) or (lines[i].startswith("  ") and lines[i].strip())):
                if is_item(lines[i]):
                    block.append(lines[i])
                else:
                    block[-1] += " " + lines[i].strip()
                i += 1
            out.append(render_list(block))
        else:
            block = []
            while i < len(lines) and lines[i].strip() and not re.match(r"(#|\||>|\s*(?:[-*]|\d+\.) )", lines[i]):
                block.append(lines[i].strip())
                i += 1
            out.append(f"<p>{inline(' '.join(block))}</p>")
    return "\n".join(out)


def build() -> None:
    articles, toc = [], []
    for path in sorted(ADR_DIR.glob("[0-9][0-9][0-9][0-9]-*.md")):
        md = path.read_text(encoding="utf-8")
        num = path.name[:4]
        title_line, rest = md.split("\n", 1)
        title = re.sub(r"^#\s*ADR \d{4}\s*—\s*", "", title_line).strip()
        status_match = re.search(r"^- \*\*Statut\*\* : ([^\n]+)", rest, re.M)
        status = status_match.group(1) if status_match else ""
        short = status.split(",")[0].split(".")[0].strip()
        partial = "remplacé" in status or "complété" in status
        links = "".join(f'<a class="xref" href="{h}">{html.escape(t)}</a>' for h, t in XREFS.get(num, []))
        xrefs = f'<p class="xrefs"><span>En situation</span>{links}</p>' if links else ""
        articles.append(
            f'<article class="adr" id="adr-{num}">'
            f'<div class="adr-head"><span class="adr-num">ADR {num}</span>'
            f'<span class="adr-status{" is-partial" if partial else ""}">{html.escape(short)}{" · modifié depuis" if partial else ""}</span>'
            f'<a class="xref" href="adr/{path.name}">Source Markdown</a></div>'
            f'<h2>{inline(title)}</h2><div class="adr-body">{render_body(rest)}</div>{xrefs}</article>'
        )
        toc.append(f'<a href="#adr-{num}"><span>{num}</span>{inline(title)}</a>')
    generated = (
        '<div class="adr-layout">'
        f'<nav class="adr-toc" id="adr-index" aria-label="Liste des ADR">{"".join(toc)}</nav>'
        f'<div class="adr-list">{"".join(articles)}</div></div>'
    )
    page = PAGE.read_text(encoding="utf-8")
    start, end = "<!-- ADR:START -->", "<!-- ADR:END -->"
    a, b = page.index(start) + len(start), page.index(end)
    PAGE.write_text(page[:a] + "\n" + generated + "\n" + page[b:], encoding="utf-8")
    print(f"{len(articles)} ADR écrits dans {PAGE.relative_to(DOCS.parent)}")


if __name__ == "__main__":
    build()
