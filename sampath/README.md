# Sampath Card Offers: "Never Miss an Offer"

This is a complete working website. There's nothing to install and no code to compile. To update it, you only ever touch:

1. **`offers/offers.xlsx`**: the offers (your Excel file)
2. **`settings.js`**: Demo Mode on/off, logo matching, footer details
3. **`assets/logos/`** and **`assets/categories/`**: the images

Everything else runs by itself.

---

## What's in the folder

```
index.html              ← the page itself (you don't need to edit it)
settings.js             ← ★ all your settings, in plain English
offers/offers.xlsx      ← ★ the offers (source of truth)
assets/logos/           ← ★ merchant logos
assets/categories/      ← ★ category images
assets/img/             ← Sampath logo, share image, browser-tab icon
assets/css, assets/js, assets/fonts   ← design and logic (don't touch)
dining/, fashion-retail/ …  ← one folder per category page (made by the builder)
offers/<merchant>/      ← one folder per offer page (made by the builder)
pages.js, sitemap.xml   ← made by the builder
```

To edit `settings.js`, use any plain-text editor: TextEdit on Mac (use *Format → Make Plain Text*), Notepad on Windows, or VS Code.

---

## 1. Where the offer data lives

**`offers/offers.xlsx`** is the one and only source of offer data. Every section, countdown, search, filter and category reads from this file.

The site reads the **first sheet**. The current file (November–December 2026 offers, 365 rows) uses these columns. Similar spellings also work:

| Column | Required? | Example |
|---|---|---|
| Category | ✅ | Dining |
| Merchant | ✅ | Burger King |
| CC Offer | one of the CC / DC / Offer | 0.20, 20% or `Up to 25%` |
| DC Offer | one of the CC / DC / Offer | 0.15, 15% or `Up to 10%` |
| Offer | optional | a line of text, e.g. "Up to 24 months 0% instalment plans" |
| Start Date / End Date | ✅ (or an "Offer Date" text column) | Excel dates, e.g. 01/11/2026 |
| Days | optional | `Thursday`, or `Friday & Saturday`: the offer only runs on those days, every week between the start and end dates |
| Location | optional | Colombo 03, or Online |
| Google Maps | optional | a Google Maps link → "Map" / "Get directions" buttons |
| Website | optional | adds "Website" / "Visit website" buttons (online offers) |
| Terms | optional | that offer's own conditions. Text starting "Promo code" is shown as a highlighted promo code. |
| Card Type | optional | e.g. "Credit cards only" |
| Source | ignored | where the row came from in the original offers workbook |

**Optional extra columns.** Add any of these and the site will use them straight away:

| Column | What it does |
|---|---|
| **Start Time** / **End Time** | e.g. `10:00`, `7 pm`. Without them, offers start at 12:00 AM and run until 11:59 PM. |
| **Start Date** / **End Date** | proper Excel dates, instead of the "15th NOV - 20th NOV" text |
| **Offer** or **Description** | a line of offer text, e.g. "Buy 1 get 1 free on Whoppers" |
| **Terms** | that offer's own T&Cs (otherwise the general note in settings.js is shown) |
| **Website** | adds a "Visit website" button |
| **Location** | overrides the town the site works out from the address |
| **Card Type** | e.g. "Visa Signature only" |

**Year:** the "Offer Date" text has no year, so the site uses `OFFER_YEAR` in `settings.js` (currently **2026**). An offer running from December into January correctly moves into the next year.

---

## 2. How to add an offer

1. Open `offers/offers.xlsx`.
2. Add a new row with at least Category, Merchant, a CC or DC %, and the Offer Date.
3. Save the file with the same name, in the same place.
4. Run the page builder so the new merchant gets its own web address (see **Web addresses** below).
5. Upload the site again (see **8. Deploying**).

A **new category** appears automatically. Add a picture for it (see **7**). Until the builder is run, a new merchant's offer still shows everywhere on the site; it just uses the older `#offer=…` style link instead of its own page.

## 3. How to remove an offer

Delete the row from the Excel, save and upload.

You don't have to remove expired offers, though. The site hides them on its own once their end date passes.

## 4. How to change an offer

Edit the cell in Excel, save and upload. Dates, percentages and names update everywhere at once.

---

## 5. Where merchant logos go

Put logo files in **`assets/logos/`** as PNG or JPG. Square images look best, around 200×200 px.

## 6. How logos are matched to merchants

The site checks in this order:

