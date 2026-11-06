# Validation — redesign v2, 6 November 2026

## Checked on the final implementation

- Generated 15 static HTML pages. Checked 366 local links, assets and anchors: no broken references.
- Python compilation and JavaScript module syntax checks passed.
- Browser layout checks: RU home, EN home, all three RU audience pages and all three RU case pages at 320, 390, 768 and 1440 CSS pixels. The remaining six EN routes were checked at 320 px. No document-level horizontal overflow. A decorative orbit that initially caused mobile overflow was corrected.
- Visual review of the desktop hero/projects, mobile hero/audience links, the rule demo and process demo. Saved desktop and full mobile screenshots.
- Hero scene: choosing Result changes the caption, selected button and visible terminal output. Native scroll changes decorative plane positions; the visible reduced-motion control resets displacement to zero. The preference persists locally; system priority is implemented in source, but the OS setting itself was not changed for testing.
- Mobile menu opens, Escape closes it and returns focus to the menu button. Locale switching preserves the case route. Copying the email reports success.
- Rule demo: selecting all participants produces +5 for both. A bonus of 15 is rejected, retaining +5/+5 from the previous accepted rule.
- CODY case: lost connection disables all four step buttons and shows Connection lost; restoring the illustrative connection permits the Result step again.
- Process demo: unknown responsibility blocks construction. Choosing an owner builds a diagram and records clarification U1 separately from source S1. Changing the owner clears the built state. The vertical diagram is visible at 320 px without horizontal overflow.
- Browser error/warning log was empty during the interaction checks.

## Design review

One Impeccable detector pass across seven RU pages reported 18 heuristic warnings: 1 contrast, 10 glow, 2 padding, 1 nested-container, 1 heading and 3 palette warnings. Repeated glow warnings include the same element classes on multiple pages. Final corrections brightened decorative window dots, removed glow on eyes/connector, added explicit inset and corrected heading hierarchy.

The purple palette follows the user's explicit reference. Device/window nesting is intrinsic to the authored illustration, not a general page-card pattern. These were retained with an explicit rationale. The detector was not rerun as a score-chasing exercise; this is not a claim of zero remaining warnings. The corrected views were checked in the browser.

## Limits

This validates the portfolio and synthetic interactions, not the actual CODY connection, BPMN service or employer systems. No real-device performance benchmark, complete accessibility certification, user preference study, Lighthouse score or conversion claim is made. Content and normal links are server-rendered; JavaScript-off behaviour was reviewed in source rather than tested with a disabled browser runtime.

Hosted access remains owner-private; the source/research repository is separately public. Publication status and source commit are recorded by the hosting service and Git history.

## Publication

Redesign deployed successfully on 6 November 2026. The hosted page was opened in the owner’s authenticated browser and its new design was visually verified. Site source commit: `ffb9808e15673a1fdf44772a52303c0235e79410`. Screenshots: [desktop](../previews/site-desktop.png), [mobile](../previews/site-mobile.png), [live](../previews/site-live.png).
