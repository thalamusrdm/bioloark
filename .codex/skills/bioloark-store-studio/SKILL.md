---
name: bioloark-store-studio
description: Design, build, rewrite, or critique Bioloark storefront experiences with its premium botanical identity, Hebrew RTL UX, and Shopify commerce constraints. Use for Bioloark pages, components, merchandising, conversion improvements, and visual-reference synthesis; do not use for unrelated brands or generic web work.
---

# Bioloark Store Studio

Create a store that feels like a living botanical atelier and still shops like a clear, trustworthy nursery. Preserve Bioloark's identity: quiet luxury, miniature ecosystems, Japanese restraint, deep forest tones, warm paper, brass accents, and editorial photography.

## Choose the working mode

- **Design or build:** read [references/brand-dna.md](references/brand-dna.md) and [references/experience-playbook.md](references/experience-playbook.md). For code changes, also read [references/implementation-map.md](references/implementation-map.md).
- **UX copy or merchandising:** read the voice and commerce sections in `brand-dna.md` and `experience-playbook.md`.
- **Audit or critique:** read `brand-dna.md`, inspect the rendered page at desktop and mobile, then report the highest-impact gaps before changing anything unless implementation was requested.
- **New visual references:** inspect the supplied pages directly, extract principles rather than pixels, and update the synthesis only when the new evidence materially changes the direction.

## North star

Every important surface should answer, in this order:

1. What world am I entering?
2. What can I buy or commission here?
3. Which choice fits my space, light, care level, or budget?
4. Why should I trust Bioloark to deliver a living product successfully?
5. What is the next obvious action?

Balance atmosphere and utility. A cinematic section earns its space only when the next shopping action is unmistakable. Add proof, guidance, or product discovery where the current design is beautiful but leaves purchase anxiety unresolved.

## Non-negotiables

- Work RTL-first in Hebrew. Mixed Latin product names, prices, arrows, and numerals must remain visually stable.
- Preserve originality. Never copy reference-site text, assets, logos, distinctive illustrations, or a page section-for-section.
- Prefer a small number of strong visual ideas: generous space, disciplined type scale, tactile photography, restrained motion, and clear contrast.
- Keep commerce states complete: loading, empty, unavailable, sale, variant selection, cart feedback, Shopify-unconfigured preview, and errors.
- Claims about delivery, warranty, stock, ratings, store hours, or support must come from verified project data or explicit user input. Mark proposed claims as placeholders.
- Accessibility and speed are part of the premium feel: semantic headings, keyboard paths, visible focus, useful alt text, reduced motion, responsive images, and no text hidden by cinematic overlays.
- Do not deploy, publish, connect a domain, or mutate Shopify without explicit authorization.

## Execution shape

1. Inspect the target page, nearby components, data flow, and existing user changes.
2. State the page's primary job and the one customer hesitation it should remove.
3. Select only the patterns that serve that job; do not accumulate every reference idea.
4. Implement production-quality responsive behavior, keeping reusable patterns in components or tokens.
5. Verify the relevant build/lint/smoke checks and inspect the rendered desktop and mobile result.
6. Summarize the outcome in Hebrew, including any unverified business content that still needs owner input.

## Definition of done

The result should be recognizably Bioloark without its logo, make the primary action obvious within one viewport, expose enough product/care/trust information to choose confidently, remain coherent on mobile, and avoid close imitation of any reference.
