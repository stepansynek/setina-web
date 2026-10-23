---
name: SETINA přesné obrábění
description: A precision machine shop in machine-tool enamel and machined steel. Dark enamel-green grounds, white paper, graded workshop photography and studio-lit 3D parts.
colors:
  smalt: "#1E2F28"
  smalt-deep: "#16231E"
  smalt-2: "#283D34"
  smalt-3: "#34503F"
  smalt-line: "rgba(214, 232, 222, .16)"
  on-dark: "#F3F7F4"
  on-dark-2: "#AFC2B8"
  mist: "#EDF2EF"
  paper: "#FFFFFF"
  ink: "#16211C"
  ink-2: "#47554E"
  ink-3: "#5E6C65"
  rule: "#D3DCD7"
  rule-strong: "#9FAEA6"
  track: "#E3E9E5"
  green: "#3A7258"
  live: "#57C892"
  tolerance: "#1A9A55"
  tolerance-text: "#137A43"
  tolerance-band: "#D3EFDD"
  out-of-range: "#C8283B"
  scrim: "rgba(22, 35, 30, .85)"
  veil: "rgba(22, 35, 30, .97)"
  stage-light: "rgba(196, 226, 210, .11)"
  card-shadow: "rgba(22, 33, 28, .45)"
typography:
  display-xl:
    fontFamily: "Sofia Sans Condensed, Arial Narrow, Helvetica Neue, sans-serif"
    fontSize: "clamp(50px, 6.5vw, 108px)"
    fontWeight: 700
    lineHeight: 0.9
    letterSpacing: "-0.015em"
  display-l:
    fontFamily: "Sofia Sans Condensed, Arial Narrow, Helvetica Neue, sans-serif"
    fontSize: "clamp(46px, 6vw, 92px)"
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: "-0.012em"
  display-m:
    fontFamily: "Sofia Sans Condensed, Arial Narrow, Helvetica Neue, sans-serif"
    fontSize: "clamp(36px, 4.2vw, 64px)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.01em"
  display-s:
    fontFamily: "Sofia Sans Condensed, Arial Narrow, Helvetica Neue, sans-serif"
    fontSize: "clamp(30px, 2.8vw, 44px)"
    fontWeight: 700
    lineHeight: 1.0
  display-xs:
    fontFamily: "Sofia Sans Condensed, Arial Narrow, Helvetica Neue, sans-serif"
    fontSize: "clamp(24px, 2vw, 30px)"
    fontWeight: 700
    lineHeight: 1.05
  display-2xs:
    fontFamily: "Sofia Sans Condensed, Arial Narrow, Helvetica Neue, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.1
  wordmark:
    fontFamily: "Sofia Sans Condensed, Arial Narrow, Helvetica Neue, sans-serif"
    fontSize: "24px"
    fontWeight: 800
    letterSpacing: "0.07em"
  lead:
    fontFamily: "Sofia Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(19px, 1.45vw, 22px)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Sofia Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.6
  body-mobile:
    fontFamily: "Sofia Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  small:
    fontFamily: "Sofia Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Sofia Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.35
rounded:
  control: "4px"
spacing:
  gutter: "clamp(20px, 4vw, 56px)"
  gap: "clamp(20px, 2.4vw, 36px)"
  section: "clamp(80px, 9.5vw, 144px)"
  top-h: "76px"
  container: "1440px"
components:
  button-solid:
    backgroundColor: "{colors.smalt}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.control}"
    padding: "0 22px"
    height: "50px"
  button-solid-hover:
    backgroundColor: "{colors.smalt-3}"
  button-light:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.smalt}"
    rounded: "{rounded.control}"
    padding: "0 22px"
    height: "50px"
  button-light-hover:
    backgroundColor: "{colors.mist}"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "54px"
  drop-zone:
    backgroundColor: "{colors.smalt-2}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.control}"
    padding: "36px"
  drop-zone-hover:
    backgroundColor: "{colors.smalt-3}"
  part-tile:
    backgroundColor: "{colors.smalt}"
  tolerance-bar:
    backgroundColor: "{colors.track}"
    height: "10px"
---

# Design System: SETINA přesné obrábění

## Overview

**Creative North Star: "Enamel and steel"**

Czech machine tools come painted in dark green enamel, and what comes off them is bright machined steel. The site uses the same two materials. The header, every page head, the closing block and the footer sit on the enamel green (smalt). Content in between sits on white paper, with a pale enamel tint (mist) as the alternate ground. Steel appears in two places: studio-lit three.js models of real parts on enamel tiles, and workshop photography graded to one look so stock from different photographers reads as one shoot.

The name helps. A *setina* is a hundredth of a millimetre in machinist slang, so precision is shown once and properly: the first-article measurement protocol (home teaser, full table on Stroje). Tolerance bars live only there.

Type is a condensed grotesque for headings and figures and the regular width of the same family for text. Czech words are long, and the condensed cut lets headlines run large without breaking badly.

**Key characteristics:**
- Enamel green grounds frame every page (top and bottom); white and mist carry content.
- Photography leads: big, graded, full-bleed or near-full-bleed.
- 3D parts always sit on an enamel tile, lit by an environment tinted to the same green.
- One condensed family for display and numbers, one regular-width family for reading.
- Tolerance bars appear only in the measurement protocol.
- 4px corners on controls; photos, tiles and sections are square.

