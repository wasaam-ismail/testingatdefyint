/* =====================================================================
   OFFER ENGINE — dates, Sri Lanka time, classification, Excel mapping.
   No need to edit this file. Settings live in /settings.js.
   ===================================================================== */
(function (root) {
  "use strict";

  /* ---------- Sri Lanka time ------------------------------------------
     Asia/Colombo is UTC+05:30 all year (no daylight saving). All maths is
     done on absolute timestamps, then shifted by this offset, so the
     visitor's own computer timezone never affects results.               */
  var COLOMBO_OFFSET_MS = 330 * 60 * 1000;
  var DAY_MS = 86400000;

  function colomboEpoch(y, m, d, hh, mm, ss) {           // m = 1..12
    return Date.UTC(y, m - 1, d, hh || 0, mm || 0, ss || 0) - COLOMBO_OFFSET_MS;
  }
  function colomboParts(epoch) {
    var t = new Date(epoch + COLOMBO_OFFSET_MS);
    return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate(),
             hh: t.getUTCHours(), mm: t.getUTCMinutes(), ss: t.getUTCSeconds(), dow: t.getUTCDay() };
  }
  function colomboDayIndex(epoch) { return Math.floor((epoch + COLOMBO_OFFSET_MS) / DAY_MS); }
  function colomboMidnight(epoch) { return colomboDayIndex(epoch) * DAY_MS - COLOMBO_OFFSET_MS; }

  var MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12,
                 january: 1, february: 2, march: 3, april: 4, june: 6, july: 7, august: 8, september: 9, october: 10, november: 11, december: 12 };
  var MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var DOW_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  /* ---------- Parsing helpers ---------------------------------------- */

  // "15th NOV - 1st DEC", "20thNOV - 20th DEC", " 13th DEC- 25th DEC", "1 Dec 2026 - 3 Jan 2027"
  function parseDateRangeText(text, defaultYear) {
    if (!text) return null;
    var s = String(text).replace(/\s+/g, " ").trim();
    var re = /(\d{1,2})\s*(?:st|nd|rd|th)?\s*([A-Za-z]{3,9})\.?,?\s*(\d{4})?/gi;
    var found = [], mt;
    while ((mt = re.exec(s)) !== null) {
      var mon = MONTHS[mt[2].toLowerCase()];
      if (mon) found.push({ d: +mt[1], m: mon, y: mt[3] ? +mt[3] : null });
    }
    if (!found.length) return null;
    var a = found[0], b = found[1] || found[0];
    var ay = a.y || defaultYear;
    var by = b.y || ay;
    if (!b.y && (b.m < a.m || (b.m === a.m && b.d < a.d))) by = ay + 1;   // Dec → Jan wrap
    return { start: { y: ay, m: a.m, d: a.d }, end: { y: by, m: b.m, d: b.d } };
  }

  // Accepts a JS Date (from Excel), an Excel serial number, or text like "15 Nov 2026" / "2026-11-15" / "15/11/2026"
  function parseSingleDate(v, defaultYear) {
    if (v === null || v === undefined || v === "") return null;
    if (v instanceof Date && !isNaN(v)) {
      // SheetJS gives dates as local-midnight Date objects; read local parts
      return { y: v.getFullYear(), m: v.getMonth() + 1, d: v.getDate() };
    }
    if (typeof v === "number" && v > 20000 && v < 80000) {        // Excel serial
      var ms = Math.round((v - 25569) * DAY_MS), t = new Date(ms);
      return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
    }
    var s = String(v).trim(), mt;
    if ((mt = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) return { y: +mt[1], m: +mt[2], d: +mt[3] };
    if ((mt = s.match(/^(\d{1,2})[\/.](\d{1,2})[\/.](\d{2,4})$/))) {   // day/month/year (Sri Lankan style)
      var yy = +mt[3]; if (yy < 100) yy += 2000; return { y: yy, m: +mt[2], d: +mt[1] };
    }
    var r = parseDateRangeText(s, defaultYear);
    return r ? r.start : null;
  }

  // "10:00", "10.30", "7 pm", "7:30PM", Excel fraction (0.5 = 12:00), Date object
  function parseTime(v) {
    if (v === null || v === undefined || v === "") return null;
    if (v instanceof Date && !isNaN(v)) return { hh: v.getHours(), mm: v.getMinutes() };
    if (typeof v === "number" && v >= 0 && v < 1) {
      var mins = Math.round(v * 1440); return { hh: Math.floor(mins / 60) % 24, mm: mins % 60 };
    }
    var s = String(v).trim().toLowerCase(), mt = s.match(/^(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm)?$/);
    if (!mt) return null;
    var hh = +mt[1], mm = mt[2] ? +mt[2] : 0;
    if (mt[3] === "pm" && hh < 12) hh += 12;
    if (mt[3] === "am" && hh === 12) hh = 0;
    if (hh > 23 || mm > 59) return null;
    return { hh: hh, mm: mm };
  }

  // 0.35 → 35 ; "35%" → 35 ; 35 → 35 ; "LKR 1,000 off" → text
  function parseOfferValue(v) {
    if (v === null || v === undefined || v === "") return null;
    if (typeof v === "number") return { pct: v <= 1 ? Math.round(v * 1000) / 10 : v, text: null };
    var s = String(v).trim(), mt = s.match(/^(\d+(?:\.\d+)?)\s*%?$/);
    if (mt) { var n = +mt[1]; return { pct: n <= 1 && s.indexOf("%") < 0 ? n * 100 : n, text: null }; }
    return { pct: null, text: s };
  }

  /* ---------- Excel column mapping -----------------------------------
     Column headers are matched loosely, so "CC Offer", "Credit Card Offer"
     or "Credit Offer" all work.                                          */
  var COLUMN_ALIASES = {
    category:  ["category", "categories", "offer category", "type"],
    merchant:  ["merchant", "merchant name", "store", "brand", "partner"],
    credit:    ["cc offer", "credit card offer", "credit offer", "cc", "credit card", "credit"],
    debit:     ["dc offer", "debit card offer", "debit offer", "dc", "debit card", "debit"],
    offerText: ["offer", "offer description", "description", "offer details", "details", "headline", "discount"],
    address:   ["address", "merchant address"],
    location:  ["location", "city", "area", "town"],
    mapsUrl:   ["google maps", "maps", "map", "map link", "google map"],
    hours:     ["opening hours", "hours", "open hours"],
    offerDate: ["offer date", "offer dates", "validity", "dates", "date", "period", "offer period"],
    startDate: ["start date", "from", "valid from", "starts"],
    endDate:   ["end date", "to", "valid to", "valid until", "ends"],
    startTime: ["start time"],
    endTime:   ["end time"],
    terms:     ["terms", "terms & conditions", "terms and conditions", "t&c", "t&cs", "conditions"],
    url:       ["website", "url", "cta url", "link", "cta", "web"],
    cardType:  ["card type", "cards", "eligible cards", "card"],
  };
  function normHeader(h) { return String(h || "").toLowerCase().replace(/[–—]/g, "-").replace(/\s+/g, " ").trim(); }

  function mapColumns(headerRow) {
    var map = {};
    headerRow.forEach(function (h, i) {
      var n = normHeader(h);
      Object.keys(COLUMN_ALIASES).forEach(function (key) {
        if (map[key] === undefined && COLUMN_ALIASES[key].indexOf(n) >= 0) map[key] = i;
      });
    });
    return map;
  }

  function slug(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function deriveLocation(address, category) {
    var a = String(address || "").trim(), c = String(category || "");
    if (/online/i.test(c) || /^online/i.test(a)) return "Online";
    if (!a) return "";
    var segs = a.split(",").map(function (x) { return x.trim(); }).filter(Boolean);
    var last = segs[segs.length - 1] || "";
    if (/^sri lanka$/i.test(last) && segs.length > 1) last = segs[segs.length - 2];
    last = last.replace(/\s*\d{3,6}\s*$/, "").trim();
    if (/colombo/i.test(last) || (/;/.test(last) && /colombo/i.test(a))) return "Colombo";
    return last;
  }

  /* Turn Excel rows (array of arrays) into offer objects. Nothing is
     invented: missing values stay empty. Problems are collected in
     `warnings` and shown in the browser console.                         */
  function rowsToOffers(rows, settings) {
    var warnings = [], offers = [];
    var year = settings.OFFER_YEAR || new Date().getFullYear();
    var hIdx = -1;
    for (var i = 0; i < Math.min(rows.length, 15); i++) {
      if ((rows[i] || []).some(function (c) { return normHeader(c) === "merchant" || normHeader(c) === "merchant name"; })) { hIdx = i; break; }
    }
    if (hIdx < 0) { warnings.push("Could not find a header row with a 'Merchant' column."); return { offers: offers, warnings: warnings }; }
    var col = mapColumns(rows[hIdx]);
    var get = function (row, key) { return col[key] === undefined ? null : row[col[key]]; };
    var defStart = parseTime(settings.DEFAULT_START_TIME) || { hh: 0, mm: 0 };
    var defEndRaw = settings.DEFAULT_END_TIME || "23:59";

    for (var r = hIdx + 1; r < rows.length; r++) {
      var row = rows[r] || [];
      var merchant = get(row, "merchant");
      if (!merchant || !String(merchant).trim()) continue;
      merchant = String(merchant).trim();
      var category = String(get(row, "category") || "Other").trim();

      // ---- dates
      var sD = parseSingleDate(get(row, "startDate"), year), eD = parseSingleDate(get(row, "endDate"), year);
      if (!sD || !eD) {
        var range = parseDateRangeText(get(row, "offerDate"), year);
        if (range) { sD = sD || range.start; eD = eD || range.end; }
      }
      if (!sD || !eD) { warnings.push("Row " + (r + 1) + " (" + merchant + "): could not read the offer dates — skipped."); continue; }

      var sT = parseTime(get(row, "startTime")) || defStart;
      var eTraw = get(row, "endTime");
      var eT = parseTime(eTraw) || parseTime(defEndRaw) || { hh: 23, mm: 59 };
      var start = colomboEpoch(sD.y, sD.m, sD.d, sT.hh, sT.mm);
      // "23:59" means "until the end of that day" → next midnight
      var end = (eT.hh === 23 && eT.mm === 59)
        ? colomboEpoch(eD.y, eD.m, eD.d) + DAY_MS
        : colomboEpoch(eD.y, eD.m, eD.d, eT.hh, eT.mm);
      if (end <= start) { warnings.push("Row " + (r + 1) + " (" + merchant + "): end is before start — skipped."); continue; }

      var credit = parseOfferValue(get(row, "credit")), debit = parseOfferValue(get(row, "debit"));
      var address = get(row, "address") ? String(get(row, "address")).trim() : "";
      var loc = get(row, "location") ? String(get(row, "location")).trim() : deriveLocation(address, category);

      offers.push({
        id: slug(merchant + "-" + category + "-" + sD.m + "-" + sD.d),
        source: "excel",
        merchant: merchant,
        category: category,
        credit: credit, debit: debit,
        offerText: get(row, "offerText") ? String(get(row, "offerText")).trim() : "",
        address: address,
        location: loc,
        mapsUrl: get(row, "mapsUrl") ? String(get(row, "mapsUrl")).trim() : "",
        hours: get(row, "hours") ? String(get(row, "hours")).trim() : "",
        terms: get(row, "terms") ? String(get(row, "terms")).trim() : "",
        url: get(row, "url") ? String(get(row, "url")).trim() : "",
        cardType: get(row, "cardType") ? String(get(row, "cardType")).trim() : "",
        rawDate: get(row, "offerDate") ? String(get(row, "offerDate")).trim() : "",
        allDay: !get(row, "startTime") && !eTraw,
        start: start, end: end,
      });
    }
    // make ids unique
    var seen = {};
    offers.forEach(function (o) { if (seen[o.id]) { seen[o.id]++; o.id += "-" + seen[o.id]; } else seen[o.id] = 1; });
    return { offers: offers, warnings: warnings };
  }

  /* ---------- Classification -----------------------------------------
     Decides which section an offer belongs to at time `now`.
       today     – live right now            → countdown to END
       latertoday– starts later today        → countdown to START
       tomorrow  – starts tomorrow           → countdown to START
       next3     – starts in 2–3 days        → countdown to START
       nextweek  – starts in 4–7 days        → countdown to START
       comingup  – starts in 8+ days         → countdown to START
       expired   – already ended             → not shown                  */
  function classify(offer, now) {
    if (now >= offer.end) return "expired";
    if (now >= offer.start) return "today";
    var diff = colomboDayIndex(offer.start) - colomboDayIndex(now);
    if (diff <= 0) return "latertoday";
    if (diff === 1) return "tomorrow";
    if (diff <= 3) return "next3";
    if (diff <= 7) return "nextweek";
    return "comingup";
  }

  function countdownParts(ms) {
    ms = Math.max(0, ms);
    var total = Math.floor(ms / 1000);
    return { days: Math.floor(total / 86400), hours: Math.floor((total % 86400) / 3600),
             minutes: Math.floor((total % 3600) / 60), seconds: total % 60, total: total };
  }

  /* ---------- Formatting ---------------------------------------------- */
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function fmtTime(epoch) {
    var p = colomboParts(epoch), h = p.hh % 12 || 12;
    return h + (p.mm ? ":" + pad(p.mm) : "") + " " + (p.hh < 12 ? "AM" : "PM");
  }
  function fmtClock(epoch) { var p = colomboParts(epoch); return pad(p.hh) + ":" + pad(p.mm) + ":" + pad(p.ss); }
  function fmtDate(epoch, withDow, withYear) {
    var p = colomboParts(epoch);
    return (withDow ? DOW_SHORT[p.dow] + " " : "") + p.d + " " + MONTH_SHORT[p.m - 1] + (withYear ? " " + p.y : "");
  }
  // last moment an offer is valid (for display): end minus 1 minute when it ends at midnight
  function displayEnd(offer) {
    var p = colomboParts(offer.end);
    return (p.hh === 0 && p.mm === 0) ? offer.end - 60000 : offer.end;
  }

  var api = {
    COLOMBO_OFFSET_MS: COLOMBO_OFFSET_MS, DAY_MS: DAY_MS,
    colomboEpoch: colomboEpoch, colomboParts: colomboParts, colomboDayIndex: colomboDayIndex, colomboMidnight: colomboMidnight,
    parseDateRangeText: parseDateRangeText, parseSingleDate: parseSingleDate, parseTime: parseTime, parseOfferValue: parseOfferValue,
    mapColumns: mapColumns, rowsToOffers: rowsToOffers, deriveLocation: deriveLocation, slug: slug,
    classify: classify, countdownParts: countdownParts,
    fmtTime: fmtTime, fmtClock: fmtClock, fmtDate: fmtDate, displayEnd: displayEnd, pad: pad,
    MONTH_SHORT: MONTH_SHORT, DOW_SHORT: DOW_SHORT,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.OfferEngine = api;
})(typeof window !== "undefined" ? window : globalThis);
