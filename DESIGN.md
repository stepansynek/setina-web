---
name: SETINA přesné obrábění
description: The website as a first-article measurement protocol; every claim is a characteristic with nominal, tolerance and actual.
colors:
  nominal: "#2442D6"
  nominal-deep: "#1A33B0"
  nominal-wash: "#F1F4FE"
  tolerance: "#1A9A55"
  tolerance-text: "#137A43"
  tolerance-band: "#D3EFDD"
  out-of-range: "#C8283B"
  paper: "#FFFFFF"
  ink: "#15181C"
  ink-2: "#4B535D"
  ink-3: "#5F6873"
  field: "#8A929C"
  rule: "#D5D9DE"
  track: "#EEF0F2"
typography:
  display:
    fontFamily: "Chivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(40px, 5.2vw, 76px)"
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Chivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(30px, 3vw, 46px)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.022em"
  title:
    fontFamily: "Chivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(20px, 1.6vw, 24px)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  figure:
    fontFamily: "Chivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(20px, 1.75vw, 26px)"
    fontWeight: 700
    letterSpacing: "-0.01em"
    fontFeature: "\"tnum\", \"lnum\""
  lead:
    fontFamily: "Chivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(18px, 1.3vw, 20px)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Chivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Chivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "14.5px"
    fontWeight: 400
    lineHeight: 1.4
  caption:
    fontFamily: "Chivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "13.5px"
    fontWeight: 400
rounded:
  hairline: "2px"
spacing:
  gutter: "clamp(20px, 4.45vw, 64px)"
  gap: "clamp(20px, 2.2vw, 32px)"
  void: "clamp(96px, 11vw, 168px)"
  top-h: "72px"
  container: "1440px"
components:
  button-go:
    backgroundColor: "{colors.nominal}"
    textColor: "{colors.paper}"
    rounded: "{rounded.hairline}"
    padding: "0 20px"
    height: "48px"
  button-go-hover:
    backgroundColor: "{colors.nominal-deep}"
    textColor: "{colors.paper}"
  button-line:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.hairline}"
    padding: "0 20px"
    height: "48px"
  button-line-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  switch-position:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.hairline}"
    padding: "0 16px"
    height: "44px"
  switch-position-on:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.hairline}"
    padding: "0 14px"
    height: "50px"
  drop-zone:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.hairline}"
    padding: "16px 16px 16px 22px"
  drop-zone-hover:
    backgroundColor: "{colors.nominal-wash}"
  tolerance-bar:
    backgroundColor: "{colors.track}"
    height: "8px"
---

# Design System: SETINA přesné obrábění

## Overview

**Creative North Star: "The Measurement Protocol"**

The site reads like a CMM inspection report for a machine shop. White paper, graphite ink, one blue that marks what is nominal and what you can act on, one green that marks the tolerance field and in-tolerance results, and a red held back for out-of-range. Claims are not adjectives: they are characteristics, each with a nominal, a tolerance and a measured actual, and wherever a number can be placed against a limit a tolerance bar shows where it sits.

Density is protocol density: rows divided by 1px hairlines, sections opened by a 2px ink rule, and large real voids between sections instead of tinted bands. Everything sits on the same white sheet. Controls are labelled switches with named positions; the selected position turns solid ink. Depth comes from the parts themselves (three.js models of turned, ground and milled steel), never from shadowed UI.

Motion is instrumental. State changes are quick (0.15s); a measured marker settles into place on a long ease-out; the one authored moment is the probe sweep on the hero shaft, which measures each feature in turn once on load and is skipped under reduced motion.

**Key Characteristics:**
- White paper only; sections separated by 2px ink rules and voids, never by tinted bands.
- Blue is ink for action and nominal values, not a surface colour.
- Every precision claim is nominal / tolerance / actual plus a tolerance bar.
- Chivo throughout; figures are tabular and lining.
- 2px corners on everything that has a corner.
- Choices are switches with named positions; selected = solid ink.

## Colors

Spot-ink palette on white: graphite neutrals plus three signal inks, each with exactly one meaning.

### Primary
- **Nominal Blue** (nominal): primary buttons ("Poslat výkres", "Vybrat výkres"), text links, the dashed drop-zone stroke and its upload icon, the nominal tick on a tolerance bar, the hovered flag's rule and value, step counters, focus outlines, selection and caret.
- **Deep Nominal** (nominal-deep): hover state of the primary button only.
- **Nominal Wash** (nominal-wash): the hover/drag-over fill of a drawing drop zone. It is a state, never a resting surface.

### Secondary
- **Tolerance Green** (tolerance): tolerance-field limits (2px end strokes on a bar), the status square beside capacity and fit lines, the logo's centre dot, the completed-form rule.
- **Tolerance Text Green** (tolerance-text): measured actuals and "fits" verdicts set as text, where the brighter green would fail contrast.
- **Tolerance Band** (tolerance-band): the pale fill between the tolerance limits on a bar, and the one-off settle flash on a changed inquiry-preview row.

