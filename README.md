# Bioloark

אתר Headless בעברית עבור Bioloark. התוכן השיווקי והנתיבים מנוהלים בקוד, והמסחר מיועד להתחבר ל־Shopify Storefront API.

## עבודה מקומית

```bash
npm run dev
npm run build
```

הקטלוג במצב Preview נוצר מקובצי ה־Markdown שבתיקייה האחות `bioloark-content`:

```bash
npm run content:sync
```

## חיבור Shopify

1. מתקינים בחנות Shopify את ערוץ המכירה **Headless** ויוצרים Storefront.
2. מעניקים הרשאות לקריאת מוצרים, אוספים, תוכן ומדיניות, ולניהול סל.
3. מעתיקים את `.env.example` אל `.env.local` וממלאים את דומיין החנות ואת הטוקן הפרטי.
4. מוודאים שה־handles של המוצרים והאוספים תואמים ל־slugs שבאתר הישן.
5. מריצים Build ובודקים מוצר, וריאנט, סל ומעבר ל־Shopify Checkout.

כאשר משתני Shopify חסרים או שהשירות אינו זמין, האתר חוזר אוטומטית לקטלוג Preview. במצב זה הרכישה מושבתת ולא נשמר סל.

## נתיבים חשובים

- `/` — דף הבית
- `/project-showcase` — פרויקטים נבחרים
- `/category/<handle>` — קטגוריות Shopify והנתיבים הישנים
- `/product-page/<handle>` — עמודי מוצר בנתיב התואם ל־Wix
- `/search?q=` — חיפוש מוצרים
- `/home-1` — הפניית 301 קבועה אל דף הבית

הדומיין הקאנוני מוגדר כ־`https://www.bioloark.co.il`. אין לחבר את הדומיין עד שחנות Shopify, המדיניות והמשלוחים מוכנים להשקה.
