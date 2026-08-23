# Bioloark implementation map

Read this before changing code in the current `bioloark-site` project.

## Stack and boundaries

- Next-compatible React 19 project built with Vinext/Vite and hosted through OpenAI Sites.
- Hebrew RTL is set in `app/layout.tsx`.
- Shopify Storefront API is accessed through `lib/commerce.ts`; when environment variables are absent or requests fail, the site falls back to `data/catalog.json` preview data.
- Do not remove that preview fallback. Purchase controls must remain disabled or truthful when Shopify is not configured.
- Reuse opaque Sites project identifiers from `.openai/hosting.json`; never create a second site for this project.

## Main surfaces

- `app/page.tsx`: homepage narrative, featured product handles, services, about, testimonials, and consultation band.
- `app/globals.css`: brand tokens, layout, motion, responsive behavior, collections, products, overlays, and cart styling.
- `components/site-header.tsx`: desktop/mobile navigation, search overlay, and cart entry.
- `components/product-card.tsx`: shared product tile.
- `components/collection-browser.tsx`: collection sorting and availability filter.
- `app/product-page/[handle]/page.tsx`: product detail experience.
- `lib/commerce.ts` and `lib/types.ts`: Shopify mapping, preview behavior, money, variants, policies, and cart operations.

## Current design baseline

The live homepage already has a strong forest hero, editorial serif display type, warm paper commerce sections, cinematic terrarium imagery, service cards, and a consultation story. Preserve this foundation unless the user requests a new direction.

The highest-value gaps to consider are guided discovery, verified trust/delivery/care information near purchase moments, stronger product-card decision data, more explicit consumer-versus-project paths, complete commerce states, and authenticity review of testimonial claims.

## Implementation conventions

- Extend existing CSS custom properties instead of scattering similar color literals.
- Keep server components by default; add client boundaries only for interaction.
- Prefer native links and semantic controls. Preserve Escape handling for modal overlays and lock background scroll when a new modal requires it.
- Avoid adding a large dependency for a small interaction.
- Product handles include Hebrew; encode them at URL boundaries and preserve the current decode behavior.
- Keep Shopify API version and field mappings compatible with the existing data types.
- Treat content in `data/catalog.json` and the sibling `bioloark-content` folder as source material, not permission to fabricate missing business facts.

## Verification

Run checks proportional to the change:

```bash
npm run lint
npm run build
npm run test:smoke
```

For visual changes, inspect the rendered target at desktop and mobile after animations settle. Check console errors, keyboard focus, RTL order, image cropping, unavailable products, empty results, and Shopify-unconfigured behavior. Publishing or deployment requires explicit user authorization.
