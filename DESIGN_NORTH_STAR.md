# CelerCrea v2 — North Star Design Specification
**Phase:** 1 / Design alignment  
**Status:** Proposed design lock (subject to founder review)  
**Date:** 2026-11-16  
**Implementation branch:** \`redesign/cyber-noir-2026\`  
**PR:** https://github.com/rirehkemper/Celercrea/pull/3

## 0. Reference: user-selected homepage mockup
The selected in-conversation image is the definitive **art-direction reference** for the next implementation. It shows:
- A cyberpunk/neon-noir homepage in deep blue rather than flat black.
- A cyan-and-magenta angular CelerCrea emblem and clean horizontal top navigation.
- A left-aligned headline, "Complex systems. Clear solutions.", with high-contrast cyan→violet→magenta coloring in the second line.
- A layered retro sunset, electric-city skyline, reflective grid floor and atmospheric glow to the right of the hero.
- A semi-realistic, teal-and-purple cyber-gremlin ("Glitch") peeking from the hero's right border, with a rare running apparition below.
- Three horizontally aligned service cards with distinct neon-edged icons; compact selected-work cards; a high-contrast bottom call to action.

**Interpretation:** target the composition, hierarchy, color, atmosphere, and mascot character—not every literal word or invented project in the mockup. The actual HTML must contain genuine text and controls, not embed one giant screenshot.

## 1. Brand strategy
**Business:** CelerCrea — founder-led technology consulting / engineering.

**Primary promise:** Practical engineering across custom software, AI integration and business automation, and IT systems/infrastructure.

**Target clients:** Small/mid-sized businesses, departments, nonprofits, and organizations that need a reliable hands-on technical partner without bringing in a full in-house team.

**Voice:** Competent, direct, approachable, occasionally mischievous. Avoid corporate buzzword inflation, generic agency claims, unverifiable metrics, and overplaying "hacker" clichés.

**Hero headline (locked):** "Complex systems. Clear solutions."

**Hero kicker (locked):** "FOUNDER-LED CONSULTANCY"

**Hero support copy (working):** "Custom software, intelligent workflows, and resilient IT infrastructure — designed, built, and delivered with a founder's hands-on focus."

**Primary CTA:** "Start a Conversation" (contact form).

**Secondary CTA:** "See Our Work" (real portfolio section). Do not use a play icon unless the link actually launches a playable video.

**Brand line (supporting):** "Build serious. Stay curious." Brand personality, not the main headline.

## 2. Design language
**Working name:** Neon Noir, with retro-futuristic/synthwave accents.

### Color tokens
| Token | Hex | Use |
|---|---|---|
| \`--midnight\` | \`#0B1930\` | Primary page background |
| \`--slate\` | \`#193452\` | Gradient surfaces and cards |
| \`--cyan\` | \`#31E8F0\` | Focus, CTA lighting, infrastructure accents |
| \`--violet\` | \`#9A79FB\` | Secondary glow, AI services |
| \`--magenta\` | \`#DB49F2\` | Rare accents, retro sunset, Glitch lighting |
| \`--ice\` | \`#F4F7FF\` | Primary body/headline text |
| \`--muted\` | \`#B9C9DA\` | Secondary copy |
| \`--line\` | \`#3C6582\` | Subtle borders |

Use soft radial gradients atop midnight backgrounds. Do not blanket the site with a flat near-black color. Test contrast on actual surfaces.

### Typography
- Headings: Space Grotesk (existing), custom tight letter spacing; consider a slightly more rounded sans *only if* matching the image better.
- Body: DM Sans (existing) at 16–18px; use generous line height.
- Micro labels: JetBrains Mono (existing), all caps only for small decorative section tags.
- Large hero headline should dominate, but should wrap naturally at narrow widths.
- Text stays live HTML; no copy baked into background graphics.

### Visual treatment
- Angular gradient C emblem, matching the screenshot's brand mark (refine original logo; do not adopt unapproved third-party marks).
- Magenta sunset with a few horizontal stripes, futuristic low-contrast skyline, and cyan/magenta reflective horizon grid.
- Cyan/violet neon glows on focus, selected headings, and card borders. Keep resting-state glow restrained.
- Frosted/navy glass cards, subtle inset edge highlights, rare glow at hover/focus.
- A little retro instrumentation, not unreadable fake terminal dashboards or animated wallpaper.
- Preserve responsive spacing; do not imitate the image by forcing all content above the fold.

## 3. Page hierarchy / information architecture
1. **Header:** CelerCrea mark/wordmark; Services, Work, About, Contact; one high-contrast CTA. Include a real mobile menu. Hold "Insights" until genuine articles exist.
2. **Hero:** left-aligned headline, working copy and two real CTAs; right side sunset/skyline + peeking Glitch; tagline above.
3. **Services:** three balanced cards (Software Engineering, AI Integration, IT Consulting) with designed icons and short user-centric descriptions.
4. **Selected Work:** three genuine featured cases (see below), visible links to full approved details rather than links pretending to be project demos.
5. **Credibility / About:** founder-led experience with M.S. Software Engineering and operational responsibility; clearly distinguish personal employment experience from client services.
6. **Process / Approach:** optional compact four-step treatment below the main visual sections, so it does not overwhelm the homepage.
7. **Bottom CTA:** "A hands-on partner for what's next." + a direct contact path; small optional running Glitch accent.
8. **Contact:** real, server-connected form with spam controls, error/success feedback and a clear privacy treatment.

### Portfolio authenticity rule
The mockup's "Intelligent Operations Platform", "Customer Insights Hub", and "Cloud Infrastructure Refresh" are **illustrative inventions**, not verified case studies. Do **not** publish them as past completed client projects.

Use verified résumé/GitHub experience instead:
- **Murphy Student Enrollment Platform** — production employment work; retain approval/privacy review; omit student details and private environment specifics.
- **Atlas Projects** — independent application, clearly labeled, showing role permissions/workflows.
- **Enterprise IT & Reliability** — generalized professional operational experience, not a named client engagement or implied employer endorsement.
- **TruVoice** — independent application, optional fourth project or detailed inner page.

AI integration service is valid as an offered capability, but show any agent/demo as a labeled prototype unless actual externally delivered work can be substantiated. Avoid fake testimonials and fake performance KPIs.

## 4. Mascot: Glitch
**Personality:** Mischievous, clever, curious, competent, slightly cocky; soften expressions so he is playful rather than menacing or childish.

**Appearance reference:** The user's later semi-realistic concept sheet takes priority over the earlier simple SVG character: teal/cyan textured skin, large pointed ears, spiky pale hair, purple goggles, dark jacket/techwear, restrained magenta/cyan edge light, yellow/amber eyes, and a tiny gadget. Less chibi-cartoon, more high-end stylized 3D illustration.

**Usage:**
- Primary: peeks from behind the right edge of the desktop hero, integrated with the scene but subordinate to headline and CTAs.
- Secondary: rare runner near the bottom edge (once per session, never blocking text or form fields).
- Click/interact: optional short personality messages; footer summon button.
- Controls: conspicuous but unobtrusive close/dismiss for current session, keyboard operability.
- Motion: \`prefers-reduced-motion\` respected; no automatic mascot animation for those users.
- Mobile: smaller cropped peek or static art; hide runner where it impairs usability.
- No intrusive overlays in contact form or persistent pop-ups.
- Build separate approved, transparent-background assets for peek/run; never use the entire concept sheet or screenshot as the interactive sprite. Optimize assets responsibly.
- Existing SVG remains temporary until new production mascot assets are prepared.

## 5. Motion and behavior
- Timing: 180–300ms ease transitions for UI; very subtle 10–20s environmental glow movement only if performant and not distracting.
- Hover/focus: restrained outline and luminance changes; avoid aggressive scaling and jitter.
- Mascot peeks may repeat sparingly but should not compete with active tasks.
- Limit surprise full-screen run to once per tab session; suppress during form interactions.
- Reduced-motion users receive a static, manually invoked mascot with no forced appearance.
- Make animation and assets nonessential for understanding the site.

## 6. Real-world implementation
- Keep existing Cloudflare Pages static architecture unless a measurable requirement calls for a framework. Vanilla HTML, CSS, JS and optimized SVG/WebP/AVIF can achieve the target.
- Build skyline, sun, grid and atmospheric layers separately from textual UI. Decorative background must not trap pointer events.
- Maintain a legible text-first fallback if background assets fail.
- Verify the Cloudflare Pages actual build directory before consolidating duplicate \`/\` and \`/Website/\` files.
- Preserve/harden \`/api/contact\`; add rate/payload limits where appropriate, test real delivery.
- Prefer responsive 12-column or CSS grid layout on desktop, single-column stack at mobile widths. Ensure mascot cannot cover actionable controls.
- Descriptive links (real destinations), semantic headings, visible keyboard focus, required labels, contrast review, and restrained motion.
- Do not claim specific Lighthouse scores until tested.
- OG social images should ideally be served as raster PNG at 1200×630; decorative SVG can remain a source format.

## 7. Fidelity and success criteria
Prioritize in this order:
1. **Recognizable at a glance:** same arrangement, colors, hero skyline, and Glitch presence as the chosen mockup.
2. **Business credibility:** genuine work, accurate technical claims, and prominent human/founder connection.
3. **Usability:** real links, mobile nav, accessible CTA/form, no mascot interference.
4. **Performance:** compressed imagery, limited CSS animation, no giant rasterized screenshot as a substitute for layout.
5. **Polish:** glow/shadow tuning, hover states, mobile breakpoints, and consistent icon language.

**Phase 1 deliverable:** this written design lock; phase 2 is the first complete homepage implementation matching the target mockup. No production merge until the owner approves a real rendered branch preview after functional QA.

## 8. Decisions to validate in design review
The art direction and brand positioning are accepted as a working baseline. Confirm whether any of the following are deal breakers before Phase 2:
- Pink/magenta intensity and retro sunset motif.
- Use of the angular C emblem rather than the former diamond mark.
- Glitch primarily peeking from hero (not constantly anchored in viewport).
- Founder-first copy rather than generic "agency" language.
- Three real showcase entries instead of the illustrative project names in the image.

Default if no objections: proceed with these choices.
