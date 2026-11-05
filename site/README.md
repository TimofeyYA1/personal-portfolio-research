# Timofei Iakovlev — portfolio site

Static bilingual site with 3 audience routes, 3 case studies and independent interactive illustrations.

## Build and preview

Run `python3 build.py` after changing `site-content.json`. Styles and interactions are in `dist/assets/`.
Serve `dist/` using `python3 -m http.server 8000 --directory dist`.

Routes: `/ru/`, `/en/`, then `engineering/`, `learning/`, `collaborate/` and `work/tbank/`, `work/cody/`, `work/bpmn/`.

Motion 14.9.1 is vendored locally under MIT. Fonts are Manrope and Cormorant Garamond via Fontsource 5.3.0 under OFL 1.1. Licenses live in `dist/assets/licenses/`. All illustrations and demo logic are made for this site; no employer or client data is included. Demo actions run locally and do not call AI or control real devices.

The initial hosted version is owner-private and noindex. Public release requires checking employment chronology, individual project attribution and the appropriate sharing setting. The GitHub research package is a separate public source publication.