### Tertiary
- **Out-of-Range Red** (out-of-range): a measured marker or fit marker outside the field, "does not fit" verdicts, form errors and invalid-field borders. Nothing else.

### Neutral
- **Paper** (paper): the only page surface.
- **Graphite Ink** (ink): text, 2px section rules, 1.5px control strokes, selected switch positions, the measured marker on a tolerance bar, the logo bars.
- **Ink 2** (ink-2): secondary prose, leads, feature names, table cells.
- **Ink 3** (ink-3): captions, column heads, field units, placeholders, legal line.
- **Field Grey** (field): input and dimension-field borders at rest; scrollbar thumb.
- **Rule Grey** (rule): 1px row dividers, header bottom border, footer hairline.
- **Track Grey** (track): the empty track of a tolerance bar; hover fill of an unselected switch position or choice.

### Named Rules
**The Nominal Ink Rule.** Blue marks what is nominal and what you can act on. It fills a button or a focus ring, never a section, band or closing block.

**The Out-of-Range Rule.** Red appears only when a value or input is outside its limits. It is never emphasis or decoration.

**The Green Means In-Tolerance Rule.** Green belongs to tolerance limits, the band between them and results that fall inside. A green square is a status, not a bullet.

## Typography

**Display Font:** Chivo (with Helvetica Neue, Arial, sans-serif), self-hosted variable woff2
**Body Font:** Chivo (same stack)

**Character:** One grotesque in weights 400 / 600 / 700 / 800, set tight at display sizes and plain at reading sizes, like the typeset header and rows of an inspection report.

### Hierarchy
- **Display** (700, clamp 40–76px, 1.0, -0.03em): page h1 only; on the home page two lines beside the drop-zone column.
- **Headline** (700, clamp 30–46px, 1.05, -0.022em): section h2; case titles step down to clamp 28–40px.
- **Title** (700, clamp 20–24px, 1.2, -0.01em): h3, technology names (up to 28px), steps, form legends (clamp 24–30px).
- **Figure** (700, clamp 20–26px, tabular): the nominal value on a measurement flag; timeline years use the same treatment at 24–32px.
- **Lead** (400, clamp 18–20px, 1.5, ink-2): one paragraph under an h1, 46–64ch.
- **Body** (400, 17px, 1.55; 16.5px under 640px): prose at 56–64ch.
- **Label** (400–600, 14.5–15.5px): row terms, nav (15.5px), switch positions (600, 15px), field labels (600, 15.5px).
- **Caption** (400, 13–14px, ink-3): figure captions, table column heads, units, legal line.
- **Logo wordmark** (800, 20px, +0.08em): "SETINA" only.

### Named Rules
**The Tabular Figures Rule.** Every number a buyer might compare (values, tolerances, phone numbers, counts, pay, dates) is set with tabular lining figures.

**The No-Uppercase Rule.** Labels are sentence case at small size in a quieter ink; no tracked uppercase except the wordmark.

## Layout

A 1440px container with fluid gutters (clamp 20–64px) and a fluid gap (clamp 20–32px). Content blocks use a 12-column grid: text 1–6 against figure 8–12, or model 1–6 against text 7–12; protocols use 3:9; the closing block splits 5 / 4 / 3 (text, drop zone, named person). Sections start with a 2px ink rule and are separated by a large void (clamp 96–168px); the first section under a page head uses a smaller top (clamp 40–72px).

The header is sticky at 72px on white with a 1px rule; on sub-pages a second sticky switch bar (Výroba sections) sits under it. Breakpoints: 1120px collapses the nav and phone into a Menu button; 1080px drops the hero to one column and the flags to three; 860px stacks every split, turns tables into stacked row cards; 640px goes single column, flags become two-column rows.

The hero shaft band runs the full measure of the container: an orthographic side view with six measurement flags beneath it, joined by leader lines (hidden below 1080px).

## Elevation & Depth

Flat. No UI element casts a shadow. Hierarchy comes from rule weight (2px ink opens, 1.5px ink frames controls and table heads, 1px grey divides rows), from ink weight, and from voids. The only depth on the page is in the rendered parts and photos. The input focus treatment (`box-shadow: 0 0 0 1px` in nominal blue) is a stroke doubling, not elevation. The gallery lightbox is the one dark surface: a near-opaque graphite overlay.

### Named Rules
**The Paper-Only Rule.** Every section sits on the same white sheet. Separate with a 2px ink rule and a void, never with a grey or tinted band or a dark CTA box.

**The Two Rules Rule.** A 2px ink rule opens a section, a flag, a step, a person or a job; a 1px grey rule divides rows within it.

