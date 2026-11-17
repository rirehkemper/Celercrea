# CelerCrea — Neon Noir + Glitch (review branch)

This is a proposed second creative iteration on the Cyber Noir engineering-consultancy redesign.

**Do not merge directly to production.** Verify the actual Cloudflare Pages build root, branch preview, and contact handler first.

## Positioning
CelerCrea is a founder-led consultancy offering custom software engineering, AI integration and automation, and IT infrastructure consulting. The portfolio distinguishes production professional experience from independent applications. Work visuals are conceptual and labeled, not actual app screenshots.

## Neon Noir refinements
- Brighter midnight-blue gradient surfaces with cyan, violet and light-magenta accents. Neon is concentrated at hierarchy/interaction points.
- Neon glow on selective UI elements and a restrained retro-tech signal label.
- Brand social artwork and theme color updated to match.
- Progressive CSS enhancement in \`neon-gremlin.css\`; the original HTML layout remains usable without that extra stylesheet.

## Meet Glitch (working mascot name)
- \`glitch-gremlin.svg\`: an original, self-contained vector cartoon with goggles, pointy ears, a gadget, and CSS eye blinks.
- \`gremlin.js\`: a playful *optional* behavior layer with no outside libraries, telemetry or tracking cookies.
- Appears for ~8 seconds starting ~5.5 seconds after page load (unless the contact section is visible).
- Once per tab session, attempts a 4.5-second run across the screen after ~19 seconds on desktop widths of 760px or more, provided the visitor is not in the contact form.
- Clicking the gremlin rotates through playful, non-business-claim speech bubbles. Footer “Summon Glitch” allows a voluntary interaction.
- The close button hides the mascot for the tab session. This choice is stored locally in sessionStorage.
- Under reduced-motion settings, automatic appearances and running are disabled; footer summoning remains available as a static interaction.
- Hidden mascot controls are made inert (not keyboard-focusable) between appearances. Contact-section visibility suppresses automatic peeks.
- No animation or mascot actions interfere with form submission.

## Implementation layout
We deliberately mirrored site files into both / and /Website/ because the public repository has two entry locations. Cloudflare's *actual* build directory must be checked before consolidation. Scripts and style assets are relative so each HTML entry uses assets from the same directory.

Files updated in this revision:
- \`index.html\`, \`Website/index.html\`
- \`neon-gremlin.css\`, \`Website/neon-gremlin.css\`
- \`gremlin.js\`, \`Website/gremlin.js\`
- \`glitch-gremlin.svg\`, \`Website/glitch-gremlin.svg\`
- \`og-image.svg\`, \`Website/og-image.svg\`
- This note

## Pre-merge QA checklist
- [ ] Confirm Cloudflare Pages root and visit the branch preview URL.
- [ ] Browser-test desktop and mobile, especially bottom-right mascot placement and form.
- [ ] Test reduced-motion, keyboard interaction (Tab, Escape), automatic peeks, dismiss, and summon.
- [ ] Verify the one-time run does not recur after refresh within the same session.
- [ ] Validate contact form submits against deployed \`/api/contact\` and check Cloudflare environment configuration.
- [ ] Perform Lighthouse and accessibility review, including contrast, SVG behavior, and network waterfall.
- [ ] Rasterize the social image into a 1200×630 PNG for sites that do not support SVG Open Graph images.
- [ ] Review employer project naming/privacy approvals; do not publish private internal system details.
- [ ] Improve backend payload limits, spam controls/rate limits, and non-success responses in a security pass.
- [ ] Optionally add approved project screenshots and dedicated case-study pages.

### Brand rule
Engineering competence is the headline. Glitch is an Easter egg, not the product.