1. **The list in `settings.js` → `LOGO_FILES`.** If the merchant is listed there, that file is used. Every current merchant is already listed, so you can see exactly which logo goes with which merchant.
2. **Exact file name.** If the merchant isn't in the list, the site looks for a file named exactly like the merchant in the Excel, e.g. `Burger King - Colombo 03.png` (or `.jpg`).
3. **Placeholder.** If neither works, a clean dark tile with the merchant's initials is shown. The page never breaks.

**To fix a logo,** edit or add one line in `LOGO_FILES`:

```js
"Merchant name exactly as in Excel": "file name.png",
```

**Logos that still need attention:** 156 of the 294 merchants have no logo yet and show their initials. They're marked `// no logo yet` in `LOGO_FILES`. Add the file to `assets/logos/` and put its name on that merchant's line.

## 7. Where category images go

Put them in **`assets/categories/`**. Landscape or square JPGs about 720px wide work best.

Matching works the same way as logos: first the `CATEGORY_IMAGES` list in `settings.js`, then a file named exactly like the category (e.g. `Dining.jpg`). All 15 categories have an image. A category without one shows a plain orange tile, so nothing breaks.

---

## 8. Deploying (putting it online)

The site is a plain folder of files, so any web host works. The easiest free option is **Netlify Drop**:

1. Go to **https://app.netlify.com/drop** and create a free account.
2. Drag the whole **`Sampath-Never-Miss-an-Offer`** folder onto the page.
3. After a few seconds you get a link (e.g. `https://sampath-offers.netlify.app`) that works on desktop and phone.
4. **To update later:** open the site in Netlify → **Deploys** → drag the updated folder onto the page again.

### This site's live setup: www.testingatdefyint.site/sampath

- It lives in the **`sampath`** folder of the GitHub repository **wasaam-ismail/testingatdefyint**, which already serves www.testingatdefyint.site. No DNS changes are needed.
- **To update it:** open the repo on github.com → open the `sampath` folder → **Add file → Upload files** → drag in the changed files (for example `offers.xlsx` into `sampath/offers`) → **Commit changes**. It refreshes within 1–2 minutes.

### Custom web address (GitHub Pages)

- If you host on GitHub Pages, `index.html` must sit at the top level of the repo, not inside a sub-folder.
- To use your own address (e.g. `sampath.yourdomain.com`), add a file named **`CNAME`** containing just that address, and point a DNS **CNAME** record at `YOUR-GITHUB-NAME.github.io`.
- **To update the live site:** open the repo on github.com → **Add file → Upload files** → drag in the changed files → **Commit changes**. The site refreshes within 1–2 minutes.
- A `noindex` line in `index.html` keeps this test site out of Google. Remove it if this becomes an official page.
- If the address ever changes, update the `og:url` and `og:image` lines in `index.html` (social apps need a full link to show the preview picture).

Other options that work the same way: Cloudflare Pages, GitHub Pages, or Sampath's own web server (just copy the folder over).

> **Opening `index.html` by double-clicking** works for the **demo**. Browsers block pages opened from your own computer from reading Excel files, though, so the **real offers only appear once the site is hosted**. While testing on your computer, you can **drag the Excel file onto the page** (or use the "Choose offers Excel" button) to preview it. Nothing is saved.

---

## Demo Mode (for presentations)

Open `settings.js` and set:

```js
DEMO_MODE: "ON",    // presentation: looping demo offers
DEMO_MODE: "OFF",   // the real live website
```

That's the only change needed to go live.

- **Demo ON:** fictional demo offers (e.g. "Saffron & Salt Kitchen") run on a sped-up clock that loops every 120 seconds. Offers count down, start, end, disappear, and the whole cycle resets. The real Excel offers still appear in their correct sections underneath (turn this off with `alsoShowRealOffers: false`).
- **Demo OFF:** only the Excel offers, on real Sri Lanka time.
- **Demo timings** are all in `DEMO_CONFIG` at the bottom of `settings.js`. Change `cycleDuration`, or each offer's `startAfter` and `duration` (in seconds). The upcoming demo offers use `startsInDays`, `startTime` and `lastsDays`.
- **Demo controls:** a small "Demo" button sits bottom-left. It has Pause, Restart and Speed (1×, 2×, 5×). Press **D** on the keyboard to hide or show it during a presentation.
- **Quick switch without editing:** add `?demo=off` or `?demo=on` to the end of the web address.

## Hero

The orange hero band has no campaign image: it shows the headline, the live counts and the offer ending soonest. To change the wording, edit the `hero__eyebrow`, `hero__title` and `hero__lede` lines in `index.html`.

## Add to calendar

Every offer has a **calendar** button (on the card, the list row and inside the offer details). It opens three choices:

- **Google Calendar** opens Google Calendar with the event filled in.
- **Apple Calendar** and **Outlook** download a small `.ics` calendar file. On iPhone and iPad it opens straight in Calendar.

