# CelerCrea — Cyber Noir redesign (preview)

This branch is a proposed first-pass brand and website rebuild for review. **Do not merge without checking the Cloudflare Pages build root and contact-form deployment.**

## Direction
- Position CelerCrea as founder-led software, AI integration, and IT consulting, rather than primarily a low-cost website studio.
- Lead with real technical work and mark independent projects vs. professional production experience clearly.
- Make AI service language realistic: integration, prototyping, guardrails, and workflow design—not invented client case studies.
- Use a restrained cyber-noir visual system, responsive navigation, CSS-only illustrative architecture diagrams, reduced-motion support, and semantic markup.

## What changed
- Replaced the homepage at both `/index.html` and `/Website/index.html` to cover the two plausible Cloudflare Pages content roots until deployment configuration is confirmed.
- Added matching favicon and social preview SVGs in both locations.
- Reused the existing Cloudflare Pages Function endpoint `/api/contact`; its secret configuration is unchanged.
- Removed generic portfolio buttons that previously linked to the contact form while claiming to be project demos.

## Evidence and privacy
- Professional profile and project descriptions are based on Allen's software portfolio résumé and accessible GitHub repositories.
- Work visuals are intentionally labeled as illustrative, not actual user-facing product screenshots.
- Enrollment work is described as professional experience, without implying district endorsement or disclosing student data.
- Enterprise IT work is generalized; no private infrastructure addresses or layouts are exposed.

## Pre-merge checklist
- [ ] Confirm Cloudflare Pages build root and identify the currently deployed entry point; eventually eliminate duplicate copies.
- [ ] Review every public claim and confirm permission for naming/depicting employer projects.
- [ ] Check mobile navigation, keyboard access, contrast, reduced-motion behavior, and contact form live submission.
- [ ] Verify social previews; SVG Open Graph images may be unsupported on some platforms, so rasterize to PNG before final production release.
- [ ] Run Lighthouse mobile/desktop; inspect load, render, and form errors in real browsers.
- [ ] Add server-side payload limits, rate limiting, and abuse protection as a separate hardened backend update.
- [ ] Consider adding genuine screenshots, redacted case-study pages, and verified outcomes once approved.

## Deploy guidance
Open this branch in a Cloudflare Pages preview deployment if the repository's integration supports it. Preview first; do not change the production domain until acceptance.
