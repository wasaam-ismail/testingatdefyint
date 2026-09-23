/* =====================================================================
   DFCC CARD OFFERS — "NEVER MISS AN OFFER"
   ---------------------------------------------------------------------
   SETTINGS FILE
   This is the ONLY file you normally need to open (besides the Excel).
   Open it in any text editor (TextEdit, Notepad, VS Code).

   Rules for editing safely:
     • Only change text between the quote marks "like this".
     • Keep every comma at the end of a line.
     • Lines starting with //  are notes for you. The website ignores them.
   ===================================================================== */

window.SETTINGS = {

  /* -------------------------------------------------------------------
     1. DEMO MODE  —  "ON" or "OFF"
     ON  = presentation mode: looping demo offers with fast countdowns
           (settings in DEMO_CONFIG further down).
     OFF = the real website: offers from the Excel file, real dates,
           real Sri Lanka time.
     Tip: you can also add ?demo=on or ?demo=off to the end of the web
     address to switch temporarily without editing this file.
     ------------------------------------------------------------------- */
  DEMO_MODE: "ON",

  /* -------------------------------------------------------------------
     2. THE OFFERS EXCEL FILE
     Replace offers/offers.xlsx with your new Excel (same file name).
     ------------------------------------------------------------------- */
  OFFERS_FILE: "offers/offers.xlsx",

  // The Excel "Offer Date" column has no year (e.g. "15th NOV - 1st DEC").
  // This year is used for those dates. If an offer runs from December into
  // January, the end date automatically moves into the following year.
  OFFER_YEAR: 2026,

  // Used when an offer has no specific start / end time in the Excel.
  // "00:00" = starts at midnight. "23:59" = runs until the end of the day.
  DEFAULT_START_TIME: "00:00",
  DEFAULT_END_TIME: "23:59",

  // Today's offers that end within this many hours get the extra-urgent
  // "Ending soon" styling.
  ENDING_SOON_HOURS: 3,

  // How many "Coming up" offers to show before the "Show all" button.
  COMING_UP_PREVIEW: 12,

  /* -------------------------------------------------------------------
     3. MERCHANT LOGOS   (files live in: assets/logos/)
     HOW MATCHING WORKS
       a) If the merchant is listed below, that file is used.
       b) If not, the site looks for a file named EXACTLY like the
          merchant name in the Excel, e.g. "Burger King.png" or ".jpg".
       c) If nothing is found, a clean placeholder with the merchant's
          initials is shown. Nothing breaks.
     To fix a wrong/missing logo: add or edit a line below:
          "Merchant name exactly as in Excel": "logo file name.png",
     ------------------------------------------------------------------- */
  LOGO_FILES: {
    "Keells - Union Place": "Keells.jpg",
    "Cargills Food Hall & Supermarket - Colombo City Centre": "Cargills food hall.png",
    "SPAR Supermarket - Union Place": "SPAR.jpg",
    "LAUGFS Super - Wellawatte": "laughs supermarket.jpg",
    "Softlogic GLOMARK - CR & FC": "Softlogic Glomark.jpg",
    "Crystal Jade - One Galle Face": "Chrystal jade.jpg",
    "Burger King - Colombo 03": "Burger king.png",
    "Baskin-Robbins Colombo 04": "Baskin Robins.png",
    "Subway Colombo": "Subway.png",
    "Shoulders by Harpos": "shoulders by harpos.jpg",
    "Singer Mega - Colombo 3": "singer mega.jpg",
    "Abans Elite - Colombo 03": "Abans.jpg",
    "Damro Mega Showroom - Colpetty": "Damro.jpg",
    "Dinapala Wattala Showroom": "Dinapala wattala showroom.png",
    "Singhagiri Flagship Store": "Singhagiri.png",
    "Courtyard - Cinnamon Grand Colombo": "",            // NO LOGO SUPPLIED
    "Cinnamon Grand Colombo": "Cinnamon grand colombo.png",
    "Taj Samudra Colombo": "Taj samudra.png",
    "Shangri-La Colombo": "shangri la hotel.png",
    "Atlas.lk": "atlas.jpg",
    "Hemas eStore": "Hemas e store.png",
    "Daraz Sri Lanka": "Daraz.png",
    "Kapruka.com": "Kapruka.jpg",
    "FindMyFare": "find my fair.jpg",
    "Uga Prāva": "uga prava.png",
    "Taj Bentota Resort & Spa": "Taj bentota.png",
    "Mount Randholee Resorts & Spa": "mount randholee.jpg",
    "Wishing Tree Boutique Resort & Spa": "Wishing Tree Boutique Resort & Spa.png",
    "The Notary's House": "The Notary_s House.png",
    "The Body Shop": "body shop.png",
    "Spa Ceylon - Kollupitiya": "spa ceylon.jpg",
    "Swastha by Link Natural": "Swastha by Link Natural.jpg",
    "LIFE BALANCE": "LIFE BALANCE.jpg",
    "NIJA Luxury Wellness": "NIJA Luxury Wellness.jpg",
    "Vogue Jewellers - Colombo 03": "Vogue Jewellers.png",
    "Raja Jewellers": "Raja Jewellers.jpg",
    "Nithyakalyani Jewellery - Wellawatta": "Nithyakalyani Jewellery - Wellawatta.jpg",
    "Swaranamahal Jewellers": "Swaranamahal Jewellers.jpg",
    "Colombo Jewellery Stores - Heritage Store": "Colombo Jewellery Stores - Heritage Store.jpg",
    "Singer Sri Lanka": "singer.png",
    "Softlogic Max - Colombo 03": "softlogic max.jpg",
    "Olanka Travels": "olanka travels.jpg",
    "Mai Globe Travels": "Mai Globe Travels.jpg",
    "Aitken Spence": "Aitken Spence.jpg",
    "Walkers Tours": "Walkers Tours.png",
    "Cinnamon Air Head Office": "Cinnamon Air Head Office.png",
    "Toyotsu Lanka": "Toyotsu Lanka.png",
    "Toyota Lanka - Panchikawatta": "Toyota Lanka - Panchikawatta.jpg",
    "U & H Wheel Service": "U & H Wheel Service.jpg",
    "McLarens Lubricants - Mobil": "McLarens Lubricants - Mobil.jpg",
    "Mag City Colombo": "Mag City Colombo.png",
    "ESA Restaurant": "ESA Restaurant.jpg",
    "Morimoto": "",                                      // CHECK: supplied "Morimoto.png" is the Morimoto automotive-lighting brand, not the restaurant — replace with the right logo
    "NineTable": "NineTable.png",                      // CHECK: supplied logo reads "Table by Nyne"
    "Planta": "",                                        // NO LOGO SUPPLIED
    "OKU": "",                                           // NO LOGO SUPPLIED
    "Café Colombo": "Cafe Colombo.jpg",
    "The Bavarian German Restaurant & Pub": "The Bavarian German Restaurant & Pub.jpg",
    "El Barrio - Tapas & Wine Bar": "El Barrio - Tapas & Wine Bar.jpg",
    "London House of Coffee": "London House of Coffee.jpg",
    "Yumi - Taj Samudra Colombo": "Yumi - Taj Samudra Colombo.png",
  },

  /* -------------------------------------------------------------------
     4. CATEGORY IMAGES   (files live in: assets/categories/)
     Same idea as logos: listed here first, otherwise the site looks for
     a file named exactly like the category, e.g. "Dining.jpg".
     Categories themselves come from the Excel automatically.
     ------------------------------------------------------------------- */
  CATEGORY_IMAGES: {
    "Supermarkets": "Supermarkets.jpg",
    "Dining": "Dining.jpg",
    "0% Easy Payment Plans": "Easy Installmen Plans.jpg",
    "Pinnacle": "Pinnacle.jpg",
    "Online": "Online.jpg",
    "Hotels": "Hotels.jpg",
    "Gift and Wellness": "GiftWellness.jpg",
    "Jewellery": "Jewellery.jpg",
    "Home Appliances": "HomeAppliances.jpg",
    "Travel": "Travel.jpg",
    "Autocare": "Autocare.jpg",
    "Visa Offers": "visanew.jpg",
    "Mastercard Offers": "MasterCard-Offers.jpg",
  },

  /* -------------------------------------------------------------------
     5. SEARCH HELPERS
     Extra words that should find a category. Example: searching "pizza"
     shows Dining offers. Add words freely.
     ------------------------------------------------------------------- */
  SEARCH_SYNONYMS: {
    "Dining": ["restaurant", "food", "eat", "dinner", "lunch", "pizza", "burger", "cafe", "coffee", "ice cream", "dessert", "bar", "pub"],
    "Supermarkets": ["grocery", "groceries", "supermarket", "food"],
    "Hotels": ["hotel", "resort", "stay", "holiday", "villa", "getaway"],
    "Travel": ["travel", "flight", "tour", "holiday", "air", "trip"],
    "Online": ["online", "e-commerce", "delivery", "web", "shop online"],
    "Gift and Wellness": ["spa", "wellness", "gift", "beauty", "massage", "salon"],
    "Jewellery": ["jewelry", "gold", "jewels", "ring", "necklace"],
    "Home Appliances": ["tv", "fridge", "electronics", "appliance", "furniture", "home"],
    "0% Easy Payment Plans": ["instalment", "installment", "epp", "easy payment", "0%"],
    "Autocare": ["car", "vehicle", "tyres", "tires", "service", "oil", "auto"],
  },

  /* -------------------------------------------------------------------
     6. TEXT SHOWN ON EVERY OFFER'S DETAIL VIEW
     (The Excel has no Terms column yet. If you add a "Terms" column,
     each offer's own terms are shown instead of this line.)
     ------------------------------------------------------------------- */
  TERMS_NOTE: "Conditions apply. Offer valid on DFCC Bank cards at the merchant listed, during the dates shown. For details, call the DFCC 24 Hour Contact Centre.",

  /* -------------------------------------------------------------------
     7. FOOTER (mandatory corporate details, per DFCC brand guidelines)
     PLEASE VERIFY the Fitch rating line is current before going live.
     Social links: paste the full web address. Leave "" to hide an icon.
     ------------------------------------------------------------------- */
  FOOTER: {
    contactLabel: "24 Hour Contact Centre",
    contactNumber: "0112 350000",
    website: "www.dfcc.lk",
    websiteUrl: "https://www.dfcc.lk",
    fitchLine: "Fitch Rating AA- (lka), Licensed Commercial Bank supervised by CBSL.",
    social: {
      facebook: "",
      twitter: "",
      linkedin: "",
      instagram: "",
      youtube: "",
    },
  },
};


