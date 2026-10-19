"""Sestaví stránky webu ze src/layout.html a src/pages/*.html.

Každá stránka začíná hlavičkou v komentáři:
<!--
title: …
description: …
nav: klíč položky menu (prázdné pro úvod)
three: ano/ne (načíst three.js a 3D díly)
base: nepovinné, např. / (pro 404)
-->
Spuštění: python3 build.py
"""
import re
from pathlib import Path

ROOT = Path(__file__).parent
NAV = [
    ("vyroba", "vyroba.html", "Výroba"),
    ("stroje", "stroje.html", "Stroje"),
    ("zakazky", "zakazky.html", "Zakázky"),
    ("galerie", "galerie.html", "Galerie"),
    ("o-nas", "o-nas.html", "O nás"),
    ("kariera", "kariera.html", "Kariéra"),
]
THREE = '<script src="vendor/three.min.js"></script>\n<script src="parts.js"></script>\n'
NB = " "


def czech_spaces(html):
    """Nezlomitelné mezery po jednopísmenných předložkách a spojkách, v číslech a před jednotkami."""
    parts = re.split(r"(<script.*?</script>|<style.*?</style>|<[^>]+>)", html, flags=re.S)
    for i in range(0, len(parts), 2):
        t = parts[i]
        t = re.sub(r"(?<![^\s(„>])([vVkKsSzZoOuUaAiI]) (?=\S)", lambda m: m.group(1) + NB, t)
        t = re.sub(r"(\d) (?=\d{3}(?!\d))", r"\1" + NB, t)
        t = re.sub(r"\b(\d{3}) (\d{2})\b", r"\1" + NB + r"\2", t)
        t = re.sub(r"(\d) (?=[^\s\d×–-])", r"\1" + NB, t)
        t = t.replace(" × ", NB + "×" + NB)
        t = re.sub(r"Ø (?=\d)", "Ø" + NB, t)
        parts[i] = t
    return "".join(parts)


def build():
    layout = (ROOT / "src/layout.html").read_text(encoding="utf-8")
    for page in sorted((ROOT / "src/pages").glob("*.html")):
        src = page.read_text(encoding="utf-8")
        meta_block = re.match(r"\s*<!--(.*?)-->", src, re.S)
        # [ \t] místo \s: prázdná hodnota (např. „nav:“) nesmí spolknout další řádek
        meta = dict(re.findall(r"^[ \t]*([\w-]+):[ \t]*(.*?)[ \t]*$", meta_block.group(1), re.M))
        body = src[meta_block.end():].strip()
        head = ""
        ld = re.search(r"<script type=\"application/ld\+json\">.*?</script>", body, re.S)
        if ld:
            head = ld.group(0)
            body = body.replace(head, "").strip()
        if meta.get("base"):
            # 404 se servíruje na libovolné adrese, relativní cesty proto musí vycházet z kořene webu
            head = f'<base href="{meta["base"]}">\n' + head
        key = meta.get("nav", "")
        nav = "\n      ".join(
            f'<a href="{href}"{" aria-current=\"page\"" if k == key else ""}>{label}</a>' for k, href, label in NAV
        )
        mnav = "\n        ".join(
            f'<li><a href="{href}"{" aria-current=\"page\"" if k == key else ""}>{label}</a></li>' for k, href, label in NAV
        )
        scripts = (THREE if meta.get("three") == "ano" else "") + '<script src="site.js"></script>'
        html = (layout.replace("{{title}}", meta["title"])
                .replace("{{description}}", meta["description"])
                .replace("{{head}}", head)
                .replace("{{nav}}", nav)
                .replace("{{mnav}}", mnav)
                .replace("{{cta_current}}", ' aria-current="page"' if key == "poptavka" else "")
                .replace("{{content}}", body)
                .replace("{{scripts}}", scripts))
        (ROOT / page.name).write_text(czech_spaces(html), encoding="utf-8")
        print("✓", page.name)


if __name__ == "__main__":
    build()
