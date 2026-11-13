/* =====================================================================
   Mercedes-Benz CLA landing page — cookie consent + tracking
   ---------------------------------------------------------------------
   SETTINGS: paste your IDs here. Nothing loads while they are empty.
   ===================================================================== */
var CLA_TRACKING = {
  GTM_ID: '',          // Google Tag Manager container, e.g. 'GTM-ABC1234'
  META_PIXEL_ID: '',   // Only if the Meta Pixel is NOT set up inside GTM, e.g. '123456789012345'
  PRIVACY_URL: window.CLA_PRIVACY_URL || 'privacy/'   // set per page; leave as is
};
/* ===================================================================== */

(function () {
  var KEY = 'cla_consent_v1';
  var MAX_AGE = 365 * 24 * 60 * 60 * 1000;          // ask again after 12 months

  // ---- Google Consent Mode v2: everything denied until the visitor chooses ----
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', functionality_storage: 'granted', security_storage: 'granted',
    wait_for_update: 500
  });
  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'url_passthrough', true);

  function read() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (v && Date.now() - v.ts < MAX_AGE) return v;
    } catch (e) {}
    return null;
  }
  function write(analytics, advertising) {
    var v = { analytics: !!analytics, advertising: !!advertising, ts: Date.now(), version: 1 };
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {}
    return v;
  }

  var pixelLoaded = false;
  function loadPixel() {
    if (pixelLoaded || !CLA_TRACKING.META_PIXEL_ID) return;
    pixelLoaded = true;
    /* Meta Pixel base code */
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', CLA_TRACKING.META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  function apply(v) {
    gtag('consent', 'update', {
      analytics_storage: v.analytics ? 'granted' : 'denied',
      ad_storage: v.advertising ? 'granted' : 'denied',
      ad_user_data: v.advertising ? 'granted' : 'denied',
      ad_personalization: v.advertising ? 'granted' : 'denied'
    });
    // GTM trigger for non-Google tags (e.g. Meta Pixel): Custom Event "cla_consent_update"
    window.dataLayer.push({ event: 'cla_consent_update', consent_analytics: v.analytics, consent_advertising: v.advertising });
    if (v.advertising) loadPixel();
  }

  var stored = read();
  if (stored) apply(stored);

  // ---- Google Tag Manager (only when an ID is set) ----
  if (CLA_TRACKING.GTM_ID) {
    (function (w, d, s, l, i) { w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true; j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', CLA_TRACKING.GTM_ID);
  }

  // ---- Lead and click events (sent to GTM; Meta gets them only with consent) ----
  window.claTrack = function (name, params) {
    window.dataLayer.push(Object.assign({ event: name }, params || {}));
    if (pixelLoaded && window.fbq) {
      if (name === 'generate_lead') window.fbq('track', 'Lead', params || {});
      else if (name === 'click_whatsapp' || name === 'click_call') window.fbq('track', 'Contact', { method: name.replace('click_', '') });
    }
  };
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('https://wa.me/') === 0) window.claTrack('click_whatsapp', { link_location: a.className || a.id || 'link' });
    else if (href.indexOf('tel:') === 0) window.claTrack('click_call', { link_location: a.className || a.id || 'link' });
  }, true);

  // ---- Banner ----
  var CSS = '' +
    '.cc-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:1000;max-width:760px;margin:0 auto;background:#0a0a0a;color:#f4f3f0;' +
    'border:1px solid rgba(255,255,255,.14);border-radius:10px;box-shadow:0 18px 50px rgba(0,0,0,.45);padding:22px 24px;font-family:CorpoS,-apple-system,"Segoe UI",sans-serif;' +
    'font-size:13.5px;line-height:1.55;transform:translateY(20px);opacity:0;transition:opacity .35s ease,transform .35s ease;}' +
    '.cc-banner.cc-show{transform:none;opacity:1;}' +
    '.cc-banner h2{font-family:CorporateA,Georgia,serif;font-weight:500;font-size:19px;color:#fff;margin:0 0 6px;}' +
    '.cc-banner p{margin:0 0 14px;color:#c9cdd2;}' +
    '.cc-banner a{color:#fff;text-decoration:underline;text-underline-offset:2px;}' +
    '.cc-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;}' +
    '.cc-btn{font:inherit;font-size:12px;letter-spacing:.1em;text-transform:uppercase;font-weight:600;padding:12px 22px;border-radius:2px;cursor:pointer;' +
    'border:1px solid #fff;background:transparent;color:#fff;transition:background .25s,color .25s;}' +
    '.cc-btn:hover{background:#fff;color:#0a0a0a;}' +
    '.cc-btn.cc-solid{background:#fff;color:#0a0a0a;}' +
    '.cc-btn.cc-solid:hover{background:#d9d9d9;}' +
    '.cc-link{background:none;border:none;color:#c9cdd2;font:inherit;font-size:12.5px;text-decoration:underline;cursor:pointer;margin-left:auto;padding:6px 0;}' +
    '.cc-prefs{display:none;border-top:1px solid rgba(255,255,255,.12);margin:4px 0 16px;padding-top:12px;}' +
    '.cc-prefs.cc-open{display:block;}' +
    '.cc-opt{display:flex;gap:12px;align-items:flex-start;padding:8px 0;}' +
    '.cc-opt input{margin-top:3px;width:16px;height:16px;accent-color:#fff;flex:none;}' +
    '.cc-opt b{display:block;color:#fff;font-weight:600;}' +
    '.cc-opt span{color:#9aa0a6;font-size:12.5px;}' +
    '@media(max-width:600px){.cc-banner{left:10px;right:10px;bottom:10px;padding:18px;}.cc-btn{flex:1 1 auto;}.cc-link{margin-left:0;}}';

  function el(html) { var d = document.createElement('div'); d.innerHTML = html; return d.firstChild; }

  function showBanner(openPrefs) {
    var cur = read() || { analytics: false, advertising: false };
    var old = document.getElementById('ccBanner'); if (old) old.remove();
    if (!document.getElementById('ccStyle')) { var st = document.createElement('style'); st.id = 'ccStyle'; st.textContent = CSS; document.head.appendChild(st); }
    var b = el(
      '<div class="cc-banner" id="ccBanner" role="dialog" aria-modal="false" aria-labelledby="ccTitle">' +
        '<h2 id="ccTitle">Your privacy</h2>' +
        '<p>We use cookies to understand how this page is used and to measure our advertising on Google and Meta. ' +
        'These are only set if you accept. See our <a href="' + CLA_TRACKING.PRIVACY_URL + '">Privacy &amp; Cookie Notice</a>.</p>' +
        '<div class="cc-prefs' + (openPrefs ? ' cc-open' : '') + '" id="ccPrefs">' +
          '<label class="cc-opt"><input type="checkbox" checked disabled><div><b>Essential</b><span>Remembers your cookie choice. Always on.</span></div></label>' +
          '<label class="cc-opt"><input type="checkbox" id="ccAnalytics"' + (cur.analytics ? ' checked' : '') + '><div><b>Analytics</b><span>Google Analytics — how visitors use this page.</span></div></label>' +
          '<label class="cc-opt"><input type="checkbox" id="ccAds"' + (cur.advertising ? ' checked' : '') + '><div><b>Advertising</b><span>Google Ads and Meta — measuring and improving our ads.</span></div></label>' +
        '</div>' +
        '<div class="cc-row">' +
          '<button type="button" class="cc-btn cc-solid" id="ccReject">Reject all</button>' +
          '<button type="button" class="cc-btn cc-solid" id="ccAccept">Accept all</button>' +
          '<button type="button" class="cc-btn" id="ccSave" style="display:' + (openPrefs ? 'inline-block' : 'none') + '">Save choices</button>' +
          '<button type="button" class="cc-link" id="ccManage"' + (openPrefs ? ' style="display:none"' : '') + '>Manage choices</button>' +
        '</div>' +
      '</div>');
    document.body.appendChild(b);
    requestAnimationFrame(function () { b.classList.add('cc-show'); });
    function done(a, ad) { apply(write(a, ad)); b.classList.remove('cc-show'); setTimeout(function () { b.remove(); }, 350); }
    b.querySelector('#ccAccept').onclick = function () { done(true, true); };
    b.querySelector('#ccReject').onclick = function () { done(false, false); };
    b.querySelector('#ccSave').onclick = function () { done(b.querySelector('#ccAnalytics').checked, b.querySelector('#ccAds').checked); };
    b.querySelector('#ccManage').onclick = function () {
      b.querySelector('#ccPrefs').classList.add('cc-open'); this.style.display = 'none';
      b.querySelector('#ccSave').style.display = 'inline-block';
    };
  }
  window.claCookieSettings = function () { showBanner(true); };

  function init() {
    document.querySelectorAll('[data-cookie-settings]').forEach(function (x) {
      x.addEventListener('click', function (e) { e.preventDefault(); showBanner(true); });
    });
    if (!read()) showBanner(false);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