/* =====================================================================
   DEMO CONFIG  —  only used when DEMO_MODE is "ON"
   ---------------------------------------------------------------------
   The demo runs on its own clock and loops forever:
       0s ─────────────── cycleDuration ──► RESET ──► 0s ...
   It never touches the real offers or the real date logic.

   All demo merchants below are FICTITIOUS names so no real business is
   shown with an offer it doesn't have. Categories must match a category
   image above so the demo cards get a picture.
   ===================================================================== */
window.DEMO_CONFIG = {

  cycleDuration: 120,      // seconds before the demo restarts

  showControls: true,      // small "Demo" button (bottom-left) with
                           // Pause / Restart / Speed. Press the D key
                           // to hide/show it during a presentation.

  alsoShowRealOffers: true, // true = the real Excel offers still appear
                            // in their correct sections (by real date)
                            // underneath the demo offers.

  endingSoonSeconds: 10,   // demo cards turn "ending soon" in the last N seconds

  /* LIVE TODAY OFFERS — timings are in SECONDS from the start of the cycle.
       startAfter: when the offer goes live   (0 = immediately)
       duration:   how long it stays live
     Before it starts it shows "STARTS IN", once live "ENDS IN",
     and when it hits zero it disappears — then everything resets.      */
  liveOffers: [
    { merchant: "Saffron & Salt Kitchen", category: "Dining",            credit: 40, debit: 30, location: "Colombo 03",  startAfter: 0,  duration: 30  },
    { merchant: "DailyFresh Market",      category: "Supermarkets",      credit: 25, debit: 20, location: "Colombo 05",  startAfter: 15, duration: 60  },
    { merchant: "Lotus Leaf Spa",         category: "Gift and Wellness", credit: 35, debit: 30, location: "Colombo 07",  startAfter: 45, duration: 50  },
    { merchant: "Skyline Getaways",       category: "Travel",            credit: 30, debit: 25, location: "Online",      startAfter: 70, duration: 45  },
    { merchant: "ByteBox Online",         category: "Online",            credit: 20, debit: 15, location: "Online",      startAfter: 0,  duration: 105 },
  ],

  /* UPCOMING DEMO OFFERS — fill Tomorrow / Next 3 Days / Next Week.
       startsInDays: 1 = tomorrow, 2 = the day after, ...
       startTime:    "HH:MM" (24-hour, Sri Lanka time)
       lastsDays:    how many days it runs                               */
  upcomingOffers: [
    { merchant: "Island Brew Café",     category: "Dining",          credit: 30, debit: 25, location: "Colombo 04", startsInDays: 1, startTime: "10:00", lastsDays: 2 },
    { merchant: "Coral Bay Retreat",    category: "Hotels",          credit: 35, debit: 25, location: "Bentota",    startsInDays: 1, startTime: "00:00", lastsDays: 5 },
    { merchant: "Goldleaf Jewellers",   category: "Jewellery",       credit: 25, debit: 20, location: "Colombo 06", startsInDays: 2, startTime: "09:00", lastsDays: 3 },
    { merchant: "HomeNest Electronics", category: "Home Appliances", credit: 30, debit: 25, location: "Colombo 03", startsInDays: 3, startTime: "08:30", lastsDays: 4 },
    { merchant: "MotorMate Service",    category: "Autocare",        credit: 20, debit: 15, location: "Colombo 10", startsInDays: 5, startTime: "08:00", lastsDays: 3 },
    { merchant: "Urban Cart",           category: "Online",          credit: 25, debit: 20, location: "Online",     startsInDays: 6, startTime: "00:00", lastsDays: 2 },
  ],
};