The event is all-day and includes the deal, the cards, any promo code, the website or Google Maps link, and a link back to the offer. It has two reminders: 9 am the day before and 9 am on the day.

- Offers of up to a week go in as one event across their dates.
- Offers longer than a week would sit across the calendar for weeks, so they go in as a single day: the day they start, or their last day if they're already running.
- Weekly offers (the **Days** column) go in as a repeating event on those days until the end date.

## Sharing offers

Every offer has a **Share** button (on the card, on the list row and inside the offer details):

- **WhatsApp** opens WhatsApp with the offer text and link already filled in.
- **Messenger** and **Instagram** don't allow websites to pre-fill a direct message. On phones, the button opens the phone's share sheet, where Messenger and Instagram appear. On computers, the link is copied and Messenger / Instagram messages open in a new tab, ready to paste.
- **Copy link** copies a link that opens straight to that offer.

## Handy extras

- **Preview a future date:** add `?demo=off&preview=2026-11-19T21:15` to the address to see exactly how the site will look at that Sri Lanka date and time. A dark banner at the top shows you're in preview mode.
- **Share a specific offer:** every offer has its own address (e.g. `/offers/burger-king/`). Share buttons use it, and older `#offer=…` links still work.
- **Search shortcuts:** searching "pizza", "spa" or "hotel" finds the right categories. Add your own words in `SEARCH_SYNONYMS` in `settings.js`.
- **Press `/`** on a keyboard to jump to the search box.

## How the timing works

- All times use **Sri Lanka time (Asia/Colombo, UTC+5:30)**, whatever the visitor's own device is set to.
- Nothing is hard-coded to a date. Every second, each offer is placed into a section:
  - **What's on today:** live now → countdown to when it **ends**. Offers starting later today also appear here, with a **starts in** countdown.
  - **Tomorrow:** starts tomorrow → countdown to when it **starts**.
  - **Next 3 days:** starts in 2–3 days.
  - **Next week:** starts in 4–7 days.
  - **Coming up:** starts in 8 or more days.
  - **Expired:** hidden automatically.
- When a countdown hits zero, the offer moves by itself. No page refresh is needed.

## Before going live: checklist

- [x] Set `DEMO_MODE` to `"OFF"` (done: the site now shows the real November–December offers)
- [ ] Check the **Fitch rating** and **hotline** lines in `settings.js → FOOTER` are current (set to AA-(lka) and 011 2 303050, October 2026)
- [ ] Replace `assets/img/sampath-logo.png` with a high-resolution logo
- [ ] Add Sampath's **social media links** in `settings.js → FOOTER → social` (icons only appear once a link is added)
- [ ] Supply the missing logos: merchants marked `// no logo yet` in `settings.js → LOGO_FILES` show their initials
- [ ] **Search engines:** follow the "Going live on Sampath's own address" steps in the SEO section below
- [ ] **Tracking:** add the GA4 / Google Ads / Tag Manager IDs and the privacy policy link in `settings.js → ANALYTICS`

## SEO and sharing (already set up)

- **Page title and description** are written for searches like "Sampath card offers" and "Sampath credit card offers Sri Lanka". They're in the `<head>` of `index.html`.
- **Share preview:** `assets/img/og-image.jpg` (1200 × 630) is the picture WhatsApp, Facebook, LinkedIn and X show when the link is shared, with its own description and alt text.
- **Icons:** browser tab icon (`favicon.ico` and `assets/img/favicon-*.png`), iPhone home-screen icon (`apple-touch-icon.png`) and Android icons (`icon-192.png`, `icon-512.png`, listed in `site.webmanifest`). They're made from the small Sampath emblem, so swap in sharper versions at the same file names when a high-resolution logo arrives.
- **Structured data:** a block at the end of the `<head>` tells Google this is Sampath Bank's card-offers page and includes the questions from the FAQ.
- **Readable text:** the "Sampath Bank card offers, all in one place" section and the questions above the footer are plain text that search engines can read without running the page's code. Every merchant logo has alt text ("Burger King logo"), and opening an offer changes the browser tab title to that offer.
- **Every category and offer page** has its own title, description, share picture and breadcrumb data (see **Web addresses**).
- **`sitemap.xml`** lists every page (home, 15 categories, every offer) for Google Search Console.

