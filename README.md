# SETINA přesné obrábění: ukázkový web

Portfolio projekt pro [stepansynek.com](https://stepansynek.com). Fiktivní strojírna z Rousínova u Brna. Běží na [stepansynek.com/setina-web/](https://stepansynek.com/setina-web/).

Vizuální systém je „smalt a ocel“: tmavě zelený smalt obráběcích strojů rámuje každou stránku (hlavička, úvod, závěr, patička), obsah leží na bílém papíře a světle zeleném podkladu. Ocel dodávají fotky z dílny sjednocené jednou barevnou úpravou a 3D díly nasvícené ve studiu tónovaném do stejné zelené. Přesnost ukazuje jediné místo, měřicí protokol prvního kusu. Písmo Sofia Sans Condensed na nadpisy a čísla, Sofia Sans na text. Podrobnosti v `DESIGN.md`, fakta o firmě a publiku v `PRODUCT.md`.

## Stránky

| Soubor | Obsah |
| --- | --- |
| `index.html` | Hřídel čerpadla ve 3D přes celou šířku úvodu, technologie s fotkou podle řádku, fotopás, tři zakázky, ukázka měřicího protokolu, rodinná firma, závěr s polem pro výkres |
| `vyroba.html` | Soustružení, frézování, broušení, svařování (každé s fotkou, 3D dílem a rozsahy), materiály a povrchové úpravy |
| `stroje.html` | Strojový park s kontrolou „Vejde se váš díl?“, čtyři kontroly kvality, celý měřicí protokol prvního kusu |
| `zakazky.html` | Tři zakázky s 3D modely, pro koho vyrábíme, fotky z dílny s filtrem a prohlížečem (bývalá stránka Galerie) |
| `o-nas.html` | Jak se s námi domluvíte, historie, lidé, cesta k nám |
| `kariera.html` | Volná místa s rozpětím mezd na společné ose, co u nás máte, průběh náboru |
| `poptavka.html` | Formulář ve třech krocích s živým náhledem poptávky vpravo |
| `galerie.html` | Jen přesměrování na `zakazky.html#dilna` (generuje `build.py`) |
| `404.html` | Stránka pro neexistující adresu (cesty bere od `/setina-web/` přes `<base href="/setina-web/">`; při nasazení do kořene domény vraťte v `src/pages/404.html` `base: /`) |

## Jak to funguje

- Stránky se skládají ze `src/layout.html` (hlavička, menu, patička) a `src/pages/*.html`. Po úpravě spusťte `python3 build.py`, který přepíše HTML v kořeni a doplní české nezlomitelné mezery. Vygenerovaná HTML v kořeni ručně neupravujte.
- Písma Sofia Sans a Sofia Sans Condensed (`fonts/`, SIL OFL 1.1) i three.js (`vendor/three.min.js`, r149) leží na webu. Stránky nevolají Google ani CDN, takže se IP adresy návštěvníků nepředávají třetím stranám a web nepotřebuje cookie lištu.
- `build.py` kromě nezlomitelných mezer zabalí pomlčku v rozsazích (3–320, Po–Pá) do `span.rd`, protože Sofia Sans kreslí pomlčku širší než číslici a v rozsazích by vypadala jako dlouhá.
- `parts.js` obsahuje 3D modely dílů (hřídel s drážkami pro pero, příruba, frézované pouzdro, kalené pouzdro, svařovaný rám, upínací přípravek). Každý `.stage[data-part]` se po najetí na obrazovku změní v model, který jde otáčet. Studio má volbu `tone: 'smalt'`, ve které ocel odráží zelenou barvu stránky. Hřídel na úvodu používá režim `axis`: pravoúhlý pohled z boku a otáčení kolem vlastní osy; při načtení se jednou pootočí a dojede. Bez WebGL zůstanou statické rendery z `img/`.
- „Vejde se váš díl?“ na stránce Stroje: rozměr se uloží do `localStorage` (`setina.dil`), řádky strojů ukážou „vejde se / nevejde se“ a poznámka v poptávce ho převezme. Toleranční pruh `.tb` je jen v měřicím protokolu (pole tolerance 25–75 %, `--at` je naměřená hodnota). Pracovní rozsahy jsou v atributu `data-env`: `rot:Ø×délka` (soustruh, bruska), `cyl:Ø×výška` (pětiosé centrum), `box:X×Y×Z` (frézka, měřicí stroj, libovolné natočení), `max:délka` (svařenec). Víc rozsahů odděluje středník. `data-cnc="3"` u řádku strojů říká, kolik CNC strojů řádek představuje (dohromady 12). Když firma koupí nebo prodá stroj, upravte řádek, počet i rozsahy na úvodu (`src/pages/index.html`, seznam `.tech-list`).
- Pole pro výkres (`form[data-drop]`) v závěru stránek uloží vybrané soubory do IndexedDB a otevře `poptavka.html?vykres=1`, kde je formulář převezme.
- Přechody mezi stránkami jsou bez animací, jediný pohyb, který web spustí sám, je jednorázové pootočení hřídele na úvodu. Při `prefers-reduced-motion` se nespustí.

## Obrázky

- Rendery dílů v `img/*.webp` mají průhledné pozadí a vznikají z `parts.js`: spusťte `python3 -m http.server 8731` v kořeni a `node tools/render-stills.js img` (potřebuje `playwright-core` a Google Chrome). Po změně modelu nebo úhlu v HTML je přegenerujte.
- `img/og.jpg` je snímek úvodu (1200 × 630).
- Fotky v `img/foto/` jsou ilustrační, z Pexels pod licencí Pexels (autoři jsou vypsaní na stránce Zakázky). Všechny prošly stejnou barevnou úpravou (méně sytosti, mírná S-křivka, stíny do smaltově zelené), aby působily jako jedno focení. Nahraďte je vlastními fotkami z provozu ve stejných názvech, `-720.webp` je menší verze pro mřížku a mobil.
- Každý obrázek má v metadatech zapsaný původ (`impeccable embed-prompt --read <soubor>`).

## Co změnit u skutečného klienta

1. V `src/layout.html` smazat `<meta name="robots" content="noindex, nofollow">`, doplnit `canonical`, `og:url` a absolutní URL obrázků, přidat `robots.txt` a `sitemap.xml`.
2. Napojit formulář na odesílání (Formspree, Netlify Forms nebo vlastní endpoint). Teď jen ukáže potvrzení. Limit 25 MB je v `site.js` (`FILE_LIMIT`), musí sedět s limitem serveru.
3. Odebrat poznámku o fiktivní firmě v patičce a v potvrzení formuláře.
4. Na serveru nastavit `404.html` jako chybovou stránku (Apache `ErrorDocument 404 /404.html`, Netlify a GitHub Pages ji najdou samy).
5. Hlídat data, která stárnou: volnou kapacitu na úvodu (`src/pages/index.html`, třída `capacity`) a u inzerátů v `kariera.html` pole `datePosted` a `validThrough` ve strukturovaných datech.
6. Naměřené hodnoty v měřicím protokolu a u zakázek nahradit čísly ze skutečných protokolů zákazníka.
