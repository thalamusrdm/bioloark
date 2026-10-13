# Meta catalog for the headless storefront

Deploy `/api/meta-catalog` with the existing Shopify Storefront environment variables.
The public XML feed contains only published product information; credentials never appear in it.
It uses live Shopify prices and stock, numeric Shopify variant IDs, storefront URLs under
`https://www.bioloark.co.il/product-page/`, and Shopify images with the existing site catalog
as an image-only fallback matched by exact product handle.

The endpoint returns 503 on upstream errors, empty catalogs, missing images, or incomplete
variant exports rather than replacing live stock with preview data.

After deploying, validate the URL and a representative in-stock and out-of-stock product.
In Commerce Manager, use this XML as a scheduled data feed. Do not add it as a second primary
source alongside the Shopify partner source: use a separate feed-managed catalog or migrate
the existing source intentionally to avoid competing updates to the same variant IDs.
The Shopify partner catalog remains intact until that migration is verified.

This creates a product feed only. It does not enable tracking, create campaigns, or publish a shop.

Reference: https://shopify.dev/docs/api/storefront/2026-07/queries/products
