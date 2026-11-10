/**
 * Jeep microsite lead capture -> Google Sheet (+ optional email alert)
 *
 * 1. Create a Google Sheet. Extensions > Apps Script. Paste this file.
 * 2. Set NOTIFY_EMAIL below (or leave blank).
 * 3. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
 * 4. Copy the web-app URL into LEAD_ENDPOINT in index.html.
 */
var NOTIFY_EMAIL = ''; // e.g. 'jeep@dimolanka.com'
var FIELDS = ['submitted_at','full_name','mobile','whatsapp','email','model','timeframe','payment',
  'marketing_optin','consent','utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid','page_url'];

function doPost(e) {
  var data = JSON.parse(e.postData.contents || '{}');
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(FIELDS);
  sheet.appendRow(FIELDS.map(function (k) { return data[k] || ''; }));
  if (NOTIFY_EMAIL) {
    MailApp.sendEmail(NOTIFY_EMAIL, 'New Jeep test drive lead: ' + (data.model || '') + ' - ' + (data.full_name || ''),
      FIELDS.map(function (k) { return k + ': ' + (data[k] || ''); }).join('\n'));
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}
