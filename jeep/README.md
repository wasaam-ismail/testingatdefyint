# Jeep – More Made Possible (DIMO microsite)

Static site: `index.html` + `assets/`. No build step. Upload the folder as-is (e.g. GitHub Pages at testingatdefyint.site/jeep).

## Before going live
1. **Lead capture** – set `LEAD_ENDPOINT` near the top of the `<script>` in `index.html` (Google Apps Script web-app URL from `google-apps-script.gs`, or your CRM webhook). While it is empty the form shows the thank-you state and fires tracking only.
2. **Tracking** – paste GTM / Meta Pixel / TikTok Pixel snippets where marked in `<head>`. Events pushed to `dataLayer`: `cta_click`, `hero_model_switch`, `colour_select`, `form_start`, `form_error`, `generate_lead`. Meta `Lead` and TikTok `SubmitForm` fire automatically if the pixels are loaded.
3. **UTMs** – utm_*, gclid and fbclid are captured from the landing URL (kept for the session) and sent with each lead.
4. **Final URL** – every absolute URL assumes `https://www.testingatdefyint.site/jeep/`. If the site goes live elsewhere, find-and-replace that string in `index.html`, `robots.txt` and `sitemap.xml`.
5. **Indexing** – the page is set to `index, follow`. If you want the testing copy kept out of Google, change the robots meta to `noindex, nofollow` until launch.
6. **Privacy notice** – the consent line mentions DIMO's privacy notice; link it once you have the URL.

Fonts (Big Shoulders Display, Barlow) are self-hosted under the SIL Open Font License.

## SEO checklist (included)
- Title and meta description targeting "Jeep Wrangler / Gladiator price in Sri Lanka" and "test drive"
- Canonical URL, `lang="en-LK"`, geo tags (Colombo)
- Open Graph + X/Twitter cards with a 1200x630 share image (`assets/img/og-image.jpg`)
- Favicons (`favicon.ico`, 16/32 PNG), Apple touch icon, Android icons, `site.webmanifest`
- JSON-LD structured data: AutoDealer (DIMO: address, phone, hours, socials), WebPage, and Product/Car for each model with LKR price and engine specs
- One H1, logical H2/H3 order, descriptive alt text on every image
- Width/height on all images (zero layout shift), responsive `srcset` for large photos, high-priority hero preload, lazy loading below the fold
- `robots.txt` and `sitemap.xml` (with image entries)

### After launch
- **robots.txt** only works at the domain root. If the site lives at `/jeep/`, add the `Sitemap:` line to the root `robots.txt`, or submit `sitemap.xml` directly in Google Search Console.
- Add the Search Console verification tag where marked in `<head>`, then request indexing.
- Check the share preview with the Facebook Sharing Debugger and the structured data with Google's Rich Results Test.
