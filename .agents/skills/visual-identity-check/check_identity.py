#!/usr/bin/env python3
"""Vérifie mécaniquement la conformité des styles à l'identité visuelle d'ÉtymoLogique.

Usage :
  python3 .agents/skills/visual-identity-check/check_identity.py [chemins...] [--base REF] [--strict]

Sans chemin, analyse docs/. Avec --base REF, ne signale que les lignes ajoutées
ou modifiées depuis REF (git diff). --strict fait échouer aussi sur les avertissements.

La palette de référence est lue dans les propriétés personnalisées de docs/assets/etymo.css.
Une ligne contenant le marqueur « identite: ok » est ignorée (exception assumée, à justifier),
ainsi que les contre-exemples volontaires (class="rule-demo bad").

Règles vérifiées :
  hors-palette     (erreur) couleur absente des jetons d'etymo.css
  blanc-pur        (erreur) blanc pur : le fond est Papier, les surfaces Crème
  degrade-mixte    (erreur) dégradé mêlant deux couleurs de ressource
  texte-sur-vif    (erreur) texte clair sur une couleur vive (le texte y est toujours en Encre)
  encre-variable   (avert.) var(--ink) sur couleur vive : s'inverse en nocturne, préférer var(--fixed-ink)
  ombre-coloree    (avert.) ombre ou halo d'une couleur de ressource ou d'action
"""
import argparse
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
TOKENS = ROOT / "docs" / "assets" / "etymo.css"
EXTENSIONS = {".css", ".html", ".js"}
# « rule-demo bad » : contre-exemples volontaires de la page identité.
SKIP_MARKERS = ("identite: ok", 'class="rule-demo bad"')

RESOURCES = ("prefix", "suffix", "lang", "family", "pli")
VIVID_VARS = {f"--c-{r}" for r in RESOURCES} | {"--c-action", "--c-action-hover", "--c-action-active"}
LIGHT_VARS = {"--cream", "--paper", "--paper-2"}

HEX_RE = re.compile(r"(?<![\w&])#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b")
RGB_RE = re.compile(r"rgba?\(\s*(\d{1,3})\s*,?\s*(\d{1,3})\s*,?\s*(\d{1,3})\s*(?:[,/]\s*([\d.]+%?))?\s*\)")
WHITE_RE = re.compile(r"(?<![-\w])white(?![-\w])")
VAR_RE = re.compile(r"var\(\s*(--[\w-]+)")
DECL_RE = re.compile(r"(?<![\w-])([a-z-]+)\s*:\s*([^;{}\"]+)")
BLOCK_RE = re.compile(r"\{([^{}]*)\}")


def hex_to_rgb(value: str) -> tuple[int, int, int]:
    if len(value) in (3, 4):
        value = "".join(c * 2 for c in value[:3])
    return tuple(int(value[i:i + 2], 16) for i in (0, 2, 4))


def load_palette() -> tuple[set, dict]:
    """Retourne l'ensemble des couleurs autorisées et la famille de chaque couleur de ressource."""
    css = TOKENS.read_text(encoding="utf-8")
    allowed, family = {(0, 0, 0), (0, 0, 0)}, {}
    for name, value in re.findall(r"(--[\w-]+)\s*:\s*#([0-9a-fA-F]{3,8})\b", css):
        rgb = hex_to_rgb(value)
        allowed.add(rgb)
        match = re.match(r"--c-(prefix|suffix|lang|family|pli|action)", name)
        if match:
            family[rgb] = match.group(1)
    return allowed, family


def colors_in(text: str):
    for m in HEX_RE.finditer(text):
        yield m.start(), m.group(0), hex_to_rgb(m.group(1))
    for m in RGB_RE.finditer(text):
        rgb = tuple(int(g) for g in m.groups()[:3])
        if all(c <= 255 for c in rgb):
            yield m.start(), m.group(0), rgb
    for m in WHITE_RE.finditer(text):
        yield m.start(), "white", (255, 255, 255)


def families_in(value: str, family: dict) -> set:
    found = set()
    for name in VAR_RE.findall(value):
        m = re.match(r"--c-(prefix|suffix|lang|family|pli|action)", name)
        if m:
            found.add(m.group(1))
    for _, _, rgb in colors_in(value):
        if rgb in family:
            found.add(family[rgb])
    return found


def is_vivid(value: str, family: dict) -> bool:
    if any(v in VIVID_VARS for v in VAR_RE.findall(value)):
        return True
    bases = {hex_to_rgb(h) for h in ("cdf25a", "4fd1c5", "8f7bf0", "f59ac1", "f4b740", "ff6b4a", "ff8667", "e24e2d")}
    return any(rgb in bases for _, _, rgb in colors_in(value))


def is_light(value: str) -> bool:
    if any(v in LIGHT_VARS for v in VAR_RE.findall(value)):
        return True
    light = {hex_to_rgb(h) for h in ("fffbf3", "f3eee3", "e8dfcc", "ffffff")}
    return any(rgb in light for _, _, rgb in colors_in(value))


def shadow_layers(value: str) -> list[str]:
    """Découpe une valeur d'ombre en couches, en ignorant les virgules entre parenthèses."""
    layers, depth, current = [], 0, ""
    for char in value:
        depth += (char == "(") - (char == ")")
        if char == "," and depth == 0:
            layers.append(current)
            current = ""
        else:
            current += char
    return layers + [current]


