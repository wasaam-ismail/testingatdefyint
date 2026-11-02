/* =====================================================================
   SAMPATH CARD OFFERS — "NEVER MISS AN OFFER"
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
  DEMO_MODE: "OFF",

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
    // 0% Instalment Plans
    "Abans": "abans.png",
    "Arpico Furniture": "",   // no logo yet: initials shown
    "BuyAbans": "buyabans.png",
    "Ceylon Furniture": "",   // no logo yet: initials shown
    "Damro": "damro.png",
    "Dinapala": "dinapala.png",
    "ESER International": "",   // no logo yet: initials shown
    "ESER Marketing Fitness": "",   // no logo yet: initials shown
    "GNEXT Store": "",   // no logo yet: initials shown
    "Hayleys Fentons": "",   // no logo yet: initials shown
    "Nisaco": "",   // no logo yet: initials shown
    "Palliyaguruge Jewellers": "",   // no logo yet: initials shown
    "Quantum Fitness": "",   // no logo yet: initials shown
    "Raja Jewellers": "raja-jewellers.png",
    "Rocell": "",   // no logo yet: initials shown
    "Seetha Holdings": "",   // no logo yet: initials shown
    "Singer": "singer.png",
    "Singer Mega": "singer-mega.png",
    "Singer.lk": "singer-lk.png",
    "Singhagiri": "singhagiri.png",
    "Vision Care": "",   // no logo yet: initials shown

    // Auto Care
    "Driveline": "driveline.png",
    "McLarens Lubricants": "mclarens-lubricants.png",
    "Sterling Aftercare": "sterling-aftercare.png",
    "Toyota Lanka": "toyota-lanka.png",

    // Baby & Kids
    "Cool Kidz": "cool-kidz.png",
    "Mikigans": "",   // no logo yet: initials shown
    "Nesh Kids": "",   // no logo yet: initials shown
    "Super Kids": "",   // no logo yet: initials shown
    "The Kids Warehouse": "",   // no logo yet: initials shown
    "Velona": "velona.png",

    // Dining
    "&Co Pub": "",   // no logo yet: initials shown
    "Adikted": "",   // no logo yet: initials shown
    "All Star Sports Lounge": "",   // no logo yet: initials shown
    "Bamboo Boy": "",   // no logo yet: initials shown
    "Baskin Robbins": "baskin-robbins.png",
    "Blooming Breakfast": "",   // no logo yet: initials shown
    "Blue Orbit": "",   // no logo yet: initials shown
    "Blue Water": "",   // no logo yet: initials shown
    "Burger King": "burger-king.png",
    "Burley's": "",   // no logo yet: initials shown
    "Cafe Brewtique": "",   // no logo yet: initials shown
    "Cafe Kinross": "",   // no logo yet: initials shown
    "Ceylon Curry Club": "",   // no logo yet: initials shown
    "Ceylon King": "",   // no logo yet: initials shown
    "Chambers": "",   // no logo yet: initials shown
    "Chinese Dragon": "",   // no logo yet: initials shown
    "Clerk 2 CEO": "",   // no logo yet: initials shown
    "Crystal Jade": "crystal-jade.png",
    "Delifrance": "",   // no logo yet: initials shown
    "Delizo": "",   // no logo yet: initials shown
    "Dilmah": "",   // no logo yet: initials shown
    "Diners Lounge": "",   // no logo yet: initials shown
    "Emperor's Den": "",   // no logo yet: initials shown
    "Galle Face Hotel": "",   // no logo yet: initials shown
    "Great Wall": "",   // no logo yet: initials shown
    "Harpos Pizza": "",   // no logo yet: initials shown
    "Hello Beirut": "",   // no logo yet: initials shown
    "Hotel Manoli": "",   // no logo yet: initials shown
    "Jade Restaurants": "",   // no logo yet: initials shown
    "Kandy Myst": "",   // no logo yet: initials shown
    "Kimono": "",   // no logo yet: initials shown
    "Kottu Lounge": "",   // no logo yet: initials shown
    "Lebanan Chef": "",   // no logo yet: initials shown
    "Maalu by Fresh Harvest": "",   // no logo yet: initials shown
    "Maniumpathy Hotel": "",   // no logo yet: initials shown
    "MaRadha Colombo": "",   // no logo yet: initials shown
    "Nagoya Japanese": "",   // no logo yet: initials shown
    "Navro Seafood": "",   // no logo yet: initials shown
    "One Ocean": "",   // no logo yet: initials shown
    "Popeyes": "",   // no logo yet: initials shown
    "Primo": "",   // no logo yet: initials shown
    "Pullman Colombo": "",   // no logo yet: initials shown
    "Radisson": "",   // no logo yet: initials shown
    "Ramada": "",   // no logo yet: initials shown
    "Red Orchids": "",   // no logo yet: initials shown
    "Siam House": "",   // no logo yet: initials shown
    "Steak House": "",   // no logo yet: initials shown
    "Street Burger": "",   // no logo yet: initials shown
    "Subway": "subway.png",
    "Thai Shack": "",   // no logo yet: initials shown
    "Via Torino": "",   // no logo yet: initials shown
    "Wide Eyes": "",   // no logo yet: initials shown
    "Yamato Japanese": "",   // no logo yet: initials shown

    // Extended Settlement Plans
    "Education institutes": "",   // no logo yet: initials shown
    "Hospitals": "",   // no logo yet: initials shown
    "Local insurance companies": "",   // no logo yet: initials shown
    "Selected auto care partners": "",   // no logo yet: initials shown
    "Selected travel agencies & airlines": "",   // no logo yet: initials shown

    // Eyewear & Hearing
    "Albert Edirisinghe Opticians Ltd": "albert-edirisinghe-opticians-ltd.png",
    "George Gooneratne Opticians": "george-gooneratne-opticians.png",
    "Lens Expert by George Gooneratne": "lens-expert-by-george-gooneratne.png",

    // Fashion & Retail
    "ADDRESS": "",   // no logo yet: initials shown
    "Adidas": "adidas.png",
    "Aditi Infinity": "aditi-infinity.png",
    "Ama Dress Point": "ama-dress-point.png",
    "Amanka": "amanka.png",
    "Amante": "",   // no logo yet: initials shown
    "Arielle": "",   // no logo yet: initials shown
    "Arienti": "",   // no logo yet: initials shown
    "Armani Exchange": "armani-exchange.png",
    "Arrow": "arrow.png",
    "ASB": "",   // no logo yet: initials shown
    "Asics": "asics.png",
    "Athukorala Textiles": "athukorala-textiles.png",
    "AVI": "avi.png",
    "Bayleee": "",   // no logo yet: initials shown
    "Be One": "be-one.png",
    "Bella Boutique": "bella-boutique.png",
    "Botex": "botex.png",
    "Calista Clothing": "",   // no logo yet: initials shown
    "Calvin Klein": "calvin-klein.png",
    "Ceylon City Mart": "",   // no logo yet: initials shown
    "Charles & Keith": "charles-and-keith.png",
    "Chenara Dodge": "",   // no logo yet: initials shown
    "CIB": "",   // no logo yet: initials shown
    "CIB Curtain": "",   // no logo yet: initials shown
    "COCO": "coco.png",
    "Colombo Outlet": "colombo-outlet.png",
    "Comfort Outlet": "comforton.png",
    "Cool Planet": "cool-planet.png",
    "Cotton Collection": "cotton-collection.png",
    "Cotton Island": "cotton-island.png",
    "Crocodile": "crocodile.png",
    "DBLAQ": "dblaq.png",
    "Deedat": "deedat.png",
    "Denim World": "denim-world.png",
    "Diliganz": "",   // no logo yet: initials shown
    "Dilly & Carlo": "",   // no logo yet: initials shown
    "Dirali": "",   // no logo yet: initials shown
    "Domingo's": "",   // no logo yet: initials shown
    "Double XL": "double-xl.png",
    "Dulansa": "",   // no logo yet: initials shown
    "EKKO": "ekko.png",
    "Emerald": "emerald.png",
    "Enuli Fashion": "enuli-fashion.png",
    "Envoy Mansion": "",   // no logo yet: initials shown
    "Fashion Bug": "",   // no logo yet: initials shown
    "Galis Lingerie": "galis-lingerie.png",
    "Gayan Inlook": "gayan-inlook.png",
    "GFLOCK": "",   // no logo yet: initials shown
    "Gift by NOLIMIT": "",   // no logo yet: initials shown
    "Giordano": "giordano.png",
    "Glory Swim shop": "",   // no logo yet: initials shown
    "H Sports": "",   // no logo yet: initials shown
    "Hameedia": "",   // no logo yet: initials shown
    "Handloom Gallery": "",   // no logo yet: initials shown
    "Happy World Fashion": "happy-world-fashion.png",
    "House Of Fashions": "",   // no logo yet: initials shown
    "House of Tailors": "",   // no logo yet: initials shown
    "Infinity": "infinity.png",
    "Jezza Fashion": "",   // no logo yet: initials shown
    "Jia Moda": "jia-moda.png",
    "Joey Clothing": "",   // no logo yet: initials shown
    "JUMP": "",   // no logo yet: initials shown
    "Junior Warehouse": "",   // no logo yet: initials shown
    "Kadapatha": "",   // no logo yet: initials shown
    "Kandygs Handlooms": "kandygs-handlooms.png",
    "Kathyusha Store": "kathyusha-store.png",
    "Kelly Felder": "kelly-felder.png",
    "Kingsman Perennial": "kingsman-perennial.png",
    "Kirsche Clothing": "kirsche-clothing.png",
    "Kreation House of Cotton": "kreation-house-of-cotton.png",
    "La Vivente": "la-vivente.png",
    "Leads": "leads.png",
    "Leather Collection": "",   // no logo yet: initials shown
    "Level Outfitters": "level-outfitters.png",
    "Levi’s": "levis.png",
    "LIBERA": "libera.png",
    "Lida Fashion": "lida-fashion.png",
    "Live & Kicking": "live-and-kicking.png",
    "Luv SL": "luv-sl.png",
    "Mags": "",   // no logo yet: initials shown
    "MAM Fashion": "mam-fashion.png",
    "Mango": "mango.png",
    "Mathara Traders": "",   // no logo yet: initials shown
    "Midnightdivas": "midnightdivas.png",
    "Miika": "miika.png",
    "Mimosa": "",   // no logo yet: initials shown
    "Molly Fashion Circle": "molly-fashion-circle.png",
    "MONDY": "mondy.png",
    "Moonstone": "moonstone.png",
    "Moose": "moose.png",
    "MYC Clothing": "myc-clothing.png",
    "Nadiyas Textile": "nadiyas-textile.png",
    "Nick Nack": "nick-nack.png",
    "Nils": "nils.png",
    "Nithijaya Sarees & Clothing": "",   // no logo yet: initials shown
    "NOLIMIT": "",   // no logo yet: initials shown
    "ODEL": "odel.png",
    "ODEL Brands Outlet Store": "odel-brands-outlet-store.png",
    "ODEL Sports": "odel-sports.png",
    "Outfit": "",   // no logo yet: initials shown
    "Pippin": "pippin.png",
    "Piyarathna Tex": "",   // no logo yet: initials shown
    "Puma": "puma.png",
    "Redvers Buller": "redvers-buller.png",
    "Rich Look": "rich-look.png",
    "RV Fashion": "",   // no logo yet: initials shown
    "Sale House": "",   // no logo yet: initials shown
    "Samagi Tex": "samagi-tex.png",
    "Samanmal": "",   // no logo yet: initials shown
    "Samsonite": "samsonite.png",
    "Sarathchandra Textiles": "sarathchandra-textiles.png",
    "Saree Mandir": "",   // no logo yet: initials shown
    "Scylla Zelus": "scylla-zelus.png",
    "Shopimo": "",   // no logo yet: initials shown
    "Signature": "",   // no logo yet: initials shown
    "Sirasa Garments": "",   // no logo yet: initials shown
    "Sona Mandhir": "sona-mandhir.png",
    "Spring & Summer": "",   // no logo yet: initials shown
    "Sriyani Dress Point": "",   // no logo yet: initials shown
    "Sting": "sting.png",
    "STREET82": "street82.png",
    "SWX": "swx.png",
    "TAVY Elegance": "tavy-elegance.png",
    "The Bella Clothing Gallery": "the-bella-clothing-gallery.png",
    "The Brands Warehouse": "",   // no logo yet: initials shown
    "The Cult Original": "the-cult-original.png",
    "The Factory Outlet": "",   // no logo yet: initials shown
    "The Vanta Studios": "",   // no logo yet: initials shown
    "Thilakma City": "",   // no logo yet: initials shown
    "Thirteen Thirtyone": "thirteen-thirtyone.png",
    "Timy": "timy.png",
    "Tiyana Big City": "",   // no logo yet: initials shown
    "Tiyana Fashion": "",   // no logo yet: initials shown
    "TKS Fashion": "tks-fashion.png",
    "TOFO": "",   // no logo yet: initials shown
    "Tommy Hilfiger": "tommy-hilfiger.png",
    "Tropic Of Linen": "",   // no logo yet: initials shown
    "US Polo Assn.": "us-polo-assn.png",
    "Waves": "waves.png",
    "Wijaya Saree Mandir": "",   // no logo yet: initials shown
    "Winmart": "winmart.png",
    "Yaliz": "yaliz.png",
    "Yarn & Darn": "",   // no logo yet: initials shown
    "ZIE Fashion": "zie-fashion.png",
    "ZigZag": "",   // no logo yet: initials shown

    // Footwear
    "Birkenstock": "birkenstock.png",
    "DSI": "dsi.png",
    "DSI Premier": "dsi-premier.png",
    "Genelle": "",   // no logo yet: initials shown
    "Tony Pellé": "tony-pell.png",

    // Gifts, Wellness & Watches
    "D'las International": "",   // no logo yet: initials shown
    "House of Gifts": "house-of-gifts.png",
    "PG Martin": "pg-martin.png",
    "ScentsOn": "scentson.png",
    "Wimaladharma & Sons": "",   // no logo yet: initials shown
    "Wimaladharma Brothers": "wimaladharma-brothers.png",

    // Home Care
    "Aquafresh": "aquafresh.png",
    "Celcius": "celcius.png",
    "Centrepoint Homes": "",   // no logo yet: initials shown
    "Comfort World": "",   // no logo yet: initials shown
    "Dankotuwa Porcelain": "",   // no logo yet: initials shown
    "Dilshan Drapers": "",   // no logo yet: initials shown
    "Elegant Charms": "elegant-charms.png",
    "Homemart": "homemart.png",
    "Lalanka Water": "lalanka-water.png",
    "Nisaco Mall": "",   // no logo yet: initials shown

    // Jewellery
    "Alankara Jewellery": "alankara-jewellery.png",
    "Aminra Jewellers": "aminra-jewellers.png",
    "Bullion Exchange": "",   // no logo yet: initials shown
    "Chamathka Jewellers": "",   // no logo yet: initials shown
    "Diamond Dreams": "diamond-dreams.png",
    "GMA De Silva Jewellers": "",   // no logo yet: initials shown
    "Mallika Hemachandra Jewellers": "",   // no logo yet: initials shown
    "Premadasa & Co Jewellery": "",   // no logo yet: initials shown
    "Pure Gold by Tiesh": "",   // no logo yet: initials shown
    "Raddella Jewellers": "raddella-jewellers.png",
    "Vogue Jewellers": "",   // no logo yet: initials shown

    // Online
    "Atlas": "atlas.png",
    "Cargills Online": "cargills-online.png",
    "DSI / Footcandy": "dsi-footcandy.png",
    "Galleria Milano": "",   // no logo yet: initials shown
    "Harriet": "",   // no logo yet: initials shown
    "Hemas eStore": "hemas-estore.png",
    "KA Sports": "ka-sports.png",
    "Lassana Flora": "",   // no logo yet: initials shown
    "Mabroc Teas": "",   // no logo yet: initials shown
    "Mintpay": "",   // no logo yet: initials shown
    "Nesh": "",   // no logo yet: initials shown
    "Ting": "",   // no logo yet: initials shown
    "Tudo": "",   // no logo yet: initials shown
    "Wishque": "",   // no logo yet: initials shown

    // Sports
    "Wilson": "wilson.png",

    // Supermarkets
    "Cargills": "cargills.png",
    "Glomark": "glomark.png",
    "Keells": "keells.png",
    "LAUGFS": "laugfs.png",
    "SPAR": "spar.png",

    // Travel & Leisure
    "Crazy Jets": "",   // no logo yet: initials shown
    "Dufry Duty Free": "",   // no logo yet: initials shown
    "FindMyFare": "findmyfare.png",
    "Pearl Bay": "",   // no logo yet: initials shown
  },

  /* -------------------------------------------------------------------
     4. CATEGORY IMAGES   (files live in: assets/categories/)
     Same idea as logos: listed here first, otherwise the site looks for
     a file named exactly like the category, e.g. "Dining.jpg".
     Categories themselves come from the Excel automatically.
     ------------------------------------------------------------------- */
  CATEGORY_IMAGES: {
    "Fashion & Retail": "",                // no image yet: brand colour shown
    "Gifts, Wellness & Watches": "GiftWellness.jpg",
    "Footwear": "",                        // no image yet
    "Online": "Online.jpg",
    "Eyewear & Hearing": "",               // no image yet
    "Baby & Kids": "",                     // no image yet
    "Home Care": "HomeAppliances.jpg",
    "0% Instalment Plans": "EasyPaymentPlans.jpg",
    "Extended Settlement Plans": "",       // no image yet
    "Auto Care": "Autocare.jpg",
    "Travel & Leisure": "Travel.jpg",
    "Sports": "",                          // no image yet
    "Supermarkets": "Supermarkets.jpg",
    "Jewellery": "Jewellery.jpg",
    "Dining": "Dining.jpg",
  },

  /* -------------------------------------------------------------------
     5. SEARCH HELPERS
     Extra words that should find a category. Example: searching "pizza"
     shows Dining offers. Add words freely.
     ------------------------------------------------------------------- */
  SEARCH_SYNONYMS: {
    "Dining": ["restaurant", "food", "eat", "dinner", "lunch", "pizza", "burger", "cafe", "coffee", "ice cream", "dessert", "bar", "pub", "buffet"],
    "Supermarkets": ["grocery", "groceries", "supermarket", "food"],
    "Fashion & Retail": ["clothes", "clothing", "fashion", "dress", "saree", "shirt", "shopping", "apparel", "boutique"],
    "Footwear": ["shoes", "sandals", "slippers", "sneakers", "boots"],
    "Eyewear & Hearing": ["glasses", "spectacles", "sunglasses", "optician", "lens", "hearing aid", "eye"],
    "Baby & Kids": ["baby", "kids", "children", "toys", "school"],
    "Sports": ["sport", "gym", "fitness", "cricket", "running"],
    "Travel & Leisure": ["travel", "flight", "tour", "holiday", "air", "trip", "hotel", "duty free", "airport"],
    "Online": ["online", "e-commerce", "delivery", "web", "shop online", "app", "promo code"],
    "Gifts, Wellness & Watches": ["spa", "wellness", "gift", "beauty", "massage", "salon", "watch", "watches", "perfume"],
    "Jewellery": ["jewelry", "gold", "jewels", "ring", "necklace", "diamond"],
    "Home Care": ["home", "furniture", "kitchen", "bed", "mattress", "decor"],
    "0% Instalment Plans": ["instalment", "installment", "epp", "easy payment", "0%", "tv", "fridge", "electronics", "appliance", "furniture", "phone"],
    "Extended Settlement Plans": ["esp", "settlement", "instalment", "installment", "school fees", "insurance", "hospital", "0%"],
    "Auto Care": ["car", "vehicle", "tyres", "tires", "service", "oil", "auto", "battery"],
  },

  /* -------------------------------------------------------------------
     6. TEXT SHOWN ON EVERY OFFER'S DETAIL VIEW
     (If an offer has its own text in the Excel "Terms" column, that is
     shown instead of this line.)
     ------------------------------------------------------------------- */
  TERMS_NOTE: "Conditions apply. Offer valid on Sampath Bank cards at the merchant listed, during the dates shown. For details, call Sampath Bank.",

  /* -------------------------------------------------------------------
     7. FOOTER (corporate details)
     PLEASE VERIFY the Fitch rating line is current before going live.
     Social links: paste the full web address. Leave "" to hide an icon.
     ------------------------------------------------------------------- */
  FOOTER: {
    contactLabel: "24 Hour Hotline",
    contactNumber: "011 2 303050",
    website: "www.sampath.lk",
    websiteUrl: "https://www.sampath.lk",
    fitchLine: "Fitch Rating AA-(lka), Licensed Commercial Bank supervised by CBSL.",
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

  /* MAP BUTTON: demo merchants are made up, so their Map / Get directions
     button opens a Google Maps search of their "location" (Online ones open
     Colombo). To use a specific link instead, add  maps: "https://..."  to
     that offer's line below.

     LIVE TODAY OFFERS — timings are in SECONDS from the start of the cycle.
       startAfter: when the offer goes live   (0 = immediately)
       duration:   how long it stays live
     Before it starts it shows "STARTS IN", once live "ENDS IN",
     and when it hits zero it disappears — then everything resets.      */
  liveOffers: [
    { merchant: "Saffron & Salt Kitchen", category: "Dining",            credit: 40, debit: 30, location: "Colombo 03",  startAfter: 0,  duration: 30  },
    { merchant: "DailyFresh Market",      category: "Supermarkets",      credit: 25, debit: 20, location: "Colombo 05",  startAfter: 15, duration: 60  },
    { merchant: "Lotus Leaf Spa",         category: "Gifts, Wellness & Watches", credit: 35, debit: 30, location: "Colombo 07",  startAfter: 45, duration: 50  },
    { merchant: "Skyline Getaways",       category: "Travel & Leisure",          credit: 30, debit: 25, location: "Online",      startAfter: 70, duration: 45  },
    { merchant: "ByteBox Online",         category: "Online",            credit: 20, debit: 15, location: "Online",      startAfter: 0,  duration: 105 },
  ],

  /* UPCOMING DEMO OFFERS — fill Tomorrow / Next 3 Days / Next Week.
       startsInDays: 1 = tomorrow, 2 = the day after, ...
       startTime:    "HH:MM" (24-hour, Sri Lanka time)
       lastsDays:    how many days it runs                               */
  upcomingOffers: [
    { merchant: "Island Brew Café",     category: "Dining",          credit: 30, debit: 25, location: "Colombo 04", startsInDays: 1, startTime: "10:00", lastsDays: 2 },
    { merchant: "Coral Bay Retreat",    category: "Travel & Leisure",        credit: 35, debit: 25, location: "Bentota",    startsInDays: 1, startTime: "00:00", lastsDays: 5 },
    { merchant: "Goldleaf Jewellers",   category: "Jewellery",       credit: 25, debit: 20, location: "Colombo 06", startsInDays: 2, startTime: "09:00", lastsDays: 3 },
    { merchant: "HomeNest Electronics", category: "Home Care", credit: 30, debit: 25, location: "Colombo 03", startsInDays: 3, startTime: "08:30", lastsDays: 4 },
    { merchant: "MotorMate Service",    category: "Auto Care",        credit: 20, debit: 15, location: "Colombo 10", startsInDays: 5, startTime: "08:00", lastsDays: 3 },
    { merchant: "Urban Cart",           category: "Online",          credit: 25, debit: 20, location: "Online",     startsInDays: 6, startTime: "00:00", lastsDays: 2 },
  ],
};
