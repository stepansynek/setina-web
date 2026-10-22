# SETINA přesné obrábění: ukázkový web

Portfolio projekt pro [stepansynek.com](https://stepansynek.com). Fiktivní strojírna z Rousínova u Brna. Běží na [stepansynek.com/setina-web/](https://stepansynek.com/setina-web/).

Vizuální systém je „měřicí protokol“: každé tvrzení na webu je charakteristika s nominálem, tolerancí a naměřenou hodnotou. Bílý papír, grafit, modrá nominálu pro všechny akce, zelené toleranční pole a červená jen pro „mimo toleranci“. Písmo Chivo. Podrobnosti v `DESIGN.md`, fakta o firmě a publiku v `PRODUCT.md`.

## Stránky

| Soubor | Obsah |
| --- | --- |
| `index.html` | Hřídel čerpadla z boku s praporky měřicího protokolu, pole pro výkres, technologie se zkouškou rozměru, vybraná zakázka, firma, modrý závěr s polem pro výkres |
| `vyroba.html` | Soustružení, frézování, broušení, svařování (každé s 3D dílem a rozsahy), materiály a povrchové úpravy |
| `stroje.html` | Strojový park s kontrolou „Vejde se váš díl?“, čtyři kontroly kvality, měrovna |
| `zakazky.html` | Tři zakázky s 3D modely, pro koho vyrábíme, fotky z dílny s filtrem a prohlížečem (bývalá stránka Galerie) |
| `o-nas.html` | Jak se s námi domluvíte, historie, lidé, cesta k nám |
| `kariera.html` | Volná místa s rozpětím mezd na společné ose, co u nás máte, průběh náboru |
| `poptavka.html` | Formulář ve třech krocích s živým náhledem poptávky vpravo |
| `galerie.html` | Jen přesměrování na `zakazky.html#dilna` (generuje `build.py`) |
| `404.html` | Stránka pro neexistující adresu (cesty bere od `/setina-web/` přes `<base href="/setina-web/">`; při nasazení do kořene domény vraťte v `src/pages/404.html` `base: /`) |

## Jak to funguje

- Stránky se skládají ze `src/layout.html` (hlavička, menu, patička) a `src/pages/*.html`. Po úpravě spusťte `python3 build.py`, který přepíše HTML v kořeni a doplní české nezlomitelné mezery. Vygenerovaná HTML v kořeni ručně neupravujte.
- Písmo Chivo (`fonts/`, SIL OFL 1.1) i three.js (`vendor/three.min.js`, r149) leží na webu. Stránky nevolají Google ani CDN, takže se IP adresy návštěvníků nepředávají třetím stranám a web nepotřebuje cookie lištu. Chivo má nulu bez lomítka, takže se v rozměrech neplete se znakem průměru Ø.
- `parts.js` obsahuje 3D modely dílů (hřídel s drážkami pro pero, příruba, frézované pouzdro, kalené pouzdro, svařovaný rám, upínací přípravek). Každý `.stage[data-part]` se po najetí na obrazovku změní v model, který jde otáčet. Hřídel na úvodu používá režim `axis`: pravoúhlý pohled z boku a otáčení kolem vlastní osy, takže praporky pod ní pořád míří na stejná místa. Bez WebGL zůstanou statické rendery z `img/`.
- Praporky na úvodu (`.flag`) nesou v `data-x`, `data-from`, `data-to` a `data-r` polohu měřeného prvku v mm od čela se závitem. Toleranční pruh `.tb` bere polohy v procentech: pole tolerance je vždy 25–75 %, `--at` je naměřená hodnota, `--nom` nominál.
- „Váš díl“: rozměr zadaný na úvodu nebo na stránce Stroje se uloží do `localStorage` (`setina.dil`) a platí na celém webu. Technologie na úvodu, řádky strojů, řádek „Váš díl…“ u technologií na Výrobě i poznámka v poptávce ho převezmou. Pracovní rozsahy jsou v atributu `data-env`: `rot:Ø×délka` (soustruh, bruska), `cyl:Ø×výška` (pětiosé centrum), `box:X×Y×Z` (frézka, měřicí stroj, libovolné natočení), `max:délka` (svařenec). Víc rozsahů odděluje středník. `data-cnc="3"` u řádku strojů říká, kolik CNC strojů řádek představuje (dohromady 12). Když firma koupí nebo prodá stroj, upravte řádek, počet i rozsahy na úvodu (`src/pages/index.html`, seznam `.tech`).
- Pole pro výkres (`form[data-drop]`) na úvodu a v modrých závěrech uloží vybrané soubory do IndexedDB a otevře `poptavka.html?vykres=1`, kde je formulář převezme.
- Přechody mezi stránkami jsou bez animací, jediný pohyb, který web spustí sám, je jednorázové „měření“ hřídele na úvodu (sonda projede zleva doprava). Při `prefers-reduced-motion` se nespustí.

## Obrázky

- Rendery dílů v `img/*.webp` mají průhledné pozadí a vznikají z `parts.js`: spusťte `python3 -m http.server 8731` v kořeni a `node tools/render-stills.js img` (potřebuje `playwright-core` a Google Chrome). Po změně modelu nebo úhlu v HTML je přegenerujte.
- `img/og.jpg` je snímek úvodní hřídele s praporky (1200 × 630).
- Fotky v `img/galerie/` jsou ilustrační, pod licencí CC0 nebo jako volné dílo (zdroje jsou vypsané na stránce Zakázky). Nahraďte je vlastními fotkami z provozu ve stejných názvech, `-nahled.webp` je verze pro mřížku (šířka 720 px).
- Každý obrázek má v metadatech zapsaný původ (`impeccable embed-prompt --read <soubor>`).

## Co změnit u skutečného klienta

1. V `src/layout.html` smazat `<meta name="robots" content="noindex, nofollow">`, doplnit `canonical`, `og:url` a absolutní URL obrázků, přidat `robots.txt` a `sitemap.xml`.
2. Napojit formulář na odesílání (Formspree, Netlify Forms nebo vlastní endpoint). Teď jen ukáže potvrzení. Limit 25 MB je v `site.js` (`FILE_LIMIT`), musí sedět s limitem serveru.
3. Odebrat poznámku o fiktivní firmě v patičce a v potvrzení formuláře.
4. Na serveru nastavit `404.html` jako chybovou stránku (Apache `ErrorDocument 404 /404.html`, Netlify a GitHub Pages ji najdou samy).
5. Hlídat data, která stárnou: volnou kapacitu na úvodu (`src/pages/index.html`, třída `capacity`) a u inzerátů v `kariera.html` pole `datePosted` a `validThrough` ve strukturovaných datech.
6. Naměřené hodnoty na praporcích hřídele a u zakázek nahradit čísly ze skutečných protokolů zákazníka.
