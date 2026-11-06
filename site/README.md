# Timofei Iakovlev — connected work

Second visual direction, rebuilt after the owner rejected the first design. Dark, continuous canvas; self-hosted Manrope; a spatial CODY illustration; specific project evidence before long analysis. Russian and English, three audience routes, three case studies, two PDF CVs.

## Run

```sh
python3 build.py
python3 -m http.server 8000 --directory dist
```

Open `/ru/` or `/en/`. Audience routes: `engineering/`, `learning/`, `collaborate/`. Cases: `work/tbank/`, `work/cody/`, `work/bpmn/`.

`build.py` contains the static page templates, `site-content.json` the detailed case/audience text, and `dist/assets/` the CSS and interactions. Generated HTML and CV files are committed, so a Python runtime is optional for serving. No dependency install, API key or build service is required.

## Behaviour

- CODY scene: context → task → fictional result. Native scroll moves only decorative planes, with smaller travel on mobile. No autoplay or scroll locking.
- A visible motion preference persists locally. Operating-system reduced motion takes priority.
- Bank example: changes are validated before applying; invalid inputs retain the last valid rule.
- CODY case: an illustrative lost connection has no successful execution state.
- Process example: an unknown owner blocks construction; clarification is distinguished from the source.
- Normal links, CV downloads and all case text remain available without JavaScript.

All demos use fictional data and run locally. They do not control devices, call AI or reproduce employer interfaces. Original closed project code is not included.

[Design decisions](DESIGN.md), [product context](PRODUCT.md), [credits](CREDITS.md), [validation](VALIDATION.md). The hosted Site remains owner-private and noindex. The research/source repository is public.