## Colors

### Enamel (smalt)
- **Smalt** (smalt): header, hero, page heads, the band panel, the closing block, part tiles, solid buttons, selected filters and switch positions.
- **Smalt deep** (smalt-deep): footer.
- **Smalt 2 / 3** (smalt-2, smalt-3): the drop zone at rest and on hover; solid-button hover.
- **Smalt line** (smalt-line): hairlines on enamel.
- **On dark / On dark 2** (on-dark, on-dark-2): text on enamel; secondary text on enamel (7:1).

### Paper
- **Paper** (paper): page surface, light buttons on enamel, cards over photos.
- **Mist** (mist): alternate section ground (protocol teaser, timeline, perks), fit-check panel, inquiry preview.
- **Ink / Ink 2 / Ink 3** (ink, ink-2, ink-3): text, secondary text, meta and labels. Ink 3 is the lightest text allowed on white (5.5:1 on white, 4.9:1 on mist).
- **Rule / Rule strong** (rule, rule-strong): row dividers; column and block openers.
- **Track** (track): empty track of a tolerance bar.

### Signal
- **Green** (green): link underlines, step numerals, timeline years, salary figures, focus ring on light grounds.
- **Live** (live): status dot ("volná kapacita"), nav current underline, drop-zone icon on enamel.
- **Tolerance / Tolerance text / Tolerance band** (tolerance, tolerance-text, tolerance-band): the protocol only (limits, in-tolerance values, band fill) plus "vejde se" in the fit check.
- **Out of range** (out-of-range): form errors only.

### Named rules
**The Two Materials Rule.** A section is either enamel or paper. No gradients between them, no tinted cards floating on either.

**The One Protocol Rule.** Tolerance bars and nominal/actual pairs appear in the measurement protocol and nowhere else. Elsewhere a number is set plainly in the condensed face.

## Typography

**Display:** Sofia Sans Condensed 700 (800 for the wordmark), self-hosted variable woff2, Latin and Latin Extended subsets.
**Text:** Sofia Sans 400/600, self-hosted the same way.

### Ramp
- **display-xl** clamp 50–108px: home hero h1.
- **display-l** clamp 46–92px: page h1, closing-block h2.
- **display-m** clamp 36–64px: section h2, step numerals.
- **display-s** clamp 30–44px: case titles, technology names, job titles, salaries, form legends, timeline years, drop-zone title.
- **display-xs** clamp 24–30px: h3, facts and spec values, material names, people, machine names.
- **display-2xs** 22px: timeline h3, protocol characteristic values.
- **lead** clamp 19–22px; **body** 18px (17px under 860px); **small** 16px; **label** 14px.

Figures in tables use tabular lining numerals. Large condensed figures use proportional lining numerals, because tabular digits in the condensed cut space out. Number ranges get a smaller en dash at build time (`span.rd`), since Sofia Sans draws its en dash wider than a digit.

No uppercase labels, no eyebrows, no monospace.

## Layout

A 1440px container, fluid gutter (20–56px) and gap (20–36px) on a 12-column grid. Section headers put the h2 on the left (columns 1–6) and the intro on the right (8–12), bottom-aligned. Sections are separated by a fluid void (80–144px); two white sections in a row share the void.

- **Home:** enamel hero with a two-line h1, lead and actions on the right, and the shaft running the full width beneath, then the caption and capacity line. After it: the technology index (list 1–7, sticky photo 8–12 that follows the hovered row), a full-bleed photo band with an enamel panel, cases (one lead case and two half-width), the protocol teaser on mist (text and a dial-indicator photo with an overlapping protocol card), the family firm, and the closing drop zone.
- **Inner pages:** enamel page head with the text on the left half and a photo filling the right 42% to the viewport edge.
- **Výroba:** sticky subnav, then four process sections on alternating white and mist. Each has a section header, a 21:9 photo, a 3D part tile (columns 1–5) and specs (7–12).
- **Zakázky:** case rows (tile 1–7, text 8–12), segments, and a dense mosaic gallery with filters and a lightbox.

Breakpoints: 1100px collapses the nav into Menu and stacks the hero; 860px stacks splits, hides the sticky tech photo in favour of inline thumbnails, and turns tables into row cards; 600px goes single column.

## Imagery

- **Photos:** Pexels, graded by `grade.py` (saturation 0.6, gentle S-curve, black point lifted to enamel green #13201A, highlights slightly warm). Exported at 2000px and 720px WebP with provenance sidecars. Replace them with the client's own photos in the same names.
- **3D parts:** three.js r149 with a PMREM studio. `tone: 'smalt'` tints the room green so steel reflects the page. Stills are rendered by `tools/render-stills.js` with transparent backgrounds.

## Motion

- On load, the hero shaft turns about half a revolution and settles (inertia 1.9/s). Dragging spins it with the same inertia. Skipped under reduced motion.
- The technology photo crossfades in .4s when the row changes; the active row's top rule draws in .35s.
- State changes take .15s. Nothing animates on scroll.
