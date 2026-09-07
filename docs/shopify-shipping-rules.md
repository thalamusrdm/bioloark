# Shopify shipping rules

The store uses one Shopify **General profile** for every product. Keeping all
products in one profile prevents Shopify from adding shipping fees from
multiple profiles when a cart contains products from different categories.

## Current rates

| Cart weight | Checkout option | Price |
| --- | --- | ---: |
| 0-0.01 kg | משלוח חינם — יצירות מוכנות | ₪0 |
| 0.1-9.9 kg | משלוח עד הבית | ₪35 |
| 10 kg and up | משלוח מהיום למחר — צמחים | ₪75 |

The optional `משלוח אקספרס שביר` rate remains available for ₪120.

## Technical product weights

These weights are routing markers, not the physical weights of the products:

| Shopify product type | Variant weight |
| --- | ---: |
| `טרריומים מעוצבים` | 0 kg |
| `צמחים` | 10 kg |
| Every other product | 0.1 kg |

Expected checkout totals:

| Cart contents | Standard shipping |
| --- | ---: |
| Ready terrarium only | Free |
| Regular product only | ₪35 |
| Plant only | ₪75 |
| Ready terrarium + regular product | ₪35 |
| Plant + regular product | ₪75 |
| Plant + ready terrarium | ₪75 |

## Adding products

Every new product variant must receive the matching technical weight above.
In particular, a new regular product must be set to **0.1 kg**; leaving it at
0 kg would incorrectly qualify it for free shipping.

This setup is an operational workaround for the Shopify Basic plan. If the
store later uses physical weights for labels or upgrades to custom delivery
logic, replace these marker weights with a Shopify Function or carrier-rate
implementation and retest all mixed-cart cases.