def is_ring(layer: str) -> bool:
    """Un anneau (décalages et flou nuls, étalement seul) n'est pas une ombre : focus, pulsation, projecteur."""
    lengths = re.findall(r"(?<![\w.#(-])(-?[\d.]+)(?:px)?(?![\w%])", re.sub(r"\([^)]*\)", "", layer))
    return len(lengths) == 4 and all(float(v) == 0 for v in lengths[:3])


def check_text(text: str, allowed: set, family: dict):
    """Produit des tuples (offset, sévérité, règle, message)."""
    for offset, raw, rgb in colors_in(text):
        if rgb == (255, 255, 255):
            yield offset, "erreur", "blanc-pur", f"{raw} : jamais de blanc pur (Papier #F3EEE3 ou Crème #FFFBF3)"
        elif rgb not in allowed:
            yield offset, "erreur", "hors-palette", f"{raw} n'est pas un jeton d'etymo.css"

    for m in DECL_RE.finditer(text):
        prop, value = m.group(1), m.group(2)
        offset = m.start()
        if "gradient" in value:
            resources = families_in(value, family) - {"action"}
            if len(resources) >= 2:
                yield offset, "erreur", "degrade-mixte", f"dégradé entre ressources ({', '.join(sorted(resources))})"
        if prop in ("box-shadow", "text-shadow") or "drop-shadow" in value:
            tinted = set().union(*(families_in(layer, family) for layer in shadow_layers(value) if not is_ring(layer)))
            if tinted:
                yield offset, "avertissement", "ombre-coloree", f"ombre {', '.join(sorted(tinted))} : les ombres ne sont jamais colorées (sauf vitrine Corail, halos du rituel à justifier)"

    for m in BLOCK_RE.finditer(text):
        body = m.group(1)
        decls = {p: v for p, v in DECL_RE.findall(body)}
        bg = decls.get("background-color") or decls.get("background") or ""
        color = decls.get("color", "")
        if not bg or not color or "gradient" in bg or not is_vivid(bg, family):
            continue
        offset = m.start() + body.find("color")
        if is_light(color):
            yield offset, "erreur", "texte-sur-vif", "texte clair sur couleur vive : le texte y est toujours en Encre"
        elif re.search(r"var\(\s*--ink\s*\)", color):
            yield offset, "avertissement", "encre-variable", "var(--ink) sur couleur vive s'inverse en nocturne : utiliser var(--fixed-ink)"


def changed_lines(base: str, paths: list[Path]) -> dict:
    out = subprocess.run(
        ["git", "diff", "-U0", "--no-color", base, "--", *map(str, paths)],
        cwd=ROOT, capture_output=True, text=True, check=True,
    ).stdout
    result, current = {}, None
    for line in out.splitlines():
        if line.startswith("+++ "):
            current = None if line.endswith("/dev/null") else (ROOT / line[6:]).resolve()
        elif line.startswith("@@") and current:
            m = re.search(r"\+(\d+)(?:,(\d+))?", line)
            start, count = int(m.group(1)), int(m.group(2) or 1)
            result.setdefault(current, set()).update(range(start, start + count))
    untracked = subprocess.run(
        ["git", "ls-files", "--others", "--exclude-standard", "--", *map(str, paths)],
        cwd=ROOT, capture_output=True, text=True, check=True,
    ).stdout.split()
    for name in untracked:
        result[(ROOT / name).resolve()] = None  # fichier nouveau : tout est vérifié
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("paths", nargs="*", type=Path, default=[ROOT / "docs"])
    parser.add_argument("--base", help="ne vérifier que les lignes modifiées depuis cette révision git")
    parser.add_argument("--strict", action="store_true", help="échouer aussi sur les avertissements")
    args = parser.parse_args()

    allowed, family = load_palette()
    files = []
    for p in args.paths:
        p = p.resolve()
        files += [f for f in sorted(p.rglob("*")) if f.suffix in EXTENSIONS] if p.is_dir() else [p]

    scope = changed_lines(args.base, args.paths) if args.base else None
    counts = {"erreur": 0, "avertissement": 0}
    for path in files:
        if scope is not None and path not in scope:
            continue
        text = path.read_text(encoding="utf-8")
        lines = text.split("\n")
        starts = [0]
        for line in lines:
            starts.append(starts[-1] + len(line) + 1)
        seen = set()
        for offset, severity, rule, message in sorted(check_text(text, allowed, family)):
            lineno = next(i for i, s in enumerate(starts) if s > offset)
            if any(m in lines[lineno - 1] for m in SKIP_MARKERS) or (lineno, rule, message) in seen:
                continue
            if scope is not None and scope[path] is not None and lineno not in scope[path]:
                continue
            seen.add((lineno, rule, message))
            counts[severity] += 1
            shown = path.relative_to(ROOT) if path.is_relative_to(ROOT) else path
            print(f"{shown}:{lineno}: [{severity}] {rule} — {message}")

    print(f"\n{counts['erreur']} erreur(s), {counts['avertissement']} avertissement(s)")
    failed = counts["erreur"] or (args.strict and counts["avertissement"])
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
