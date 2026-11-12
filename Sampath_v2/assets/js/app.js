/* =====================================================================
   SAMPATH BANK "NEVER MISS AN OFFER" — page logic
   Reads settings.js + the Excel, then renders and ticks every second.
   You shouldn't need to edit this file.
   ===================================================================== */
(function () {
  "use strict";

  var S = window.SETTINGS || {}, D = window.DEMO_CONFIG || {}, E = window.OfferEngine;
  var $ = function (sel, el) { return (el || document).querySelector(sel); };
  var $$ = function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };
  var T = window.SampathTrack || { pageView: function () {}, event: function () {} };

  /* ------------------------------------------------------------------
     WEB ADDRESSES — every category and every offer has its own page:
         /            home              /dining/          a category
         /offers/burger-king/           one merchant's offer
     The pages themselves are made by the build script from the Excel
     (see README → "Web addresses"). pages.js lists which ones exist.
     ------------------------------------------------------------------ */
  var ROOT = new URL(window.SITE_ROOT || "./", location.href);   // the site's home folder
  var PAGES = window.SITE_PAGES || { categories: {}, merchants: {} };
  var CAT_BY_SLUG = {}, MERCH_BY_SLUG = {};
  Object.keys(PAGES.categories).forEach(function (c) { CAT_BY_SLUG[PAGES.categories[c]] = c; });
  Object.keys(PAGES.merchants).forEach(function (m) { MERCH_BY_SLUG[PAGES.merchants[m]] = m; });
  var HOME = {
    title: "Sampath Card Offers | Credit & Debit Card Deals in Sri Lanka",
    desc: "Every Sampath Bank credit and debit card offer in one place, from dining and fashion to travel and 0% instalment plans, with live countdowns and maps.",
    eyebrow: "Sampath card offers", h1: "Never miss an offer",
    lede: "Every Sampath card offer, live by the second. See what's on today, what starts tomorrow and what's coming next.",
  };
  function asset(p) { return new URL(p, ROOT).href; }
  function catPath(cat) { var s = cat && PAGES.categories[cat]; return s ? s + "/" : null; }
  function merchantPath(m) { var s = m && PAGES.merchants[m]; return s ? "offers/" + s + "/" : null; }
  function pageUrl(rel) { return new URL(rel || "", ROOT).href; }
  function currentRoute() {
    var path = decodeURIComponent(location.pathname), base = decodeURIComponent(ROOT.pathname);
    var rel = path.indexOf(base) === 0 ? path.slice(base.length) : "";
    rel = rel.replace(/index\.html$/, "");
    var m = rel.match(/^offers\/([^\/]+)\/?$/); if (m) return { merchantSlug: m[1] };
    var c = rel.match(/^([^\/]+)\/?$/); if (c && CAT_BY_SLUG[c[1]]) return { category: CAT_BY_SLUG[c[1]] };
    return {};
  }
  var CAN_ROUTE = /^https?:$/.test(location.protocol) && !!(history && history.pushState);
  // The address changes without reloading, so fix every relative link and file path now,
  // while they still point where they should (icons, logo, category links, etc.)
  if (CAN_ROUTE) $$("[href],[src],[srcset]").forEach(function (el) {
    ["href", "src"].forEach(function (k) {
      var v = el.getAttribute(k);
      if (v && !/^(?:[a-z]+:|#|\/)/i.test(v)) el.setAttribute(k, new URL(v, location.href).href);
    });
    var ss = el.getAttribute("srcset");
    if (ss) el.setAttribute("srcset", ss.split(",").map(function (part) {
      var bits = part.trim().split(/\s+/); bits[0] = new URL(bits[0], location.href).href; return bits.join(" ");
    }).join(", "));
  });
  function goTo(rel, replace, st) {
    if (!CAN_ROUTE || rel === null) return false;
    var url = pageUrl(rel) + location.search;
    if (url === location.href) return false;
    history[replace ? "replaceState" : "pushState"](st || {}, "", url);
    return true;
  }
  function setMeta(sel, attr, val) { var el = document.querySelector(sel); if (el) el.setAttribute(attr, val); }
  // page title, description, canonical address and hero heading for a list page (home or category)
  function catLabel(cat) { return (PAGES.labels && PAGES.labels[cat]) || cat + " offers"; }
  function shortDeal(d) {
    return d.replace(/^Up to \d+ months 0% instalment plans?$/i, "0% instalment plans").replace(/^\d+ months 0% extended settlement plans?$/i, "0% settlement plan");
  }
  function offerTitle(o) {
    var d = shortDeal(dealText(o));
    var core = o.category === "Extended Settlement Plans" ? o.merchant + ": " + d : d + " at " + o.merchant;
    var t = core + " | Sampath Card Offers";
    return t.length <= 60 ? t : core + " | Sampath Offers";
  }
  function applyListMeta(cat) {
    var t = HOME.title;
    if (cat) { t = catLabel(cat) + " | Sampath Bank Card Offers"; if (t.length > 60) t = catLabel(cat) + " | Sampath Card Offers"; }
    var d = cat ? "Sampath Bank credit and debit card offers on " + cat.toLowerCase() + " in Sri Lanka, with live countdowns, maps and calendar reminders." : HOME.desc;
    document.title = t; baseTitle = t;
    setMeta('meta[name="description"]', "content", d);
    var rel = cat ? catPath(cat) : "";
    if (rel !== null) { setMeta('link[rel="canonical"]', "href", pageUrl(rel)); setMeta('meta[property="og:url"]', "content", pageUrl(rel)); }
    var h = $("#heroTitle"), eb = $(".hero__eyebrow"), le = $(".hero__lede");
    if (h) h.textContent = cat ? catLabel(cat) : HOME.h1;
    if (eb) eb.textContent = HOME.eyebrow;
    if (le) le.textContent = cat ? "Every Sampath card offer on " + cat.toLowerCase() + ", live by the second." : HOME.lede;
  }
  function trackList(cat) {
    if (cat) {
      T.pageView({ title: document.title, group: "Category", category: cat });
      T.event("view_item_list", { item_list_id: PAGES.categories[cat] || E.slug(cat), item_list_name: cat, offer_category: cat });
    } else T.pageView({ title: document.title, group: "Home" });
  }
  function trackOffer(o) {
    T.pageView({ title: document.title, group: "Offer", category: o.category, merchant: o.merchant });
    T.event("view_item", { offer_category: o.category, offer_merchant: o.merchant, items: [itemFor(o)] });
  }
  function itemFor(o) {
    return { item_id: PAGES.merchants[o.merchant] || E.slug(o.merchant), item_name: o.merchant, item_brand: o.merchant,
      item_category: o.category, item_variant: dealText(o), google_business_vertical: "custom" };
  }
  function evParams(o, extra) {
    return Object.assign({ offer_category: o.category, offer_merchant: o.merchant, item_id: PAGES.merchants[o.merchant] || E.slug(o.merchant) }, extra || {});
  }
  // the offer to show for a merchant's page: live now, else the next one, else the latest
  function merchantOffer(slug) {
    var name = MERCH_BY_SLUG[slug], now = realNow();
    var list = allOffers().filter(function (o) { return o.merchant === name || E.slug(o.merchant) === slug; });
    var live = list.filter(function (o) { return o.start <= now && o.end > now; }).sort(function (a, b) { return a.end - b.end; });
    if (live.length) return live[0];
    var up = list.filter(function (o) { return o.start > now; }).sort(function (a, b) { return a.start - b.start; });
    if (up.length) return up[0];
    return list.sort(function (a, b) { return b.end - a.end; })[0] || null;
  }

  /* ------------------------------------------------------------------
     MODE
     ------------------------------------------------------------------ */
  var params = new URLSearchParams(location.search);
  var demoParam = (params.get("demo") || "").toLowerCase();
  var DEMO_ON = demoParam ? /^(on|1|true|yes)$/.test(demoParam) : String(S.DEMO_MODE || "").toUpperCase() === "ON";

  /* PREVIEW A DATE (for checking only): add ?preview=2026-11-15T09:00 to the
     address to see the real offers exactly as they will appear at that
     Sri Lanka date/time. A banner makes it obvious. Normal visitors never
     see this because they don't use that address.                         */
  var PREVIEW_OFFSET = 0, previewLabel = "";
  (function () {
    var m = (params.get("preview") || "").match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{1,2}):(\d{2}))?$/);
    if (!m) return;
    var t = E.colomboEpoch(+m[1], +m[2], +m[3], +(m[4] || 0), +(m[5] || 0));
    PREVIEW_OFFSET = t - Date.now();
    previewLabel = E.fmtDate(t, true, true) + ", " + E.fmtTime(t);
  })();
  function realNow() { return Date.now() + PREVIEW_OFFSET; }

  /* ------------------------------------------------------------------
     STATE
     ------------------------------------------------------------------ */
  var state = {
    realOffers: [],
    demoOffers: [],
    filters: { q: "", category: "", when: "", card: "", location: "", merchant: "" },
    showAllComingUp: false,
    signature: "",
    prevBucket: {},          // id -> last bucket (to detect "just ended" / "just started")
    endedAt: {},             // id -> real ms when it ended (brief "Offer ended" state)
    startedAt: {},           // id -> real ms when it went live (brief highlight)
    cdEls: [],               // countdown elements to update each second
    lastSecond: -1,
    loadState: DEMO_ON ? "demo" : "loading",
    previewFile: "",
  };
  var ENDED_GRACE_MS = 2400, STARTED_GLOW_MS = 5000;

  /* ------------------------------------------------------------------
     DEMO CLOCK — an independent simulation layer. Real offers keep
     using the real clock; demo offers use this accelerated, looping one.
     ------------------------------------------------------------------ */
  var demo = {
    cycleMs: Math.max(20, +D.cycleDuration || 120) * 1000,
    speed: 1, paused: false,
    elapsedAtAnchor: 0, anchorReal: Date.now(), origin: Date.now(),
  };
  function demoElapsed() {
    return demo.paused ? demo.elapsedAtAnchor : demo.elapsedAtAnchor + (Date.now() - demo.anchorReal) * demo.speed;
  }
  function demoNow() { return demo.origin + Math.min(demoElapsed(), demo.cycleMs); }
  function reanchor() { demo.elapsedAtAnchor = demoElapsed(); demo.anchorReal = Date.now(); }
  function restartDemo() {
    demo.elapsedAtAnchor = 0; demo.anchorReal = Date.now(); demo.origin = Date.now();
    state.prevBucket = {}; state.endedAt = {}; state.startedAt = {};
    buildDemoOffers();
    state.signature = "";
  }
  function buildDemoOffers() {
    var o = demo.origin, list = [];
    var today = E.colomboDayIndex(o);
    (D.liveOffers || []).forEach(function (d, i) {
      var start = o + (+d.startAfter || 0) * 1000;
      list.push(demoOffer(d, "demo-live-" + i, start, start + Math.max(1, +d.duration || 30) * 1000));
    });
    (D.upcomingOffers || []).forEach(function (d, i) {
      var t = E.parseTime(d.startTime) || { hh: 0, mm: 0 };
      var day = today + (+d.startsInDays || 1);
      var start = day * E.DAY_MS - E.COLOMBO_OFFSET_MS + (t.hh * 60 + t.mm) * 60000;
      var end = (day + Math.max(1, +d.lastsDays || 1)) * E.DAY_MS - E.COLOMBO_OFFSET_MS;
      list.push(demoOffer(d, "demo-up-" + i, start, end));
    });
    state.demoOffers = list;
  }
  function demoOffer(d, id, start, end) {
    return {
      id: id, source: "demo", merchant: d.merchant, category: d.category,
      credit: d.credit != null ? E.parseOfferValue(d.credit) : null,
      debit: d.debit != null ? E.parseOfferValue(d.debit) : null,
      offerText: d.offer || "", address: d.address || "", location: d.location || "",
      // demo merchants are fictitious, so the map opens their area (or the "maps" link set in settings.js)
      mapsUrl: d.maps || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent((d.location && !/online/i.test(d.location) ? d.location : "Colombo") + ", Sri Lanka"),
      hours: d.hours || "", terms: d.terms || "", url: d.url || "", cardType: "",
      allDay: false, noLogoFile: true, start: start, end: end,
    };
  }

  function nowFor(o) { return o.source === "demo" ? demoNow() : realNow(); }

  /* ------------------------------------------------------------------
     LOAD REAL OFFERS FROM EXCEL
     ------------------------------------------------------------------ */
  function loadExcel() {
    if (DEMO_ON && D.alsoShowRealOffers === false) return Promise.resolve();
    return fetch(asset(S.OFFERS_FILE || "offers/offers.xlsx"), { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.arrayBuffer(); })
      .then(function (buf) { ingestWorkbook(buf); if (!DEMO_ON) state.loadState = "ready"; })
      .catch(function (err) {
        console.warn("[Offers] Could not load the Excel file:", err.message);
        if (!DEMO_ON) state.loadState = "error";
      });
  }
  function ingestWorkbook(buf) {
    var wb = XLSX.read(buf, { type: "array", cellDates: true });
    var ws = wb.Sheets[wb.SheetNames[0]];
    var rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: null });
    var res = E.rowsToOffers(rows, S);
    res.warnings.forEach(function (w) { console.warn("[Offers] " + w); });
    console.info("[Offers] Loaded " + res.offers.length + " offers from the Excel.");
    state.realOffers = res.offers;
    state.signature = "";
  }

  /* ------------------------------------------------------------------
     ASSETS: logos and category images
     ------------------------------------------------------------------ */
  function enc(path) { return path.split("/").map(encodeURIComponent).join("/"); }
  function logoSources(o) {
    if (o.noLogoFile) return [];
    var map = S.LOGO_FILES || {};
    if (Object.prototype.hasOwnProperty.call(map, o.merchant)) return map[o.merchant] ? [asset("assets/logos/" + enc(map[o.merchant]))] : [];
    return [".png", ".jpg", ".jpeg", ".webp"].map(function (x) { return asset("assets/logos/" + enc(o.merchant + x)); });
  }
  function categoryImage(cat) {
    var map = S.CATEGORY_IMAGES || {};
    var f = Object.prototype.hasOwnProperty.call(map, cat) ? map[cat] : cat + ".jpg";
    // absolute URL, because CSS resolves url() inside custom properties relative to the stylesheet
    return f ? asset("assets/categories/" + enc(f)) : "";
  }
  function initials(name) {
    var w = String(name).replace(/[^A-Za-z0-9&' ]/g, " ").split(/\s+/).filter(function (x) { return x && !/^(the|&|and|of)$/i.test(x); });
    return ((w[0] || "?")[0] + (w[1] ? w[1][0] : "")).toUpperCase();
  }
  function logoHTML(o, cls) {
    var src = logoSources(o);
    var mono = '<span class="mono" aria-hidden="true">' + esc(initials(o.merchant)) + "</span>";
    if (!src.length) return '<div class="logo ' + (cls || "") + ' logo--mono">' + mono + "</div>";
    return '<div class="logo ' + (cls || "") + '"><img src="' + src[0] + '" data-fallbacks="' + esc(src.slice(1).join("|")) +
      '" alt="' + esc(o.merchant) + ' logo" width="120" height="120" loading="lazy" decoding="async" onerror="window.__logoErr(this)"></div>';
  }
  window.__logoErr = function (img) {
    var rest = (img.getAttribute("data-fallbacks") || "").split("|").filter(Boolean);
    if (rest.length) { img.setAttribute("data-fallbacks", rest.slice(1).join("|")); img.src = rest[0]; return; }
    var box = img.parentNode, name = img.alt.replace(/ logo$/, "");
    box.classList.add("logo--mono");
    box.innerHTML = '<span class="mono" aria-hidden="true">' + esc(initials(name)) + '</span><span class="sr-only">' + esc(name) + "</span>";
  };

  /* ------------------------------------------------------------------
     HELPERS
     ------------------------------------------------------------------ */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function fmtPct(v) { return v == null ? "" : (v.pct != null ? (v.upto ? "Up to " : "") + (Math.round(v.pct * 10) / 10) + "%" : v.text); }
  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }

  var ICON = {
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="10" r="2.6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    cal: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.8" fill="none"/></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    card: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5.5" width="19" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M2.5 10h19" stroke="currentColor" stroke-width="1.8"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    ext: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    share: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5.5" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="6" cy="12" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="18.5" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.2 10.8l7.6-4.1M8.2 13.2l7.6 4.1" stroke="currentColor" stroke-width="1.8"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2s.2-1.1.2-1.2-.2-.2-.4-.3z"/></svg>',
    messenger: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2C6.4 2 2 6.1 2 11.6c0 2.9 1.2 5.4 3.1 7.1v3.3l3-1.7c.9.3 1.9.4 3 .4 5.6 0 10-4.1 10-9.6S17.6 2 12 2zm1 12.9l-2.6-2.7-5 2.7 5.5-5.8 2.6 2.7 4.9-2.7z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3zm4 3.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM17.2 5.8a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>',
    link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    calplus: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 10h17M8 3v4M16 3v4M12 13v5M9.5 15.5h5" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>',
    globe: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.6 5.3 3.6 8.5s-1.1 5.9-3.6 8.5c-2.5-2.6-3.6-5.3-3.6-8.5s1.1-5.9 3.6-8.5z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    google: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3zM12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22zM6.4 14a6 6 0 0 1 0-3.9V7.5H3.1a10 10 0 0 0 0 9zM12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.7 9.4 5.9 12 5.9z"/></svg>',
    apple: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5a4.3 4.3 0 0 0-3.4-1.8c-1.4-.2-2.8.8-3.5.8s-1.8-.8-3-.8a4.5 4.5 0 0 0-3.8 2.3c-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3s1.6-.7 3-.7 1.8.7 3 .7 2-1.1 2.8-2.3a9.6 9.6 0 0 0 1.3-2.6 4 4 0 0 1-2.5-3.7zM14.1 5.8A4 4 0 0 0 15 3a4.1 4.1 0 0 0-2.7 1.4 3.8 3.8 0 0 0-1 2.7 3.4 3.4 0 0 0 2.8-1.3z"/></svg>',
    outlook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13 4.5v15l-10-1.8V6.3zM8 8.5c-1.7 0-2.8 1.5-2.8 3.5S6.3 15.5 8 15.5s2.8-1.5 2.8-3.5S9.7 8.5 8 8.5zm0 1.5c.9 0 1.3.9 1.3 2s-.4 2-1.3 2-1.3-.9-1.3-2 .4-2 1.3-2zM14 7h7v10h-7v-1.6l2 1.2 4-2.5V9.6l-4 2.5-2-1.2z"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 9-12h-7z" fill="currentColor"/></svg>',
  };

  /* ------------------------------------------------------------------
     SECTIONS
     ------------------------------------------------------------------ */
  var SECTIONS = [
    { key: "today",    title: "What's on today", buckets: ["today", "latertoday"], line: "Live right now. When the clock hits zero, it's gone." },
    { key: "tomorrow", title: "Tomorrow",        buckets: ["tomorrow"],            line: "Unlocking tomorrow. Be ready when the clock runs out." },
    { key: "next3",    title: "Next 3 days",     buckets: ["next3"],               line: "Just around the corner. Plan your spend." },
    { key: "nextweek", title: "Next week",       buckets: ["nextweek"],            line: "Worth waiting for." },
    { key: "comingup", title: "Coming up",       buckets: ["comingup"],            line: "Further ahead. Mark your calendar." },
  ];
  function sectionDates(key) {
    var now = realNow(), d0 = E.colomboDayIndex(now);
    var at = function (n) { return (d0 + n) * E.DAY_MS - E.COLOMBO_OFFSET_MS + 43200000; };
    switch (key) {
      case "today": return E.fmtDate(now, true);
      case "tomorrow": return E.fmtDate(at(1), true);
      case "next3": return E.fmtDate(at(2), true) + " – " + E.fmtDate(at(3), true);
      case "nextweek": return E.fmtDate(at(4), true) + " – " + E.fmtDate(at(7), true);
      case "comingup": return "From " + E.fmtDate(at(8), true);
    }
    return "";
  }

  /* ------------------------------------------------------------------
     COMPUTE — which offer is where, right now
     ------------------------------------------------------------------ */
  function allOffers() {
    var list = [];
    if (DEMO_ON) list = list.concat(state.demoOffers);
    if (!DEMO_ON || D.alsoShowRealOffers !== false) list = list.concat(state.realOffers);
    return list;
  }

  function compute() {
    var realNow = Date.now(), views = [];
    allOffers().forEach(function (o) {
      var now = nowFor(o), b = E.classify(o, now), prev = state.prevBucket[o.id], status;
      if (b === "expired") {
        if (prev === "today" && !state.endedAt[o.id]) state.endedAt[o.id] = realNow;
        if (state.endedAt[o.id] && realNow - state.endedAt[o.id] < ENDED_GRACE_MS) { b = "today"; status = "ended"; }
      } else if (b === "today" && prev && prev !== "today" && prev !== "expired") {
        state.startedAt[o.id] = realNow;
        if (prev) toast(o);
      }
      state.prevBucket[o.id] = status === "ended" ? "today" : b;
      if (b === "expired") { state.prevBucket[o.id] = "expired"; return; }
      if (!status) {
        if (b === "today") {
          var left = o.end - now;
          var soonMs = o.source === "demo" ? (+D.endingSoonSeconds || 10) * 1000 : (+S.ENDING_SOON_HOURS || 3) * 3600000;
          status = left <= soonMs ? "ending" : (left > E.DAY_MS ? "live long" : "live");
          if (state.startedAt[o.id] && realNow - state.startedAt[o.id] < STARTED_GLOW_MS) status += " just";
        } else status = b === "latertoday" ? "soon" : "upcoming";
      }
      views.push({ o: o, b: b, status: status });
    });
    // weekly offers: show only the next (or current) occurrence of each series
    var first = {};
    views.forEach(function (v) { var k = v.o.series; if (k && (!first[k] || v.o.start < first[k].o.start)) first[k] = v; });
    return views.filter(function (v) { return !v.o.series || first[v.o.series] === v; });
  }

  function matches(v) {
    var f = state.filters, o = v.o;
    if (f.category && o.category !== f.category) return false;
    if (f.location && o.location !== f.location) return false;
    if (f.merchant && o.merchant !== f.merchant) return false;
    if (f.card === "credit" && !o.credit) return false;
    if (f.card === "debit" && !o.debit) return false;
    if (f.when) {
      var sec = SECTIONS.filter(function (s) { return s.key === f.when; })[0];
      if (sec && sec.buckets.indexOf(v.b) < 0) return false;
    }
    if (f.q) {
      var syn = (S.SEARCH_SYNONYMS || {})[o.category] || [];
      var hay = norm([o.merchant, o.category, o.address, o.location, o.hours, o.offerText, o.cardType, o.url, o.terms, o.daysLabel, syn.join(" "),
        o.credit ? "credit" : "", o.debit ? "debit" : ""].join(" | "));
      var toks = norm(f.q).split(/\s+/).filter(Boolean);
      for (var i = 0; i < toks.length; i++) if (hay.indexOf(toks[i]) < 0) return false;
    }
    return true;
  }
  function filtersActive() { var f = state.filters; return !!(f.q || f.category || f.when || f.card || f.location || f.merchant); }

  function sortFor(key) {
    return function (a, b) {
      if (key === "today") {
        var ra = a.b === "today" ? 0 : 1, rb = b.b === "today" ? 0 : 1;
        if (ra !== rb) return ra - rb;
        if (a.status === "ended" && b.status !== "ended") return 1;
        if (b.status === "ended" && a.status !== "ended") return -1;
        return ra === 0 ? a.o.end - b.o.end : a.o.start - b.o.start;
      }
      return (a.o.start - b.o.start) || (maxPct(b.o) - maxPct(a.o)) || a.o.merchant.localeCompare(b.o.merchant);
    };
  }
  function maxPct(o) { return Math.max(o.credit && o.credit.pct || 0, o.debit && o.debit.pct || 0); }

  /* ------------------------------------------------------------------
     RENDER
     ------------------------------------------------------------------ */
  function offerValueHTML(o, big) {
    var card = state.filters.card, c = o.credit, d = o.debit, head, sub = "";
    if (card === "credit" && c) head = valHead(c, false) , sub = "with Sampath Credit Cards";
    else if (card === "debit" && d) head = valHead(d, false), sub = "with Sampath Debit Cards";
    else if (c && d && c.pct != null && d.pct != null) {
      var same = c.pct === d.pct && !c.upto === !d.upto;
      head = valHead({ pct: Math.max(c.pct, d.pct) }, !same || c.upto || d.upto);
      sub = same ? "Credit &amp; Debit Cards" : '<span class="split"><b>Credit ' + fmtPct(c) + '</b><i></i><b>Debit ' + fmtPct(d) + "</b></span>";
    } else if (c || d) { head = valHead(c || d, false); sub = c ? "with Sampath Credit Cards" : "with Sampath Debit Cards"; }
    else head = '<span class="val__text">' + esc(o.offerText || "Card offer") + "</span>";
    var extra = o.offerText && (c || d) ? '<p class="val__desc">' + esc(o.offerText) + "</p>" : "";
    return '<div class="val' + (big ? " val--big" : "") + '">' + head + (sub ? '<p class="val__sub">' + sub + "</p>" : "") + extra + "</div>";
  }
  function valHead(v, upTo) {
    if (v.pct == null) return '<span class="val__text">' + esc(v.text) + "</span>";
    return '<p class="val__head">' + (upTo || v.upto ? '<span class="val__upto">Up to</span>' : "") +
      '<span class="val__num">' + (Math.round(v.pct * 10) / 10) + '<span class="val__pct">%</span></span><span class="val__off">off</span></p>';
  }

  function cdHTML(v, variant) {
    var toEnd = v.b === "today";
    var label = v.status === "ended" ? "Offer ended" : toEnd ? "Ends in" : "Starts in";
    return '<div class="cd cd--' + (variant || "card") + (toEnd ? " cd--end" : " cd--start") + '" role="timer" data-cd="' + esc(v.o.id) + '" data-to="' + (toEnd ? "end" : "start") + '">' +
      '<span class="cd__label">' + label + "</span>" +
      '<span class="cd__units">' +
        '<span class="cd__u cd__u--d"><b>00</b><i>days</i></span>' +
        '<span class="cd__u"><b>00</b><i>hrs</i></span><span class="cd__sep">:</span>' +
        '<span class="cd__u"><b>00</b><i>min</i></span><span class="cd__sep">:</span>' +
        '<span class="cd__u"><b>00</b><i>sec</i></span>' +
      "</span></div>";
  }

  function whenLine(o) {
    if (o.series) return "Every " + o.daysLabel + " until " + E.fmtDate(E.displayEnd({ end: o.seriesEnd }), false);
    var endShown = E.displayEnd(o);
    if (o.source === "demo" && o.end - o.start < E.DAY_MS) return "Today only";
    var sameDay = E.colomboDayIndex(o.start) === E.colomboDayIndex(endShown);
    var s = E.fmtDate(o.start, false), e = E.fmtDate(endShown, false);
    var t = o.allDay ? "" : " · " + E.fmtTime(o.start);
    return sameDay ? s + t : s + " – " + e + t;
  }

  function cardHTML(v) {
    var o = v.o, img = categoryImage(o.category);
    var flag = v.status === "ended" ? "Ended" : v.b === "today" ? (/ending/.test(v.status) ? "Ending soon" : (/just/.test(v.status) ? "Just started" : "Live")) : v.b === "latertoday" ? "Later today" : "";
    return '<article class="card ' + v.status.split(" ").map(function (x) { return "is-" + x; }).join(" ") + '" data-id="' + esc(o.id) + '">' +
      '<button class="card__hit" data-open="' + esc(o.id) + '" aria-label="View offer: ' + esc(o.merchant) + '"></button>' +
      '<div class="card__media"' + (img ? ' style="--img:url(\'' + img + '\')"' : "") + ">" +
        '<span class="chip chip--cat">' + esc(o.category) + "</span>" +
        (flag ? '<span class="flag"><i></i>' + flag + "</span>" : "") +
      "</div>" +
      '<div class="card__body">' +
        '<div class="card__top">' + logoHTML(o) +
          '<div class="card__id"><h3 class="card__merchant"><a href="' + esc(offerHref(o)) + '" tabindex="-1">' + esc(o.merchant) + "</a></h3>" +
          (o.location ? '<p class="card__loc">' + ICON.pin + esc(o.location) + "</p>" : "") + "</div>" +
        "</div>" +
        offerValueHTML(o) +
        cdHTML(v) +
        '<p class="card__when">' + ICON.cal + "<span>" + esc(whenLine(o)) + "</span></p>" +
        '<div class="card__actions">' +
          '<a class="btn btn--primary" href="' + esc(offerHref(o)) + '" data-open="' + esc(o.id) + '">View offer</a>' +
          (o.mapsUrl ? '<a class="btn btn--ghost" href="' + esc(o.mapsUrl) + '" target="_blank" rel="noopener" data-track="get_directions" data-id="' + esc(o.id) + '" aria-label="Directions to ' + esc(o.merchant) + ' on Google Maps">' + ICON.pin + "Map</a>"
            : o.url ? '<a class="btn btn--ghost" href="' + esc(webUrl(o.url)) + '" target="_blank" rel="noopener" data-track="visit_merchant_website" data-id="' + esc(o.id) + '" aria-label="' + esc(o.merchant) + ' website">' + ICON.globe + "Website</a>" : "") +
          calBtnHTML(o) + shareBtnHTML(o) +
        "</div>" +
      "</div></article>";
  }

  function rowHTML(v) {
    var o = v.o;
    return '<article class="row" data-id="' + esc(o.id) + '">' +
      '<button class="card__hit" data-open="' + esc(o.id) + '" aria-label="View offer: ' + esc(o.merchant) + '"></button>' +
      logoHTML(o, "logo--sm") +
      '<div class="row__id"><h3 class="row__merchant"><a href="' + esc(offerHref(o)) + '" tabindex="-1">' + esc(o.merchant) + "</a></h3>" + '<p class="row__meta"><span class="chip chip--soft">' + esc(o.category) + "</span>" +
        "<span>" + esc(whenLine(o)) + "</span></p></div>" +
      '<div class="row__val">' + offerValueHTML(o) + "</div>" +
      cdHTML(v, "row") +
      '<div class="row__acts">' +
        (o.mapsUrl ? '<a class="btn btn--ghost btn--sm" href="' + esc(o.mapsUrl) + '" target="_blank" rel="noopener" data-track="get_directions" data-id="' + esc(o.id) + '" aria-label="Directions to ' + esc(o.merchant) + ' on Google Maps">' + ICON.pin + "<span>Map</span></a>"
          : o.url ? '<a class="btn btn--ghost btn--sm" href="' + esc(webUrl(o.url)) + '" target="_blank" rel="noopener" data-track="visit_merchant_website" data-id="' + esc(o.id) + '" aria-label="' + esc(o.merchant) + ' website">' + ICON.globe + "<span>Website</span></a>" : "") +
        calBtnHTML(o, true) + shareBtnHTML(o, true) +
      "</div>" +
    "</article>";
  }

  function webUrl(u) { return /^https?:/.test(u) ? u : "https://" + u; }
  function offerHref(o) { var r = merchantPath(o.merchant); return r ? pageUrl(r) : "#offer=" + encodeURIComponent(o.series || o.id); }
  function calBtnHTML(o, small) {
    return '<button class="btn btn--ghost btn--icon' + (small ? " btn--sm" : "") + '" data-cal-open="' + esc(o.id) + '" aria-label="Add to calendar: ' + esc(o.merchant) + '" title="Add to calendar">' + ICON.calplus + "</button>";
  }
  function shareBtnHTML(o, small) {
    return '<button class="btn btn--ghost btn--icon' + (small ? " btn--sm" : "") + '" data-share-open="' + esc(o.id) + '" aria-label="Share offer: ' + esc(o.merchant) + '" title="Share">' + ICON.share + "</button>";
  }

  function emptyHTML(sec, filtered, nextUp) {
    if (sec.key === "today") {
      if (filtered) return '<div class="empty"><p class="empty__title">Nothing live that matches</p><p>Try another category or clear your filters.</p><button class="btn btn--ghost" data-clear>Clear filters</button></div>';
      return '<div class="empty empty--today"><div><p class="empty__title">Nothing live right now</p><p>' +
        (nextUp ? (nextUp.o.start - nowFor(nextUp.o) < E.DAY_MS ? "The next offer unlocks soon. Don't miss it." : "Here's the next offer to unlock.") : "New offers are added all the time. Check back soon.") + "</p></div>" +
        (nextUp ? '<button class="empty__next" data-open="' + esc(nextUp.o.id) + '">' + logoHTML(nextUp.o, "logo--sm") +
          '<span class="empty__nextid"><b>' + esc(nextUp.o.merchant) + "</b><small>" + esc(nextUp.o.category) + "</small></span>" + cdHTML(nextUp, "row") + "</button>" : "") +
        "</div>";
    }
    return '<div class="empty empty--slim"><p>' + (filtered ? "No matching offers here." : "Nothing scheduled yet. New offers drop all the time.") + "</p></div>";
  }

  function render(views) {
    var filtered = filtersActive();
    var shown = views.filter(matches);
    var host = $("#sections"), html = "";
    var upcomingAll = views.filter(function (v) { return v.b !== "today"; }).sort(function (a, b) { return a.o.start - b.o.start; });
    var total = 0;

    var anyShown = shown.length > 0;
    SECTIONS.forEach(function (sec) {
      if (filtered && !anyShown) return;
      var items = shown.filter(function (v) { return sec.buckets.indexOf(v.b) >= 0; }).sort(sortFor(sec.key));
      total += items.length;
      if (filtered && !items.length && sec.key !== "today") return;
      if (filtered && state.filters.when && state.filters.when !== sec.key) return;
      var isRow = sec.key === "comingup";
      var limit = isRow && !state.showAllComingUp ? (+S.COMING_UP_PREVIEW || 12) : Infinity;
      var liveCount = items.filter(function (v) { return v.b === "today" && v.status !== "ended"; }).length;
      html += '<section class="sec sec--' + sec.key + '" id="' + sec.key + '" aria-labelledby="h-' + sec.key + '">' +
        '<div class="sec__head"><div>' +
          '<p class="sec__eyebrow">' + (sec.key === "today" ? '<span class="pulse"></span>' + (liveCount ? liveCount + " live now" : "Live") : "") +
          '<span class="sec__date">' + esc(sectionDates(sec.key)) + "</span></p>" +
          '<h2 class="sec__title" id="h-' + sec.key + '">' + sec.title + '<span class="sec__count">' + items.length + "</span></h2>" +
          '<p class="sec__line">' + sec.line + "</p>" +
        "</div></div>";
      if (!items.length) html += emptyHTML(sec, filtered, sec.key === "today" ? upcomingAll[0] : null);
      else if (isRow) {
        html += '<div class="rows">' + items.slice(0, limit).map(rowHTML).join("") + "</div>";
        if (items.length > limit) html += '<button class="btn btn--more" data-more>Show all ' + items.length + " upcoming offers</button>";
      } else html += '<div class="grid' + (sec.key === "today" ? " grid--today" : "") + '">' + items.map(cardHTML).join("") + "</div>";
      html += "</section>";
    });
    if (filtered && total === 0) {
      html = '<div class="empty empty--big"><p class="empty__title">No offers found</p><p>We couldn\'t find anything for your search. Try a merchant name, a category like "Dining", or a place like "Colombo".</p><button class="btn btn--primary" data-clear>Clear search &amp; filters</button></div>' + html;
    }
    html = categoriesHTML(views, filtered) + html;     // categories always sit at the top
    host.innerHTML = html;
    renderSummary(total);
    var fd = $("#filterDone"); if (fd) fd.textContent = filtered ? "Show " + total + " offer" + (total === 1 ? "" : "s") : "Show offers";
    renderTabs(views.filter(matches));
    collectCountdowns();
    updateCountdowns();
  }

  function categoriesHTML(views, compact) {
    var cats = [], info = {};
    views.forEach(function (v) {
      var c = v.o.category;
      if (!info[c]) { info[c] = { live: 0, up: 0 }; cats.push(c); }
      if (v.b === "today" && v.status !== "ended") info[c].live++; else info[c].up++;
    });
    if (!cats.length) return "";
    return '<section class="cats ' + (compact ? "cats--compact" : "cats--top") + '" id="browse" aria-labelledby="h-browse">' +
      (compact ? "" : '<div class="sec__head"><div><p class="sec__eyebrow"><span class="sec__date">' + cats.length + ' categories</span></p><h2 class="sec__title" id="h-browse">Browse by category</h2><p class="sec__line">Jump straight to what you love.</p></div></div>') +
      '<div class="cats__grid" role="list">' + cats.map(function (c) {
        var img = categoryImage(c), on = state.filters.category === c;
        return '<button role="listitem" class="cat' + (on ? " is-on" : "") + '" data-cat="' + esc(c) + '" aria-pressed="' + on + '"' + (img ? ' style="--img:url(\'' + img + '\')"' : "") + ">" +
          '<span class="cat__name">' + esc(c) + "</span>" +
          '<span class="cat__count">' + (info[c].live ? '<b><i></i>' + info[c].live + " live</b>" : "") + (info[c].up ? "<span>" + info[c].up + " upcoming</span>" : "") + "</span></button>";
      }).join("") + "</div></section>";
  }

  function renderSummary(total) {
    var f = state.filters, chips = [];
    var labelWhen = { today: "Today", tomorrow: "Tomorrow", next3: "Next 3 days", nextweek: "Next week", comingup: "Coming up" };
    if (f.q) chips.push(['q', '"' + f.q + '"']);
    if (f.when) chips.push(["when", labelWhen[f.when]]);
    if (f.category) chips.push(["category", f.category]);
    if (f.card) chips.push(["card", f.card === "credit" ? "Credit cards" : "Debit cards"]);
    if (f.location) chips.push(["location", f.location]);
    if (f.merchant) chips.push(["merchant", f.merchant]);
    var el = $("#summary");
    if (!chips.length) { el.hidden = true; el.innerHTML = ""; }
    else {
      el.hidden = false;
      el.innerHTML = '<p class="summary__count"><b>' + total + "</b> offer" + (total === 1 ? "" : "s") + "</p>" +
        chips.map(function (c) { return '<button class="fchip" data-unset="' + c[0] + '" aria-label="Remove filter ' + esc(c[1]) + '">' + esc(c[1]) + "<span aria-hidden=\"true\">×</span></button>"; }).join("") +
        '<button class="linkbtn" data-clear>Clear all</button>';
    }
    var n = ["when", "category", "card", "location", "merchant"].filter(function (k) { return f[k]; }).length;
    var badge = $("#filterBadge"); badge.textContent = n; badge.hidden = !n;
  }

  function renderTabs(views) {
    SECTIONS.forEach(function (sec) {
      var n = views.filter(function (v) { return sec.buckets.indexOf(v.b) >= 0 && v.status !== "ended"; }).length;
      var t = $('.tab[data-tab="' + sec.key + '"] .tab__n'); if (t) t.textContent = n;
    });
  }

  /* ------------------------------------------------------------------
     HERO
     ------------------------------------------------------------------ */
  function renderHero(views) {
    var live = views.filter(function (v) { return v.b === "today" && v.status !== "ended"; });
    var soon = views.filter(function (v) { return ["tomorrow", "next3", "nextweek", "latertoday"].indexOf(v.b) >= 0; });
    var later = views.filter(function (v) { return v.b === "comingup"; });
    $("#statLive").textContent = live.length;
    $("#statSoon").textContent = soon.length;
    $("#statLater").textContent = later.length;

    var pick = live.slice().sort(function (a, b) { return a.o.end - b.o.end; })[0];
    var mode = "end";
    if (!pick) { pick = views.filter(function (v) { return v.b !== "today"; }).sort(function (a, b) { return a.o.start - b.o.start; })[0]; mode = "start"; }
    var host = $("#feature");
    if (!pick) { host.innerHTML = '<p class="feature__none">New offers are on the way.</p>'; return; }
    var key = pick.o.id + "|" + mode + "|" + pick.status;
    if (host.getAttribute("data-key") === key) return;
    host.setAttribute("data-key", key);
    host.innerHTML =
      '<p class="feature__eyebrow">' + (mode === "end" ? '<span class="pulse pulse--brand"></span>Ending soonest' : "Next offer to unlock") + "</p>" +
      '<button class="feature__card" data-open="' + esc(pick.o.id) + '">' +
        '<span class="feature__top">' + logoHTML(pick.o) + '<span class="feature__id"><b>' + esc(pick.o.merchant) + "</b><small>" + esc(pick.o.category) + (pick.o.location ? " · " + esc(pick.o.location) : "") + "</small></span></span>" +
        offerValueHTML(pick.o, true) +
        cdHTML(pick, "hero") +
      "</button>";
    collectCountdowns();
  }

  /* ------------------------------------------------------------------
     COUNTDOWNS — updated every second
     ------------------------------------------------------------------ */
  var byId = {};
  // an offer by id; a weekly series id resolves to its next occurrence
  function findOffer(id) {
    var all = allOffers(), o = byId[id] || all.filter(function (x) { return x.id === id; })[0];
    if (o) return o;
    var occ = all.filter(function (x) { return x.series === id; }).sort(function (a, b) { return a.start - b.start; });
    var now = realNow();
    return occ.filter(function (x) { return x.end > now; })[0] || occ[occ.length - 1];
  }
  function collectCountdowns() {
    byId = {}; allOffers().forEach(function (o) { byId[o.id] = o; });
    state.cdEls = $$("[data-cd]").map(function (el) {
      return { el: el, o: byId[el.getAttribute("data-cd")], to: el.getAttribute("data-to"), b: $$("b", el), d: $(".cd__u--d", el) };
    }).filter(function (x) { return x.o; });
  }
  function updateCountdowns() {
    state.cdEls.forEach(function (c) {
      var now = nowFor(c.o), target = c.to === "end" ? c.o.end : c.o.start;
      var p = E.countdownParts(target - now);
      c.b[0].textContent = p.days;
      c.b[1].textContent = E.pad(p.hours);
      c.b[2].textContent = E.pad(p.minutes);
      c.b[3].textContent = E.pad(p.seconds);
      c.d.classList.toggle("is-hidden", p.days === 0);
      c.b[0].nextElementSibling.textContent = p.days === 1 ? "day" : "days";
      var label = (c.to === "end" ? "Ends in " : "Starts in ") + (p.days ? p.days + " days " : "") + p.hours + " hours " + p.minutes + " minutes";
      if (c.el.getAttribute("aria-label") !== label && p.seconds === 0 || !c.el.hasAttribute("aria-label")) c.el.setAttribute("aria-label", label);
    });
  }

  /* ------------------------------------------------------------------
     MAIN LOOP
     ------------------------------------------------------------------ */
  function tick() {
    if (DEMO_ON && !demo.paused && demoElapsed() >= demo.cycleMs + 1200) restartDemo();
    var views = compute();
    var sig = views.map(function (v) { return v.o.id + ":" + v.b + ":" + v.status; }).join(",") + "|" + JSON.stringify(state.filters) + "|" + state.showAllComingUp + "|" + E.colomboDayIndex(realNow());
    if (sig !== state.signature) { state.signature = sig; render(views); }
    renderHero(views);
    var sec = Math.floor(Date.now() / 1000);
    if (sec !== state.lastSecond || DEMO_ON) {
      state.lastSecond = sec;
      $("#clock").textContent = E.fmtClock(realNow());
      updateCountdowns();
      updateModalCountdown();
      if (DEMO_ON) updateDemoPanel();
    }
  }

  /* ------------------------------------------------------------------
     FILTER UI
     ------------------------------------------------------------------ */
  function buildFilterPanel() {
    var offers = allOffers().filter(function (o) { return E.classify(o, nowFor(o)) !== "expired"; });
    var uniq = function (arr) { return arr.filter(function (x, i) { return x && arr.indexOf(x) === i; }); };
    var cats = uniq(offers.map(function (o) { return o.category; }));
    var catCount = {}; offers.forEach(function (o) { catCount[o.category] = (catCount[o.category] || 0) + 1; });
    var locs = uniq(offers.map(function (o) { return o.location; })).sort(function (a, b) { return a === "Colombo" ? -1 : b === "Colombo" ? 1 : a.localeCompare(b); });
    var merch = uniq(offers.map(function (o) { return o.merchant; })).sort(function (a, b) { return a.localeCompare(b); });
    var f = state.filters;
    var seg = function (name, opts, cls) {
      return '<div class="seg ' + (cls || "") + '" role="radiogroup" aria-label="' + name + '">' + opts.map(function (o) {
        return '<button role="radio" aria-checked="' + (f[name] === o[0]) + '" class="seg__b' + (f[name] === o[0] ? " is-on" : "") + '" data-set="' + name + '" data-val="' + esc(o[0]) + '">' + esc(o[1]) + "</button>";
      }).join("") + "</div>";
    };
    var sel = function (name, label, opts) {
      return '<label class="fld"><span>' + label + '</span><select data-select="' + name + '"><option value="">All ' + label.toLowerCase() + "s</option>" +
        opts.map(function (o) { return '<option' + (f[name] === o ? " selected" : "") + ' value="' + esc(o) + '">' + esc(o) + "</option>"; }).join("") + "</select></label>";
    };
    var copt = function (val, label, n) {
      var on = f.category === val;
      return '<button role="radio" aria-checked="' + on + '" class="copt' + (on ? " is-on" : "") + '" data-set="category" data-val="' + esc(val) + '">' +
        '<span class="copt__n">' + esc(label) + '</span><span class="copt__c">' + n + "</span></button>";
    };
    $("#filterBody").innerHTML =
      '<div class="fcols"><div class="fcol">' +
        '<div class="fgroup"><p class="fgroup__t">My card</p>' + seg("card", [["", "All cards"], ["credit", "Credit"], ["debit", "Debit"]], "seg--fill") + "</div>" +
        '<div class="fgroup"><p class="fgroup__t">When</p>' + seg("when", [["", "Any time"], ["today", "Today"], ["tomorrow", "Tomorrow"], ["next3", "Next 3 days"], ["nextweek", "Next week"], ["comingup", "Coming up"]], "seg--chips") + "</div>" +
        '<div class="fgroup fgroup--row">' + sel("location", "Location", locs) + sel("merchant", "Merchant", merch) + "</div>" +
      '</div><div class="fcol">' +
        '<div class="fgroup"><p class="fgroup__t">Category</p><div class="cgrid" role="radiogroup" aria-label="Category">' +
          copt("", "All categories", offers.length) + cats.map(function (c) { return copt(c, c, catCount[c]); }).join("") +
        "</div></div>" +
      "</div></div>";
    var n = ["card", "when", "category", "location", "merchant"].filter(function (k) { return f[k]; }).length;
    var fc = $("#filterCount"); if (fc) fc.textContent = n ? "(" + n + ")" : "";
  }
  function setFilter(k, v, fromNav) {
    var was = state.filters[k];
    state.filters[k] = v;
    if (k === "category" && !fromNav && was !== v) {
      var rel = v ? catPath(v) : "";
      goTo(rel === null ? "" : rel, false);
      applyListMeta(v); trackList(v);
    }
    if (k !== "q" && k !== "category" && v && !fromNav) T.event("filter_offers", { filter_type: k, filter_value: v });
    if (k !== "q") buildFilterPanel();
    tick();
    try { sessionStorage.setItem("sampath-filters", JSON.stringify(state.filters)); } catch (e) {}
  }
  function clearFilters() {
    var hadCat = state.filters.category;
    state.filters = { q: "", category: "", when: "", card: "", location: "", merchant: "" };
    if (hadCat) { goTo("", false); applyListMeta(""); trackList(""); }
    $("#search").value = "";
    buildFilterPanel(); tick();
    try { sessionStorage.removeItem("sampath-filters"); } catch (e) {}
  }
  function openFilters(open) {
    var p = $("#filterPanel"), b = $("#filterBtn");
    if (open === undefined) open = p.hidden;
    if (open) buildFilterPanel();
    p.hidden = !open; b.setAttribute("aria-expanded", open);
    document.body.classList.toggle("sheet-open", open && window.matchMedia("(max-width: 760px)").matches);
    if (open) { var first = $("button, select", p); if (first) first.focus({ preventScroll: true }); }
  }
  function scrollToOffers() {
    var t = $("#offers"), bar = $(".bar");
    var y = t.getBoundingClientRect().top + window.scrollY - (bar ? bar.offsetHeight : 0) - 8;
    if (window.scrollY > y + 4 || window.scrollY < y - 4) window.scrollTo({ top: y, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  /* ------------------------------------------------------------------
     OFFER DETAIL (modal)
     ------------------------------------------------------------------ */
  var modalOffer = null;
  var baseTitle = "";
  var nav = { modalPushed: false, closingByNav: false };
  function openOffer(id, fromHash) {
    var o = findOffer(id);
    if (!o) return;
    modalOffer = o;
    var now = nowFor(o), b = E.classify(o, now), v = { o: o, b: b === "expired" ? "today" : b, status: b === "expired" ? "ended" : "" };
    var img = categoryImage(o.category), endShown = E.displayEnd(o);
    var validity = o.series
      ? "Every " + o.daysLabel + ", " + E.fmtDate(o.seriesStart, false) + " – " + E.fmtDate(E.displayEnd({ end: o.seriesEnd }), false, true) + " (next: " + E.fmtDate(o.start, true) + ")"
      : o.source === "demo" && o.end - o.start < E.DAY_MS
      ? "Today only"
      : (E.fmtDate(o.start, true, true) + ", " + E.fmtTime(o.start)).replace(/ /g, "\u00a0") + " → " + (E.fmtDate(endShown, true, true) + ", " + E.fmtTime(endShown)).replace(/ /g, "\u00a0");
    var rowsHTML = function (label, val, icon) { return val ? '<div class="dl__r"><dt>' + icon + label + "</dt><dd>" + val + "</dd></div>" : ""; };
    var cards = [];
    if (o.credit) cards.push('<div class="ctile"><span>Sampath Credit Cards</span><b>' + esc(fmtPct(o.credit)) + (o.credit.pct != null ? " off" : "") + "</b></div>");
    if (o.debit) cards.push('<div class="ctile"><span>Sampath Debit Cards</span><b>' + esc(fmtPct(o.debit)) + (o.debit.pct != null ? " off" : "") + "</b></div>");
    $("#modalBody").innerHTML =
      '<div class="m__media"' + (img ? ' style="--img:url(\'' + img + '\')"' : "") + '><span class="chip chip--cat">' + esc(o.category) + "</span></div>" +
      '<div class="m__inner">' +
        '<div class="m__top">' + logoHTML(o, "logo--lg") + '<div><h2 class="m__title" id="modalTitle">' + esc(o.merchant) + "</h2>" +
          (o.location ? '<p class="card__loc">' + ICON.pin + esc(o.location) + "</p>" : "") + "</div></div>" +
        (o.offerText ? '<p class="m__desc">' + esc(o.offerText) + "</p>" : "") +
        (o.terms && /promo code/i.test(o.terms) ? '<p class="m__promo">' + esc(o.terms) + "</p>" : "") +
        (cards.length ? '<div class="ctiles">' + cards.join("") + "</div>" : "") +
        cdHTML(v, "modal") +
        '<dl class="dl">' +
          rowsHTML("Valid", esc(validity), ICON.cal) +
          rowsHTML("Eligible cards", esc(o.cardType || [o.credit ? "Sampath Credit Cards" : "", o.debit ? "Sampath Debit Cards" : ""].filter(Boolean).join(" & ")), ICON.card) +
          rowsHTML("Address", o.address ? (o.mapsUrl ? '<a href="' + esc(o.mapsUrl) + '" target="_blank" rel="noopener" data-track="get_directions" data-id="' + esc(o.id) + '">' + esc(o.address) + "</a>" : esc(o.address)) : "", ICON.pin) +
          rowsHTML("Opening hours", esc(o.hours), ICON.clock) +
        "</dl>" +
        '<div class="m__terms"><p class="m__terms-t">Terms &amp; conditions</p><p>' + esc(o.terms && !/^promo code/i.test(o.terms) ? o.terms : (S.TERMS_NOTE || "Conditions apply.")) + "</p>" +
          (S.FOOTER ? "<p>" + esc(S.FOOTER.contactLabel) + ": <a href=\"tel:" + esc(String(S.FOOTER.contactNumber).replace(/\s/g, "")) + '">' + esc(S.FOOTER.contactNumber) + "</a></p>" : "") + "</div>" +
        '<div class="m__actions">' +
          (o.url ? '<a class="btn btn--primary" href="' + esc(webUrl(o.url)) + '" target="_blank" rel="noopener" data-track="visit_merchant_website" data-id="' + esc(o.id) + '">Visit website ' + ICON.ext + "</a>" : "") +
          (o.mapsUrl ? '<a class="btn ' + (o.url ? "btn--ghost" : "btn--primary") + '" href="' + esc(o.mapsUrl) + '" target="_blank" rel="noopener" data-track="get_directions" data-id="' + esc(o.id) + '">Get directions ' + ICON.ext + "</a>" : "") +
          '<button class="btn btn--ghost" data-cal-open="' + esc(o.id) + '">' + ICON.calplus + "Add to calendar</button>" +
          '<button class="btn btn--ghost" data-close>Back to offers</button>' +
        "</div>" +
        '<div class="m__share"><p class="m__terms-t">Share this offer</p>' + shareListHTML(o) + "</div>" +
      "</div>";
    var dlg = $("#modal");
    if (!dlg.open) { dlg.showModal ? dlg.showModal() : dlg.setAttribute("open", ""); }
    if (!baseTitle) baseTitle = document.title;
    document.title = offerTitle(o);
    document.body.classList.add("modal-open");
    var mp = merchantPath(o.merchant);
    if (!fromHash && o.source !== "demo") {
      if (mp && CAN_ROUTE) { if (goTo(mp, false, { modal: 1 })) nav.modalPushed = true; }
      else history.replaceState(history.state, "", "#offer=" + encodeURIComponent(o.series || o.id));
    }
    if (mp) { setMeta('link[rel="canonical"]', "href", pageUrl(mp)); setMeta('meta[property="og:url"]', "content", pageUrl(mp)); }
    setMeta('meta[name="description"]', "content", shareText(o).replace(/ Never miss an offer:$/, ""));
    if (o.source !== "demo") trackOffer(o);
    collectCountdowns(); updateCountdowns();
  }
  function updateModalCountdown() { /* modal countdown is part of cdEls */ }
  function closeModal() {
    var dlg = $("#modal");
    if (dlg.open) { if (dlg.close) dlg.close(); else { dlg.removeAttribute("open"); afterModalClosed(); } }
  }
  // runs once whenever the offer detail closes (button, Esc, backdrop or browser Back)
  function afterModalClosed() {
    document.body.classList.remove("modal-open");
    modalOffer = null;
    if (nav.closingByNav) { nav.closingByNav = false; return; }          // Back button already changed the address
    if (/^#offer=/.test(location.hash)) history.replaceState(history.state, "", location.pathname + location.search);
    if (nav.modalPushed) { nav.modalPushed = false; history.back(); return; }   // return to the list page they came from
    if (currentRoute().merchantSlug) {                                   // arrived straight on an offer page
      var cat = state.filters.category; goTo(cat ? (catPath(cat) || "") : "", true);
    }
    applyListMeta(state.filters.category); trackList(state.filters.category);
  }
  // Back / Forward buttons
  function onRouteChange() {
    var r = currentRoute(), dlg = $("#modal");
    if (r.merchantSlug) {
      var o = merchantOffer(r.merchantSlug);
      if (o) { nav.modalPushed = !!(history.state && history.state.modal); openOffer(o.id, true); return; }
      r = {};
    }
    if (dlg.open) { nav.closingByNav = true; closeModal(); }
    nav.modalPushed = false;
    var cat = r.category || "";
    if (state.filters.category !== cat) setFilter("category", cat, true);
    applyListMeta(cat); trackList(cat);
  }

  /* ------------------------------------------------------------------
     SHARING — WhatsApp, Messenger, Instagram, copy link
     WhatsApp opens with the message pre-filled. Facebook and Instagram
     don't allow websites to pre-fill a DM, so on phones we open the
     phone's share sheet (where Messenger / Instagram appear), and on
     computers we copy the link and open the inbox to paste it.
     ------------------------------------------------------------------ */
  var IS_MOBILE = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));
  function shareUrl(o) {
    var mp = merchantPath(o.merchant);
    if (mp && /^https?:/.test(location.protocol)) return pageUrl(mp);
    var base = /^https?:/.test(location.protocol) ? location.origin + location.pathname : location.href.split("#")[0];
    return base + "#offer=" + encodeURIComponent(o.series || o.id);
  }
  function shareText(o) {
    var deal = dealText(o);
    var when = o.series ? "every " + o.daysLabel + " until " + E.fmtDate(E.displayEnd({ end: o.seriesEnd }))
      : o.source === "demo" && o.end - o.start < E.DAY_MS ? "today only" : E.fmtDate(o.start) + " – " + E.fmtDate(E.displayEnd(o));
    return deal + " at " + o.merchant + " with Sampath Bank cards (" + when + "). Never miss an offer:";
  }
  function dealText(o) {
    var c = o.credit && o.credit.pct, d = o.debit && o.debit.pct, up = (o.credit && o.credit.upto) || (o.debit && o.debit.upto);
    if (c != null && d != null) return (c === d && !up ? c + "% off" : "Up to " + Math.max(c, d) + "% off");
    if (c != null || d != null) return (up ? "Up to " : "") + (c != null ? c : d) + "% off";
    return o.offerText || "A Sampath card offer";
  }
  function shareListHTML(o) {
    var id = esc(o.id);
    var b = function (kind, icon, label) { return '<button class="sh" data-share="' + kind + '" data-id="' + id + '">' + '<span class="sh__i">' + icon + "</span><span>" + label + "</span></button>"; };
    return '<div class="shares">' +
      b("whatsapp", ICON.whatsapp, "WhatsApp") +
      b("messenger", ICON.messenger, "Messenger") +
      b("instagram", ICON.instagram, "Instagram") +
      b("copy", ICON.link, "Copy link") +
      (navigator.share ? b("native", ICON.share, "More") : "") +
    "</div>";
  }
  function copyText(t) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(t).catch(function () { legacyCopy(t); });
    legacyCopy(t); return Promise.resolve();
  }
  function legacyCopy(t) {
    var ta = document.createElement("textarea"); ta.value = t; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    (topDialog() || document.body).appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) {} ta.remove();
  }
  function doShare(kind, o) {
    T.event("share", evParams(o, { method: kind, content_type: "offer" }));
    var url = shareUrl(o), text = shareText(o), full = text + " " + url;
    if (kind === "whatsapp") {
      window.open("https://wa.me/?text=" + encodeURIComponent(full), "_blank", "noopener");
    } else if (kind === "messenger") {
      if (IS_MOBILE) {
        copyText(full);
        location.href = "fb-messenger://share/?link=" + encodeURIComponent(url);
        setTimeout(function () { if (!document.hidden) { if (navigator.share) navigator.share({ title: "Sampath card offer", text: text, url: url }).catch(function () {}); else msgToast("Link copied. Paste it into a Messenger chat."); } }, 1500);
      } else {
        copyText(full);
        window.open("https://www.facebook.com/messages/", "_blank", "noopener");
        msgToast("Link copied. Paste it into a Messenger chat.");
      }
    } else if (kind === "instagram") {
      if (IS_MOBILE && navigator.share) {
        navigator.share({ title: "Sampath card offer", text: text, url: url }).catch(function () {});
      } else {
        copyText(full);
        window.open("https://www.instagram.com/direct/inbox/", "_blank", "noopener");
        msgToast("Link copied. Paste it into an Instagram message.");
      }
    } else if (kind === "native" && navigator.share) {
      navigator.share({ title: "Sampath card offer", text: text, url: url }).catch(function () {});
    } else {
      copyText(full).then(function () { msgToast("Offer link copied."); });
    }
  }
  function openShare(id) {
    var o = findOffer(id);
    if (!o) return;
    $("#shareWhat").innerHTML = logoHTML(o, "logo--sm") + "<span><b>" + esc(o.merchant) + "</b><small>" + esc(shareText(o).replace(/ Never miss an offer:$/, "")) + "</small></span>";
    $("#shareBtns").innerHTML = shareListHTML(o);
    var dlg = $("#shareDlg");
    if (!dlg.open) dlg.showModal ? dlg.showModal() : dlg.setAttribute("open", "");
  }
  /* ------------------------------------------------------------------
     ADD TO CALENDAR — Google Calendar link, or an .ics file that Apple
     Calendar and Outlook open. All-day event(s) for the offer dates, with
     a reminder the day before and on the morning. Weekly offers repeat.
     ------------------------------------------------------------------ */
  function ymd(epoch) { var p = E.colomboParts(epoch); return p.y + E.pad(p.m) + E.pad(p.d); }
  function calEvent(o) {
    // short offers: one all-day event across the dates. Long offers (over a week) would sit
    // across the calendar for weeks, so they become one day: the start day if it hasn't
    // started yet, otherwise the last day. Weekly offers repeat on their day(s).
    var weekly = !!o.series, startEp = o.start, lastDay = E.displayEnd(o), prefix = "";
    var spanDays = Math.round((E.colomboMidnight(lastDay) - E.colomboMidnight(o.start)) / E.DAY_MS) + 1;
    if (!weekly && spanDays > 7) {
      if (o.start > realNow()) { lastDay = o.start; prefix = "Starts today: "; }
      else { startEp = lastDay; prefix = "Last day: "; }
    }
    var cards = [o.credit ? "Credit " + fmtPct(o.credit) : "", o.debit ? "Debit " + fmtPct(o.debit) : ""].filter(Boolean).join(", ");
    var lines = [dealText(o) + " at " + o.merchant + " with Sampath Bank cards" + (cards ? " (" + cards + ")" : "") + "."];
    if (o.offerText && (o.credit || o.debit)) lines.push(o.offerText);
    if (weekly) lines.push("Every " + o.daysLabel + " until " + E.fmtDate(E.displayEnd({ end: o.seriesEnd }), false, true) + ".");
    else lines.push("Valid " + E.fmtDate(o.start, true, true) + " – " + E.fmtDate(E.displayEnd(o), true, true) + ".");
    if (o.terms) lines.push(o.terms);
    if (o.url) lines.push("Shop online: " + webUrl(o.url));
    if (o.mapsUrl) lines.push("Directions: " + o.mapsUrl);
    lines.push("Offer details: " + shareUrl(o));
    lines.push("Conditions apply.");
    var byDay = (o.days || []).map(function (d) { return ["SU", "MO", "TU", "WE", "TH", "FR", "SA"][d]; }).join(",");
    return {
      title: prefix + dealText(o) + " at " + o.merchant + " (Sampath card offer)",
      start: ymd(startEp), endExcl: ymd(E.colomboMidnight(lastDay) + E.DAY_MS),
      rrule: weekly ? "FREQ=WEEKLY;BYDAY=" + byDay + ";UNTIL=" + ymd(E.displayEnd({ end: o.seriesEnd })) : "",
      details: lines.join("\n"), location: o.location && o.location !== "Online" ? o.merchant + ", " + o.location + ", Sri Lanka" : (o.url ? webUrl(o.url) : o.merchant + ", Sri Lanka"),
      uid: o.id + "@sampath-offers", oneDay: prefix ? E.fmtDate(prefix === "Last day: " ? startEp : lastDay, true) : "", isStart: prefix === "Starts today: ",
    };
  }
  function googleCalUrl(ev) {
    return "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(ev.title) +
      "&dates=" + ev.start + "/" + ev.endExcl + "&details=" + encodeURIComponent(ev.details) + "&location=" + encodeURIComponent(ev.location) +
      (ev.rrule ? "&recur=" + encodeURIComponent("RRULE:" + ev.rrule) : "") + "&ctz=Asia/Colombo";
  }
  function icsText(ev) {
    var esc2 = function (t) { return String(t).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n"); };
    var fold = function (l) { var out = [], s = l; while (s.length > 74) { out.push(s.slice(0, 74)); s = " " + s.slice(74); } out.push(s); return out.join("\r\n"); };
    var now = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
    return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Sampath Card Offers//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
      "BEGIN:VEVENT", "UID:" + ev.uid, "DTSTAMP:" + now,
      "DTSTART;VALUE=DATE:" + ev.start, "DTEND;VALUE=DATE:" + ev.endExcl].concat(ev.rrule ? ["RRULE:" + ev.rrule] : []).concat([
      "SUMMARY:" + esc2(ev.title), "DESCRIPTION:" + esc2(ev.details), "LOCATION:" + esc2(ev.location), "TRANSP:TRANSPARENT",
      "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + esc2("Tomorrow: " + ev.title), "TRIGGER:-PT15H", "END:VALARM",
      "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + esc2("Today: " + ev.title), "TRIGGER:PT9H", "END:VALARM",
      "END:VEVENT", "END:VCALENDAR"]).map(fold).join("\r\n") + "\r\n";
  }
  function downloadIcs(o) {
    var ics = icsText(calEvent(o)), name = E.slug(o.merchant) + "-sampath-offer.ics";
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent))) {
      location.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(ics); return;   // iOS opens it straight in Calendar
    }
    var url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    var a = document.createElement("a"); a.href = url; a.download = name; (topDialog() || document.body).appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    msgToast("Calendar file downloaded. Open it to add the offer.");
  }
  function openCal(id) {
    var o = findOffer(id);
    if (!o) return;
    var when = o.series ? "Every " + o.daysLabel + " until " + E.fmtDate(E.displayEnd({ end: o.seriesEnd })) : whenLine(o), ev = calEvent(o);
    $("#calWhat").innerHTML = logoHTML(o, "logo--sm") + "<span><b>" + esc(o.merchant) + "</b><small>" + esc(dealText(o)) + " · " + esc(when) + "</small></span>";
    var b = function (kind, icon, label, sub) { return '<button class="sh sh--cal" data-cal="' + kind + '" data-id="' + esc(o.id) + '"><span class="sh__i">' + icon + "</span><span>" + label + (sub ? "<small>" + sub + "</small>" : "") + "</span></button>"; };
    $("#calBtns").innerHTML = '<div class="shares shares--cal">' + b("google", ICON.google, "Google Calendar") + b("apple", ICON.apple, "Apple Calendar") + b("outlook", ICON.outlook, "Outlook") + "</div>" +
      '<p class="sharedlg__note">' + ICON.clock + "<span>" + (ev.oneDay ? "Added on " + (ev.isStart ? "the day it starts" : "its last day") + " (" + ev.oneDay + "), with" : "Includes") + " a reminder the day before and on the morning.</span></p>";
    var dlg = $("#calDlg");
    if (!dlg.open) dlg.showModal ? dlg.showModal() : dlg.setAttribute("open", "");
  }
  function doCal(kind, o) {
    T.event("add_to_calendar", evParams(o, { method: kind }));
    if (kind === "google") window.open(googleCalUrl(calEvent(o)), "_blank", "noopener");
    else downloadIcs(o);
  }
  function closeCal() { var d = $("#calDlg"); if (d && d.open) d.close ? d.close() : d.removeAttribute("open"); }
  function closeShare() { var d = $("#shareDlg"); if (d.open) d.close ? d.close() : d.removeAttribute("open"); }
  function topDialog() {
    var s = $("#shareDlg"), c = $("#calDlg"), m = $("#modal");
    return (s && s.open) ? s : (c && c.open) ? c : (m && m.open) ? m : null;
  }
  function msgToast(html) {
    // toasts must live inside an open dialog to be visible above it
    var parent = topDialog() || document.body, host = $(".toasts", parent);
    if (!host) { host = document.createElement("div"); host.className = "toasts"; host.setAttribute("aria-live", "polite"); parent.appendChild(host); }
    var t = document.createElement("div"); t.className = "toast";
    t.innerHTML = '<span class="toast__i">' + ICON.link + "</span><span>" + html + "</span>";
    host.appendChild(t);
    setTimeout(function () { t.classList.add("is-out"); }, 3200);
    setTimeout(function () { t.remove(); }, 3800);
  }

  /* ------------------------------------------------------------------
     TOASTS (an offer just went live)
     ------------------------------------------------------------------ */
  function toast(o) {
    var host = $("#toasts"); if (!host) return;
    var t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = '<span class="toast__i">' + ICON.bolt + "</span><span><b>Now live:</b> " + esc(o.merchant) + "</span>";
    host.appendChild(t);
    setTimeout(function () { t.classList.add("is-out"); }, 3600);
    setTimeout(function () { t.remove(); }, 4200);
  }

  /* ------------------------------------------------------------------
     DEMO CONTROLS
     ------------------------------------------------------------------ */
  function initDemoControls() {
    if (!DEMO_ON || D.showControls === false) return;
    var wrap = $("#demo"); wrap.hidden = false;
    $("#demoToggle").addEventListener("click", function () {
      var p = $("#demoPanel"), open = p.hidden; p.hidden = !open; this.setAttribute("aria-expanded", open);
    });
    $("#demoPause").addEventListener("click", function () {
      if (demo.paused) { demo.paused = false; demo.anchorReal = Date.now(); }
      else { demo.elapsedAtAnchor = demoElapsed(); demo.paused = true; }
      this.textContent = demo.paused ? "Resume" : "Pause";
      state.signature = ""; tick();
    });
    $("#demoRestart").addEventListener("click", function () { restartDemo(); demo.paused = false; $("#demoPause").textContent = "Pause"; tick(); });
    $$("[data-speed]").forEach(function (b) {
      b.addEventListener("click", function () {
        reanchor(); demo.speed = +b.getAttribute("data-speed");
        $$("[data-speed]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
      });
    });
    document.addEventListener("keydown", function (e) {
      if ((e.key === "d" || e.key === "D") && !/input|select|textarea/i.test(e.target.tagName) && !e.metaKey && !e.ctrlKey) wrap.classList.toggle("is-invisible");
    });
  }
  function updateDemoPanel() {
    var el = Math.min(demoElapsed(), demo.cycleMs), p = el / demo.cycleMs;
    var bar = $("#demoBar"); if (bar) bar.style.transform = "scaleX(" + p + ")";
    var t = $("#demoTime"); if (t) {
      var s = Math.floor(el / 1000), c = Math.floor(demo.cycleMs / 1000);
      t.textContent = E.pad(Math.floor(s / 60)) + ":" + E.pad(s % 60) + " / " + E.pad(Math.floor(c / 60)) + ":" + E.pad(c % 60);
    }
  }

  /* ------------------------------------------------------------------
     EXCEL PREVIEW BY DRAG & DROP (handy for checking a new Excel
     before uploading it; nothing is saved)
     ------------------------------------------------------------------ */
  function initDrop() {
    var over = $("#dropOverlay");
    window.addEventListener("dragover", function (e) {
      if (e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types || [], "Files") >= 0) { e.preventDefault(); over.hidden = false; }
    });
    over.addEventListener("dragleave", function () { over.hidden = true; });
    window.addEventListener("drop", function (e) {
      e.preventDefault(); over.hidden = true;
      var f = e.dataTransfer.files && e.dataTransfer.files[0];
      if (f && /\.xlsx?$/i.test(f.name)) readFile(f);
    });
    var input = $("#excelInput");
    if (input) input.addEventListener("change", function () { if (this.files[0]) readFile(this.files[0]); });
  }
  function readFile(f) {
    var r = new FileReader();
    r.onload = function () {
      try {
        ingestWorkbook(new Uint8Array(r.result));
        state.previewFile = f.name; state.loadState = "ready";
        renderNotice(); buildFilterPanel(); tick();
        var t = $("#toasts"); if (t) { var el = document.createElement("div"); el.className = "toast"; el.innerHTML = "<span>Previewing <b>" + esc(f.name) + "</b> — " + state.realOffers.length + " offers (not saved)</span>"; t.appendChild(el); setTimeout(function () { el.remove(); }, 5000); }
      } catch (err) { alertBox("That file couldn't be read as an Excel workbook."); }
    };
    r.readAsArrayBuffer(f);
  }
  function alertBox(msg) { var n = $("#notice"); n.hidden = false; n.innerHTML = "<p>" + esc(msg) + "</p>"; }
  function renderNotice() {
    var n = $("#notice");
    if (state.loadState === "error") {
      n.hidden = false;
      n.innerHTML = '<p class="notice__t">The offers file couldn\'t be loaded.</p>' +
        "<p>If you opened this page by double-clicking it on your computer, browsers block it from reading the Excel file. " +
        "Upload the folder to your web host (see README), or preview now by choosing the Excel file:</p>" +
        '<label class="btn btn--primary">Choose offers Excel<input id="excelInput" type="file" accept=".xlsx,.xls" hidden></label>';
      $("#excelInput").addEventListener("change", function () { if (this.files[0]) readFile(this.files[0]); });
    } else n.hidden = true;
  }

  /* ------------------------------------------------------------------
     EVENTS
     ------------------------------------------------------------------ */
  function initEvents() {
    document.addEventListener("click", function (e) {
      var tr = e.target.closest("[data-track]");
      if (tr) { var to = findOffer(tr.getAttribute("data-id")); if (to) T.event(tr.getAttribute("data-track"), evParams(to, { link_url: tr.href })); }
      var cl = e.target.closest("[data-cal],[data-cal-open],[data-cal-close]");
      if (cl) {
        e.preventDefault();
        if (cl.hasAttribute("data-cal-open")) openCal(cl.getAttribute("data-cal-open"));
        else if (cl.hasAttribute("data-cal-close")) closeCal();
        else { var co = findOffer(cl.getAttribute("data-id")); if (co) doCal(cl.getAttribute("data-cal"), co); }
        return;
      }
      var sh = e.target.closest("[data-share],[data-share-open],[data-share-close]");
      if (sh) {
        e.preventDefault();
        if (sh.hasAttribute("data-share-open")) openShare(sh.getAttribute("data-share-open"));
        else if (sh.hasAttribute("data-share-close")) closeShare();
        else { var so = findOffer(sh.getAttribute("data-id")); if (so) doShare(sh.getAttribute("data-share"), so); }
        return;
      }
      var t = e.target.closest("[data-open],[data-cat],[data-set],[data-unset],[data-clear],[data-more],[data-close],[data-tab-link]");
      if (!t) return;
      if (t.hasAttribute("data-open")) { e.preventDefault(); openOffer(t.getAttribute("data-open")); }
      else if (t.hasAttribute("data-cat")) { e.preventDefault(); var c = t.getAttribute("data-cat"); setFilter("category", state.filters.category === c && !t.hasAttribute("href") ? "" : c); scrollToOffers(); }
      else if (t.hasAttribute("data-set")) setFilter(t.getAttribute("data-set"), t.getAttribute("data-val"));
      else if (t.hasAttribute("data-unset")) { var k = t.getAttribute("data-unset"); if (k === "q") $("#search").value = ""; setFilter(k, ""); }
      else if (t.hasAttribute("data-clear")) clearFilters();
      else if (t.hasAttribute("data-more")) { state.showAllComingUp = true; tick(); }
      else if (t.hasAttribute("data-close")) closeModal();
    });
    var sTimer, qTimer, lastQ = "";
    $("#search").addEventListener("input", function () {
      var v = this.value; clearTimeout(sTimer);
      sTimer = setTimeout(function () { setFilter("q", v.trim()); }, 80);
      clearTimeout(qTimer);
      qTimer = setTimeout(function () { var q = v.trim(); if (q.length > 1 && q !== lastQ) { lastQ = q; T.event("search", { search_term: q }); } }, 1500);
    });
    $("#searchForm").addEventListener("submit", function (e) { e.preventDefault(); $("#search").blur(); scrollToOffers(); });
    $("#filterBtn").addEventListener("click", function () { openFilters(); });
    $("#filterDone").addEventListener("click", function () { openFilters(false); scrollToOffers(); });
    $("#filterScrim").addEventListener("click", function () { openFilters(false); });
    $("#filterClose").addEventListener("click", function () { openFilters(false); });
    document.addEventListener("pointerdown", function (e) {
      if (!$("#filterPanel").hidden && !e.target.closest(".bar")) openFilters(false);
    });
    document.addEventListener("change", function (e) { var s = e.target.getAttribute && e.target.getAttribute("data-select"); if (s) setFilter(s, e.target.value); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !$("#filterPanel").hidden) openFilters(false);
      if (e.key === "/" && document.activeElement.tagName !== "INPUT") { e.preventDefault(); $("#search").focus(); }
    });
    var dlg = $("#modal");
    dlg.addEventListener("close", function () { if (baseTitle) document.title = baseTitle; afterModalClosed(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) closeModal(); });
    var sdlg = $("#shareDlg");
    sdlg.addEventListener("click", function (e) { if (e.target === sdlg) closeShare(); });
    var cdlg = $("#calDlg");
    cdlg.addEventListener("click", function (e) { if (e.target === cdlg) closeCal(); });
    // a shared link opened while the page is already open
    window.addEventListener("hashchange", function () { var m = location.hash.match(/^#offer=(.+)$/); if (m) openOffer(decodeURIComponent(m[1]), true); });
    window.addEventListener("popstate", onRouteChange);

    // highlight the tab for the section in view
    var tabs = $$(".tab");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) tabs.forEach(function (t) { t.classList.toggle("is-on", t.getAttribute("data-tab") === en.target.id); });
        });
      }, { rootMargin: "-40% 0px -55% 0px" });
      var observe = function () { io.disconnect(); SECTIONS.forEach(function (s) { var el = document.getElementById(s.key); if (el) io.observe(el); }); };
      new MutationObserver(observe).observe($("#sections"), { childList: true });
    }
    tabs.forEach(function (t) {
      t.addEventListener("click", function (e) {
        var id = t.getAttribute("data-tab"), el = document.getElementById(id);
        if (!el) { e.preventDefault(); if (state.filters.when) setFilter("when", ""); el = document.getElementById(id); }
        if (el) { e.preventDefault(); var y = el.getBoundingClientRect().top + window.scrollY - $(".bar").offsetHeight - 8; window.scrollTo({ top: y, behavior: "smooth" }); }
      });
    });
    // sticky bar shadow
    var bar = $(".bar");
    window.addEventListener("scroll", function () { bar.classList.toggle("is-stuck", bar.getBoundingClientRect().top <= 0.5); }, { passive: true });
  }

  function initFooter() {
    var F = S.FOOTER || {};
    $("#fContact").textContent = (F.contactLabel || "") + ": " + (F.contactNumber || "");
    var w = $("#fWeb"); w.textContent = F.website || ""; w.href = F.websiteUrl || "#";
    $("#fFitch").textContent = F.fitchLine || "";
    var soc = F.social || {}, names = { facebook: "Facebook", twitter: "X (Twitter)", linkedin: "LinkedIn", instagram: "Instagram", youtube: "YouTube" };
    var icons = {
      facebook: '<path d="M14 8h3V4h-3c-2.8 0-4 1.7-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6z"/>',
      twitter: '<path d="M4 4l7 9-7 7h2l6-6 4.5 6H20l-7.3-9.6L19 4h-2l-5.2 5.2L8 4z"/>',
      linkedin: '<path d="M5 9h3v11H5zM6.5 4a1.8 1.8 0 1 1 0 3.6A1.8 1.8 0 0 1 6.5 4zM10 9h3v1.6c.5-.9 1.7-1.8 3.4-1.8 3.2 0 3.6 2 3.6 4.7V20h-3v-5.6c0-1.3 0-3-1.8-3s-2.2 1.4-2.2 2.9V20h-3z"/>',
      instagram: '<path d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3zm4 3.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM17.2 5.8a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>',
      youtube: '<path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8zM10 15V9l5.2 3z"/>',
    };
    $("#fSocial").innerHTML = Object.keys(names).filter(function (k) { return soc[k]; }).map(function (k) {
      return '<a href="' + esc(soc[k]) + '" target="_blank" rel="noopener" aria-label="Sampath Bank on ' + names[k] + '"><svg viewBox="0 0 24 24">' + icons[k] + "</svg></a>";
    }).join("");
  }

  /* ------------------------------------------------------------------
     START
     ------------------------------------------------------------------ */
  function start() {
    document.documentElement.classList.toggle("is-demo", DEMO_ON);
    if (previewLabel) {
      var pb = document.createElement("div"); pb.className = "previewbar";
      pb.innerHTML = "Preview mode: showing offers as they will appear on <b>" + esc(previewLabel) + "</b> (Sri Lanka time). <a href=\"" + location.pathname + "\">Exit preview</a>";
      document.body.insertBefore(pb, document.body.firstChild);
    }
    try { var saved = JSON.parse(sessionStorage.getItem("sampath-filters") || "null"); if (saved) { state.filters = Object.assign(state.filters, saved); $("#search").value = saved.q || ""; } } catch (e) {}
    var route = currentRoute();
    state.filters.category = route.category || "";        // the address decides the category
    if (!route.merchantSlug) applyListMeta(state.filters.category);
    if (DEMO_ON) buildDemoOffers();
    initFooter(); initEvents(); initDemoControls(); initDrop();
    tick();
    loadExcel().then(function () {
      renderNotice(); buildFilterPanel(); state.signature = ""; tick();
      var m = location.hash.match(/^#offer=(.+)$/), shown = false;
      if (m) {                                      // old-style link: open it, then show its proper address
        var ho = findOffer(decodeURIComponent(m[1]));
        if (ho) { var hp = merchantPath(ho.merchant); if (hp && CAN_ROUTE) history.replaceState({}, "", pageUrl(hp) + location.search); openOffer(ho.id, true); shown = true; }
      } else if (route.merchantSlug) {
        var mo = merchantOffer(route.merchantSlug);
        if (mo) { openOffer(mo.id, true); shown = true; }
        else { goTo("", true); applyListMeta(""); msgToast("That offer is no longer available. Here are today's offers."); }
      }
      if (!shown) trackList(state.filters.category);
      document.documentElement.classList.add("is-ready");
    });
    // 4× a second keeps the countdown flip crisp on every second boundary
    setInterval(tick, 250);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) { state.signature = ""; tick(); } });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