### Going live on Sampath's own address
The test copy is deliberately hidden from Google (`noindex`), so a test page doesn't show up in search results as Sampath Bank. When it moves to Sampath's address:
1. In `index.html`, change `<meta name="robots" content="noindex, nofollow">` to `<meta name="robots" content="index, follow, max-image-preview:large">`.
2. Run the page builder with the new address (see **Web addresses**). It rewrites every page, `sitemap.xml` and the structured data in one go.
3. Add a `robots.txt` at the root of that website with the line `Sitemap: https://<new address>/sitemap.xml`, then submit the sitemap in Google Search Console.

## Web addresses

Every category and every offer has its own clean web address, so it can be shared, bookmarked, found on Google and used for remarketing:

| Page | Address |
|---|---|
| Home | `/sampath/` |
| A category | `/sampath/dining/`, `/sampath/fashion-retail/`, `/sampath/instalment-plans/` … |
| An offer | `/sampath/offers/burger-king/`, `/sampath/offers/keells/` … |

- Tapping a category tile or an offer changes the address without reloading, and the browser's **Back** button works as expected.
- Each page has its own title, description, heading and share picture, so a WhatsApp share of `/offers/burger-king/` previews as "Up to 20% off at Burger King with Sampath cards".
- An offer address shows that merchant's offer that's live now, or the next one coming up. If a merchant has no offers any more, the page shows "That offer is no longer available" and goes to the home page.

**How the pages are made.** Each address is a small copy of `index.html` with that page's details, written by `build_pages.py` (kept outside the site folder, with the agency) from the Excel. After changing the Excel, run:

```
python3 build_pages.py path/to/sampath https://www.testingatdefyint.site/sampath/
```

It rewrites the home page, the category pages, `offers/<merchant>/` pages, `pages.js` (the list of pages the site uses) and `sitemap.xml`. Use Sampath's address in place of the test one when the site moves. It needs Python 3 with `openpyxl` and `Pillow`.

## Tracking (Google tag, remarketing and cookie consent)

Add the IDs in `settings.js → ANALYTICS`: `GA4_ID` (Google Analytics 4), `GOOGLE_ADS_ID` (remarketing) and/or `GTM_ID` (Tag Manager). Nothing loads until a visitor taps **Accept all** on the cookie banner. Until then Google's Consent Mode keeps everything switched off, in line with the Personal Data Protection Act. "Cookie settings" in the footer lets visitors change their mind. Set `PRIVACY_POLICY_URL` to Sampath's privacy policy.

What's sent (every event carries `offer_category`, and offer events also carry `offer_merchant` and `item_id`):

| Event | When |
|---|---|
| `page_view` | every page, including each category and offer (with `content_group`: Home, Category or Offer) |
| `view_item_list` | a category page is viewed |
| `view_item` | an offer is viewed (GA4 ecommerce format, with the merchant as the item) |
| `get_directions` | Map / Get directions is tapped |
| `visit_merchant_website` | Website / Visit website is tapped |
| `add_to_calendar` | Google, Apple or Outlook calendar is chosen (`method`) |
| `share` | WhatsApp, Messenger, Instagram or Copy link (`method`) |
| `search` | someone searches (`search_term`) |
| `filter_offers` | a card, location, merchant or time filter is used |

**Building audiences:** in GA4 or Google Ads, create audiences by page address (e.g. contains `/dining/` or `/offers/keells/`), by `offer_category` / `offer_merchant`, or by event (e.g. everyone who tapped `get_directions` in Supermarkets). To check what's being sent, add `?debug_analytics=1` to the address and open the browser console.

## Brand notes

- Colours are taken from the Sampath Bank logo: orange `#F07D22`, a deeper orange `#B9510F` wherever white text sits on orange (so it stays readable), and charcoal `#262626`. They're all at the top of `assets/css/styles.css`, so a developer can match Sampath's official brand values in a minute.
- **Logo:** `assets/img/sampath-logo.png` was made from the small preview inside the supplied Illustrator file (the file itself arrived damaged), so it's a little soft on high-resolution screens. Replace it with a clean PNG or SVG at the same file name before presenting. `favicon.png` and `sampath-emblem.png` come from the same source.
- The site uses **Montserrat**, a free font built into `assets/fonts/fonts.css`. If Sampath supplies its own brand web fonts, a developer can swap them in there.
- The "0% Easy Payment Plans" photo has been edited so the card shows Sampath orange instead of another bank's card.

## Technical notes (for a developer, if you ever need one)

- Plain HTML, CSS and JavaScript with no framework and no build step, chosen for speed, reliability and easy hosting.
- The Excel is read in the browser with SheetJS (`assets/js/vendor/xlsx.mini.min.js`, bundled locally).
- `assets/js/offer-engine.js` handles date parsing, Colombo time and classification. `assets/js/app.js` handles rendering and the demo layer, which runs on its own clock and never touches the real offer logic.
