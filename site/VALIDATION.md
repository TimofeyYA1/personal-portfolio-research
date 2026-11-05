# Validation — 6 November 2026

## What was checked

- Generated all 15 HTML pages: a root entry, RU/EN home pages, six audience pages and six case pages.
- Checked 312 local links/assets/anchors in the shipped HTML. No broken references.
- JavaScript syntax checks passed for the main application and the process demo.
- In-browser viewport checks across all 14 localized routes at 320 px found no document-level horizontal overflow. Home layouts were also inspected at 390 px, 1280 px and 1440 px. A long Russian heading was resized after the first mobile review.
- Verified RU/EN navigation preserves the audience/case route, the learning CTA opens its projects section, mobile menu opens/closes and Escape dismisses it, and copying the contact succeeds.
- Rule demo: selecting all participants updates both results; an invalid bonus of 15 is rejected and preserves the last valid result. Pure-rule checks also cover valid boundaries, invalid input and recovery.
- CODY demo: project/session/task/result selection works; offline state does not report successful execution, and restoring the illustrative connection returns the scenario.
- Process demo: missing responsibility blocks construction; an explicit choice builds a diagram and distinguishes source S1 from user clarification U1. Changing the choice invalidates the previous diagram. Mobile layout switches to a vertical process.
- Browser error log was empty during the interaction checks.
- Hosted version successfully deployed and was opened in the owner's authenticated Chrome session. Its access remains owner-private. GitHub source publication is separate and public.

## Limits

These checks validate the portfolio and its synthetic illustrations. They do not execute the actual CODY or BPMN.space products, audit the bank platform or prove business results. Reduced-motion and no-JavaScript fallback behavior were reviewed in source; no claim of a full accessibility audit or real-device performance benchmark is made. There are no invented Lighthouse scores or conversion numbers.

Screenshots: [desktop](../previews/site-desktop.png), [mobile](../previews/site-mobile.png), [hosted site](../previews/site-live.png).
