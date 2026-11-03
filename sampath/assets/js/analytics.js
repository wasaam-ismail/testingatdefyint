/* =====================================================================
   ANALYTICS + COOKIE CONSENT
   ---------------------------------------------------------------------
   Google tag (GA4 and Google Ads) and/or Google Tag Manager, switched on
   by the IDs in settings.js → ANALYTICS. Nothing is loaded and nothing is
   sent until the visitor accepts cookies (Google Consent Mode v2, with
   everything "denied" by default), in line with Sri Lanka's Personal
   Data Protection Act.

   The rest of the site reports what people do through:
       SampathTrack.pageView({ path, title, group, category, merchant })
       SampathTrack.event(name, params)
   ===================================================================== */
(function () {
  "use strict";
  var S = window.SETTINGS || {}, A = S.ANALYTICS || {};
  var GA4 = (A.GA4_ID || "").trim(), ADS = (A.GOOGLE_ADS_ID || "").trim(), GTM = (A.GTM_ID || "").trim();
  var HAS_TAG = !!(GA4 || ADS || GTM);
  var KEY = "sampath-cookie-consent", MAX_AGE = 365 * 24 * 3600 * 1000;
  var DEBUG = /[?&]debug_analytics=1/.test(location.search);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  // Consent Mode v2 defaults: everything denied until the visitor chooses
  gtag("consent", "default", {
    ad_storage: "denied", analytics_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
    functionality_storage: "granted", security_storage: "granted", wait_for_update: 500,
  });

  function readChoice() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY) || "null");
      if (c && c.t && Date.now() - c.t < MAX_AGE) return c.v;     // "all" or "essential"
    } catch (e) {}
    return null;
  }
  function saveChoice(v) { try { localStorage.setItem(KEY, JSON.stringify({ v: v, t: Date.now() })); } catch (e) {} }

  var granted = false, loaded = false, lastPage = null;

  function loadTags() {
    if (loaded || !HAS_TAG) return;
    loaded = true;
    gtag("js", new Date());
    // page views are sent by the site itself, once per page (including category and offer pages)
    if (GA4) gtag("config", GA4, { send_page_view: false });
    if (ADS) gtag("config", ADS, { send_page_view: false });
    var first = GA4 || ADS;
    if (first) addScript("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(first));
    if (GTM) {
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      addScript("https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(GTM));
    }
  }
  function addScript(src) { var s = document.createElement("script"); s.async = true; s.src = src; document.head.appendChild(s); }

  function grant() {
    granted = true;
    gtag("consent", "update", { ad_storage: "granted", analytics_storage: "granted", ad_user_data: "granted", ad_personalization: "granted" });
    loadTags();
    if (lastPage) send("page_view", lastPage);   // count the page they were on when they accepted
  }

  function send(name, params) {
    if (DEBUG) console.info("[Analytics]", name, params, granted ? "" : "(not sent: no consent)");
    if (!granted || !HAS_TAG) return;
    gtag("event", name, params || {});
    if (GTM) window.dataLayer.push(Object.assign({ event: name }, params || {}));
  }

  window.SampathTrack = {
    pageView: function (p) {
      lastPage = {
        page_location: location.href.split("#")[0], page_path: location.pathname, page_title: p.title || document.title,
        content_group: p.group || "Home",
        offer_category: p.category || "", offer_merchant: p.merchant || "",
      };
      send("page_view", lastPage);
    },
    event: function (name, params) { send(name, params); },
    openSettings: function () { showBanner(true); },
    hasTag: HAS_TAG,
  };

  /* ---------- the banner ---------- */
  var MODE = String(A.CONSENT_BANNER || "AUTO").toUpperCase();   // ON, OFF or AUTO (only when an ID is set)
  var SHOW = MODE === "ON" || (MODE === "AUTO" && HAS_TAG);

  function showBanner(force) {
    if (!SHOW && !force) return;
    var old = document.getElementById("cookies"); if (old) old.remove();
    var b = document.createElement("div");
    b.id = "cookies"; b.className = "cookies"; b.setAttribute("role", "dialog"); b.setAttribute("aria-live", "polite");
    b.setAttribute("aria-label", "Cookie choices");
    var policy = A.PRIVACY_POLICY_URL ? ' <a href="' + A.PRIVACY_POLICY_URL.replace(/"/g, "&quot;") + '" target="_blank" rel="noopener">Privacy policy</a>' : "";
    b.innerHTML =
      '<div class="cookies__in"><p class="cookies__t">Cookies on this site</p>' +
      "<p>We use cookies to understand how this site is used and to show you relevant Sampath Bank offers on other websites. " +
      "Choose “Accept all” to allow this, or “Essential only” to keep just what the site needs to work." + policy + "</p></div>" +
      '<div class="cookies__btns"><button class="btn btn--ghost" data-consent="essential">Essential only</button>' +
      '<button class="btn btn--primary" data-consent="all">Accept all</button></div>';
    b.addEventListener("click", function (e) {
      var t = e.target.closest("[data-consent]"); if (!t) return;
      var v = t.getAttribute("data-consent"); saveChoice(v); b.remove();
      if (v === "all") grant();
      else if (granted) {   // changed their mind: switch off from now on
        granted = false;
        gtag("consent", "update", { ad_storage: "denied", analytics_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      }
    });
    document.body.appendChild(b);
  }

  var choice = readChoice();
  if (choice === "all") grant();
  function ready() {
    if (!choice) showBanner(false);
    var link = document.getElementById("cookieSettings");
    if (link) {
      if (!SHOW) link.hidden = true;
      link.addEventListener("click", function (e) { e.preventDefault(); showBanner(true); });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready); else ready();
})();
