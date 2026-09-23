# DFCC Card Offers: "Never Miss an Offer"

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
assets/img/             ← DFCC logo, share image, browser-tab icon
assets/css, assets/js, assets/fonts   ← design and logic (don't touch)
```

To edit `settings.js`, use any plain-text editor: TextEdit on Mac (use *Format → Make Plain Text*), Notepad on Windows, or VS Code.

---

## 1. Where the offer data lives

**`offers/offers.xlsx`** is the one and only source of offer data. Every section, countdown, search, filter and category reads from this file.

The site reads the **first sheet**. It recognises the column names below, and similar spellings also work:

| Column | Required? | Example |
|---|---|---|
| Category | ✅ | Dining |
| Merchant | ✅ | Burger King - Colombo 03 |
| CC Offer | one of the two | 0.40 or 40% |
| DC Offer | one of the two | 0.35 or 35% |
| Offer Date | ✅ (or Start/End Date) | 15th NOV - 20th NOV |
| Address | optional | 283 Galle Rd, Colombo 00300 |
| Google Maps | optional | a Google Maps link → "Directions" button |
| Opening Hours | optional | Daily 10:00–23:00 |

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
4. Upload the site again (see **8. Deploying**).

A **new category** appears automatically. Add a picture for it (see **7**).

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

**Logos that still need attention:**
- **Courtyard - Cinnamon Grand Colombo:** no logo supplied (shows initials).
- **Planta:** no logo supplied.
- **OKU:** no logo supplied.
- **Morimoto:** the file supplied (`Morimoto.png`) is the *Morimoto automotive lighting* brand, not the restaurant, so it isn't used. Add the right logo and put its name in `LOGO_FILES`.
- **NineTable:** the supplied logo reads "Table by Nyne". Please confirm it's the right one.

## 7. Where category images go

Put them in **`assets/categories/`**. Landscape or square JPGs about 720px wide work best.

Matching works the same way as logos: first the `CATEGORY_IMAGES` list in `settings.js`, then a file named exactly like the category (e.g. `Dining.jpg`). All 13 current categories have an image.

---

## 8. Deploying (putting it online)

The site is a plain folder of files, so any web host works. The easiest free option is **Netlify Drop**:

1. Go to **https://app.netlify.com/drop** and create a free account.
2. Drag the whole **`DFCC-Never-Miss-an-Offer`** folder onto the page.
3. After a few seconds you get a link (e.g. `https://dfcc-offers.netlify.app`) that works on desktop and phone.
4. **To update later:** open the site in Netlify → **Deploys** → drag the updated folder onto the page again.

Other options that work the same way: Cloudflare Pages, GitHub Pages, or DFCC's own web server (just copy the folder over).

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

## Handy extras

- **Preview a future date:** add `?demo=off&preview=2026-11-19T21:15` to the address to see exactly how the site will look at that Sri Lanka date and time. A dark banner at the top shows you're in preview mode.
- **Share a specific offer:** opening an offer adds `#offer=…` to the address. Send that link and it opens straight to that offer.
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

- [ ] Set `DEMO_MODE` to `"OFF"`
- [ ] Check the **Fitch rating** line in `settings.js → FOOTER` is current
- [ ] Add DFCC's **social media links** in `settings.js → FOOTER → social` (icons only appear once a link is added)
- [ ] Supply the missing logos (see section 6)
- [ ] Some Excel "Address" cells contain research notes (e.g. *"Colombo branch listing; one verified listing in Colombo"*). The site shows these exactly as written, so tidy them in the Excel.
- [ ] Optional: add **Terms**, **Website** and **Start/End Time** columns for richer offer details

## Brand notes

- Colours, logo placement (top-left on the website, bottom-right in the footer), upper-case headlines, the red corporate line and the mandatory footer details follow the **DFCC Corporate Identity Guidelines (June 2019)**.
- The brand typeface **Gotham** is a paid font, so the site uses **Montserrat**, a free, very close match, built into `assets/fonts/fonts.css`. If DFCC supplies Gotham web-font files, a developer can swap them in `assets/fonts/fonts.css` in a couple of minutes.

## Technical notes (for a developer, if you ever need one)

- Plain HTML, CSS and JavaScript with no framework and no build step, chosen for speed, reliability and easy hosting.
- The Excel is read in the browser with SheetJS (`assets/js/vendor/xlsx.mini.min.js`, bundled locally).
- `assets/js/offer-engine.js` handles date parsing, Colombo time and classification. `assets/js/app.js` handles rendering and the demo layer, which runs on its own clock and never touches the real offer logic.
