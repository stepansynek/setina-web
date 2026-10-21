# SETINA přesné obrábění: ukázkový web

Portfolio projekt pro [stepansynek.com](https://stepansynek.com). Fiktivní strojírna z Rousínova u Brna.

## Stránky

| Soubor | Obsah |
| --- | --- |
| `index.html` | Úvod: 3D hřídel, technologie, vybraná zakázka, fotky z dílny |
| `vyroba.html` | Soustružení, frézování, broušení, svařování (každá s 3D dílem), materiály |
| `stroje.html` | Strojový park s kontrolou „Vejde se váš díl?“, kontrola kvality, měrovna |
| `zakazky.html` | Tři zakázky s 3D modely |
| `galerie.html` | 16 fotografií s filtrem a prohlížečem (bez 3D, načítá se rychle) |
| `o-nas.html` | Historie, lidé, kde nás najdete |
| `kariera.html` | Volná místa, benefity, průběh náboru |
| `poptavka.html` | Poptávkový formulář ve třech krocích s nahráním výkresu |
| `404.html` | Stránka pro neexistující adresu (cesty bere od `/setina-web/` přes `<base href="/setina-web/">`, web běží na stepansynek.com/setina-web/; při nasazení do kořene domény vraťte v `src/pages/404.html` `base: /`) |

## Jak to funguje

- Stránky se skládají ze `src/layout.html` (hlavička, menu, patička) a `src/pages/*.html`. Po úpravě spusťte `python3 build.py`, který přepíše HTML v kořeni a doplní české nezlomitelné mezery.
- Fonty (`fonts/`, Hubot Sans a Mona Sans, licence SIL OFL 1.1) i three.js (`vendor/three.min.js`, r149) leží na webu. Stránky nevolají Google ani CDN, takže se IP adresy návštěvníků nepředávají třetím stranám a web nepotřebuje cookie lištu.
- Hubot Sans má nulu s vodorovnou čárkou, která na webu strojírny připomíná znak průměru Ø. Číslice v nadpisech proto přes `unicode-range` bere Mona Sans (poslední `@font-face` ve `styles.css`).
- `parts.js` obsahuje 3D modely dílů (hřídel, příruba, frézované pouzdro, kalené pouzdro, svařovaný rám, upínací přípravek) a studiové osvětlení pro three.js r149. Každý prvek `.stage[data-part]` se po najetí na obrazovku změní v model, který jde otáčet. Bez WebGL zůstane statický render z `img/`.
- `site.js` obsluhuje menu, 3D modely, filtr a prohlížeč galerie, kontrolu rozměru dílu a formulář po krocích (hlídá typ a celkovou velikost souborů, převezme rozměr ze stránky Stroje).
- Kontrola „Vejde se váš díl?“ čte pracovní rozsahy z atributů řádků tabulky v `src/pages/stroje.html`: `data-rot="Ø délka"` (soustruhy, bruska), `data-cyl="Ø výška"` (pětiosé centrum), `data-box="X Y Z"` (frézka, měřicí stroj, libovolné natočení), `data-max` (svařence). `data-cnc` řádek započítá do 12 CNC strojů. Když firma koupí nebo prodá stroj, upravte řádek i počet.
- Přechody mezi stránkami používají View Transitions (v prohlížečích, které je umí).

## Fotografie

Fotky v `img/galerie/` jsou ilustrační, pod licencí CC0 nebo jako volné dílo (zdroje jsou vypsané na stránce Galerie). Nahraďte je vlastními fotkami z provozu ve stejných názvech, `-nahled.webp` je verze pro mřížku (šířka 720 px).

## Co změnit u skutečného klienta

1. V `src/layout.html` smazat `<meta name="robots" content="noindex, nofollow">`, doplnit `canonical`, `og:url` a absolutní URL obrázků, přidat `robots.txt` a `sitemap.xml`.
2. Napojit formulář na odesílání (Formspree, Netlify Forms nebo vlastní endpoint). Teď jen ukáže potvrzení. Limit 25 MB je v `site.js` (`FILE_LIMIT`), musí sedět s limitem serveru.
3. Odebrat poznámku o fiktivní firmě v patičce a v potvrzení formuláře.
4. Na serveru nastavit `404.html` jako chybovou stránku (Apache `ErrorDocument 404 /404.html`, Netlify a GitHub Pages ji najdou samy).
5. Hlídat data, která stárnou: volnou kapacitu v úvodu (`src/pages/index.html`, třída `capacity`) a u inzerátů v `kariera.html` pole `datePosted` a `validThrough` ve strukturovaných datech.