## Shapes

Square-cut: a 2px radius on buttons, switches, inputs, drop zones and photos, nothing rounder. Strokes are 1.5px on controls, dashed only on the drawing drop zone (solid on hover). Icons are inline SVG line drawings, 1.75px stroke with square caps and mitred joins. Status marks are small squares (9–10px), never dots. The logo is two bars with a square between them: a part between limits.

### Named Rules
**The Hairline Corner Rule.** 2px or square. Pills and soft cards do not exist here.

## Components

### Buttons
Plain, firm, sentence case.
- **Shape:** 2px corners, 48px tall (44px in the header and on switches).
- **Primary ("go"):** nominal blue fill, white 600 16px text, 20px side padding. One per view region; it always leads to sending a drawing.
- **Hover / Focus:** fill deepens to nominal-deep over 0.15s; focus is a 2px blue outline offset 3px.
- **Line:** transparent with a 1.5px ink stroke; hover inverts to solid ink with white text. Used for Menu, phone calls, secondary navigation.
- **Text link:** blue 600 with a 1.5px underline offset 4px; hover turns ink.

### Switches (named-position selectors)
The cassette-deck control: a 1.5px ink frame split by 1.5px ink dividers into labelled positions (part shape, gallery filters, Výroba sub-nav, form progress). Positions are 44px tall, 600 15px. Selected or current position fills solid ink with white text; hover on an unselected one fills track grey. Optional counts sit in 400 at 70% opacity. The inquiry form's choice grid is the same idea in a 3-column (2 on mobile) ruled matrix.

### Inputs / Fields
- **Style:** white, 1.5px field-grey border, 2px corners, 50px tall, 17px text at 500.
- **Dimension field:** an inline label, a short tabular number input and a unit ("Průměr 120 mm"), 48px tall.
- **Focus:** border turns nominal blue and doubles with a 1px blue ring; no glow.
- **Error:** border and message in out-of-range red, message 600 15px.

### Drawing Drop Zone (signature)
The primary action as a surface: 1.5px dashed blue stroke, 2px corners, white, upload icon in blue, a bold 19px instruction and a quieter line of accepted formats. Hover or drag-over fills nominal-wash and the stroke goes solid. Tall variant stacks inside the hero's right column with its own blue button; wide variant (128px) sits in the closing block.

### Tolerance Bar (signature)
An 8px track-grey bar holding the tolerance field (pale band with 2px green limit strokes), a 1.5px blue tick at nominal and a 3px ink marker for the actual, which overshoots the bar by 5px each side. Out of range turns the marker red. The fit variant shows a machine's working range filling 80% of the length, with an outlined marker for the example part; the pay variant is 12px tall. The marker glides on 0.5s cubic-bezier(.16, 1, .3, 1).

### Measurement Flag (signature)
A 2px ink rule over: feature name (14px ink-2), nominal (figure style), tolerance (14px), tolerance bar, and the actual in tolerance-text green with a 9px green square. Hover, focus or a hover on the shaft turns the rule and nominal blue and highlights the feature on the part. Six in a row under the hero shaft; stacked two-column rows on mobile.

### Characteristic Rows
Definition lists set as protocol rows: term in ink-2 (34% column), value in 600, optional inline tolerance bar (132px) and note. Variants for wide prose rows, footer contact rows and the inquiry preview, which mirrors the form as you type.

### Navigation
Header: logo mark + wordmark, five links in 15.5px ink-2, the current one ink 600 with a 2px underline offset 8px, then the phone in 600 tabular and the blue "Poslat výkres". Under 1120px the links fold into a Menu line button revealing a ruled list of 20px links.

## Do's and Don'ts

### Do:
- **Do** state every capability as a characteristic: nominal, tolerance, actual, and a tolerance bar where the number can be placed against limits.
- **Do** open each section with a 2px ink rule and separate sections with the void (clamp 96–168px) on white.
- **Do** keep blue for actions, links, nominal ticks and focus; keep green for tolerance; keep red for out-of-range and errors.
- **Do** set every comparable number in tabular lining figures.
- **Do** build choices as switches with named positions, selected position in solid ink.
- **Do** end pages on a white closing block with the drawing drop zone and a named person with a phone number.
- **Do** keep the probe sweep the only authored motion and skip it under reduced motion.

### Don't:
- **Don't** fill a section, band or closing block with blue, grey or any tint; the page is one white sheet.
- **Don't** use a dark CTA box, a four-up stat bar, zigzag image/text rows or a render in a grey card.
- **Don't** add shadows to cards, buttons or panels.
- **Don't** round corners beyond 2px or use pill shapes.
- **Don't** use red for emphasis or green as a decorative bullet.
- **Don't** introduce new tints of the signal inks beyond the tokens above.
