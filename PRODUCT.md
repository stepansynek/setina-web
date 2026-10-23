# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: owners and managers of small and mid-sized machine shops (CNC turning, milling, welding) around Brno, Vyškov and Rousínov who are judging Štěpán Synek's "Web na klíč" offer on stepansynek.com. They open this demo to answer one question: would a site like this win my firm more inquiries and better hires than what I have now?

In-world (the fiction the demo has to sell): buyers at OEMs and integrators (purchasing, design engineers, maintenance) who need a part machined from a drawing and want to know fast whether SETINA can make it, at what tolerance, and how to send the drawing. A secondary in-world audience is machinists and welders looking for a job nearby.

## Product Purpose

A portfolio demo: the website of a fictional precision machining shop, SETINA přesné obrábění s.r.o., Rousínov. Success means a shop owner leaves convinced the site would work for them: it looks like a serious manufacturer, explains capability in buyers' terms, and turns visits into drawings sent and phone calls made. It must stay believable to the in-world buyer. Effects only count when a buyer would find them useful.

## Positioning

Turning, milling, cylindrical grinding and welding with machining in one hall near the D1, family run since 1996. The firm's working facts (ranges, tolerances, machines, the people who answer the phone) are the selling point, stated as numbers and names rather than adjectives.

## Operating Context

Buyers arrive with a drawing (PDF, STEP, DXF) and a quantity. They compare suppliers on: can the part fit the machines, which tolerances and materials, lead time, who to call. Job seekers compare pay, shifts and commute. Shop owners viewing the demo compare it with their own dated sites and with competitors.

## Capabilities and Constraints

- Static site built by `build.py` from `src/layout.html` + `src/pages/*.html`; shared `styles.css`, `site.js`; deployed to GitHub Pages at stepansynek.com/setina-web/.
- Fonts and three.js are self-hosted; no third-party requests (no cookie bar needed).
- Working features: 3D part models (`parts.js`, three.js r149) that can be rotated, the "Vejde se váš díl?" fit checker driven by machine table data attributes, a 3-step inquiry form with file upload that only shows a confirmation (demo), a filtered photo gallery with lightbox.
- Pages and features may be merged or cut if the site gets stronger (confirmed 2026-10-22).
- Czech language; Czech typography rules (non-breaking spaces) applied by build.py.
- Site is noindex and clearly marked as a fictional firm.

## Brand Commitments

Only the name SETINA is fixed (confirmed 2026-10-22). Logo, colour, type and imagery are open. The site must look clearly different from the sibling demo HRANOL (~/Documents/GitHub/ukazka-hranol) and from stepansynek.com itself.

## Evidence on Hand

In-world facts already established and to be kept consistent: founded 1996 by Josef Setina, run by his son Petr since 2024, 34 people, two shifts, 12 CNC machines, ISO 9001 since 2008, hall at Průmyslová 1420 near the D1 (2 600 m²), climate-controlled metrology room with a CMM, 140 ppm complaints in 2025, three case studies (pump shafts, packaging-line frames, robot welding fixtures), three named contacts, three job openings with pay.

Imagery: 3D renders and three.js models of six parts (`img/*.webp`, `parts.js`); 25 Pexels stand-in photos in `img/foto/`, colour-graded to one look, that a real client would replace. No real photos of the firm exist; do not present stand-ins as the firm's own without the existing note. No real testimonials, customer names or prices exist and none may be invented.

## Product Principles

1. Numbers and names over adjectives: every claim is a range, tolerance, date, person or price.
2. The drawing is the currency: every path leads to sending a drawing or calling a named person.
3. Show the capability working (rotate the part, check the fit), never decorate with it.
4. A shop owner should be able to imagine their own firm in it.

## Accessibility & Inclusion

WCAG AA contrast, keyboard access for every interactive feature (3D, fit checker, form, lightbox), reduced motion respected, works without WebGL.
