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
    "Arpico Furniture": "arpico-furniture.png",
    "BuyAbans": "buyabans.png",
    "Ceylon Furniture": "ceylon-furniture.png",
    "Damro": "damro.png",
    "Dinapala": "dinapala.png",
    "ESER International": "eser-international.png",
    "ESER Marketing Fitness": "eser-marketing-fitness.png",
    "GNEXT Store": "gnext-store.png",
    "Hayleys Fentons": "hayleys-fentons.png",
    "Nisaco": "",   // no logo yet: initials shown
    "Palliyaguruge Jewellers": "",   // no logo yet: initials shown
    "Quantum Fitness": "",   // no logo yet: initials shown
    "Raja Jewellers": "raja-jewellers.png",
    "Rocell": "rocell.png",
    "Seetha Holdings": "seetha-holdings.png",
    "Singer": "singer.png",
    "Singer Mega": "singer-mega.png",
    "Singer.lk": "singer-lk.png",
    "Singhagiri": "singhagiri.png",
    "Vision Care": "vision-care.png",

    // Auto Care
    "Driveline": "driveline.png",
    "McLarens Lubricants": "mclarens-lubricants.png",
    "Sterling Aftercare": "sterling-aftercare.png",
    "Toyota Lanka": "toyota-lanka.png",

    // Baby & Kids
    "Cool Kidz": "cool-kidz.png",
    "Mikigans": "",   // no logo yet: initials shown
    "Nesh Kids": "nesh-kids.png",
    "Super Kids": "",   // no logo yet: initials shown
    "The Kids Warehouse": "",   // no logo yet: initials shown
    "Velona": "velona.png",

    // Dining
    "&Co Pub": "",   // no logo yet: initials shown
    "Adikted": "",   // no logo yet: initials shown
    "All Star Sports Lounge": "all-star-sports-lounge.png",
    "Bamboo Boy": "bamboo-boy.png",
    "Baskin Robbins": "baskin-robbins.png",
    "Blooming Breakfast": "blooming-breakfast.png",
    "Blue Orbit": "",   // no logo yet: initials shown
    "Blue Water": "",   // no logo yet: initials shown
    "Burger King": "burger-king.png",
    "Burley's": "",   // no logo yet: initials shown
    "Cafe Brewtique": "",   // no logo yet: initials shown
    "Cafe Kinross": "",   // no logo yet: initials shown
    "Ceylon Curry Club": "",   // no logo yet: initials shown
    "Ceylon King": "",   // no logo yet: initials shown
    "Chambers": "",   // no logo yet: initials shown
    "Chinese Dragon": "chinese-dragon.png",
    "Clerk 2 CEO": "clerk-2-ceo.png",
    "Crystal Jade": "crystal-jade.png",
    "Delifrance": "",   // no logo yet: initials shown
    "Delizo": "delizo.png",
    "Dilmah": "",   // no logo yet: initials shown
    "Diners Lounge": "",   // no logo yet: initials shown
    "Emperor's Den": "emperors-den.png",
    "Galle Face Hotel": "galle-face-hotel.png",
    "Great Wall": "",   // no logo yet: initials shown
    "Harpos Pizza": "harpos-pizza.png",
    "Hello Beirut": "",   // no logo yet: initials shown
    "Hotel Manoli": "",   // no logo yet: initials shown
    "Jade Restaurants": "",   // no logo yet: initials shown
    "Kandy Myst": "",   // no logo yet: initials shown
    "Kimono": "",   // no logo yet: initials shown
    "Kottu Lounge": "",   // no logo yet: initials shown
    "Lebanan Chef": "",   // no logo yet: initials shown
    "Maalu by Fresh Harvest": "",   // no logo yet: initials shown
    "Maniumpathy Hotel": "maniumpathy-hotel.png",
    "MaRadha Colombo": "maradha-colombo.png",
    "Nagoya Japanese": "nagoya-japanese.png",
    "Navro Seafood": "navro-seafood.png",
    "One Ocean": "",   // no logo yet: initials shown
    "Popeyes": "popeyes.png",
    "Primo": "",   // no logo yet: initials shown
    "Pullman Colombo": "pullman-colombo.png",
    "Radisson": "",   // no logo yet: initials shown
    "Ramada": "ramada.png",
    "Red Orchids": "",   // no logo yet: initials shown
    "Siam House": "",   // no logo yet: initials shown
    "Steak House": "",   // no logo yet: initials shown
    "Street Burger": "street-burger.png",
    "Subway": "subway.png",
    "Thai Shack": "thai-shack.png",
    "Via Torino": "via-torino.png",
    "Wide Eyes": "",   // no logo yet: initials shown
    "Yamato Japanese": "yamato-japanese.png",

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
    "ADDRESS": "address.png",
    "Adidas": "adidas.png",
    "Aditi Infinity": "aditi-infinity.png",
    "Ama Dress Point": "ama-dress-point.png",
    "Amanka": "amanka.png",
    "Amante": "amante.png",
    "Arielle": "arielle.png",
    "Arienti": "arienti.png",
    "Armani Exchange": "armani-exchange.png",
    "Arrow": "arrow.png",
    "ASB": "asb.png",
    "Asics": "asics.png",
    "Athukorala Textiles": "athukorala-textiles.png",
    "AVI": "avi.png",
    "Bayleee": "bayleee.png",
    "Be One": "be-one.png",
    "Bella Boutique": "bella-boutique.png",
    "Botex": "botex.png",
    "Calista Clothing": "calista-clothing.png",
    "Calvin Klein": "calvin-klein.png",
    "Ceylon City Mart": "ceylon-city-mart.png",
    "Charles & Keith": "charles-and-keith.png",
    "Chenara Dodge": "chenara-dodge.png",
    "CIB": "cib.png",
    "CIB Curtain": "cib-curtain.png",
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
    "Diliganz": "diliganz.png",
    "Dilly & Carlo": "dilly-and-carlo.png",
    "Dirali": "dirali.png",
    "Domingo's": "domingos.png",
    "Double XL": "double-xl.png",
    "Dulansa": "",   // no logo yet: initials shown
    "EKKO": "ekko.png",
    "Emerald": "emerald.png",
    "Enuli Fashion": "enuli-fashion.png",
    "Envoy Mansion": "",   // no logo yet: initials shown
    "Fashion Bug": "fashion-bug.png",
    "Galis Lingerie": "galis-lingerie.png",
    "Gayan Inlook": "gayan-inlook.png",
    "GFLOCK": "gflock.png",
    "Gift by NOLIMIT": "gift-by-nolimit.png",
    "Giordano": "giordano.png",
    "Glory Swim shop": "glory-swim-shop.png",
    "H Sports": "",   // no logo yet: initials shown
    "Hameedia": "hameedia.png",
    "Handloom Gallery": "handloom-gallery.png",
    "Happy World Fashion": "happy-world-fashion.png",
    "House Of Fashions": "house-of-fashions.png",
    "House of Tailors": "",   // no logo yet: initials shown
    "Infinity": "infinity.png",
    "Jezza Fashion": "jezza-fashion.png",
    "Jia Moda": "jia-moda.png",
    "Joey Clothing": "joey-clothing.png",
    "JUMP": "jump.png",
    "Junior Warehouse": "",   // no logo yet: initials shown
    "Kadapatha": "kadapatha.png",
    "Kandygs Handlooms": "kandygs-handlooms.png",
    "Kathyusha Store": "kathyusha-store.png",
    "Kelly Felder": "kelly-felder.png",
    "Kingsman Perennial": "kingsman-perennial.png",
    "Kirsche Clothing": "kirsche-clothing.png",
    "Kreation House of Cotton": "kreation-house-of-cotton.png",
    "La Vivente": "la-vivente.png",
    "Leads": "leads.png",
    "Leather Collection": "leather-collection.png",
    "Level Outfitters": "level-outfitters.png",
    "Levi’s": "levis.png",
    "LIBERA": "libera.png",
    "Lida Fashion": "lida-fashion.png",
    "Live & Kicking": "live-and-kicking.png",
    "Luv SL": "luv-sl.png",
    "Mags": "mags.png",
    "MAM Fashion": "mam-fashion.png",
    "Mango": "mango.png",
    "Mathara Traders": "",   // no logo yet: initials shown
    "Midnightdivas": "midnightdivas.png",
    "Miika": "miika.png",
    "Mimosa": "mimosa.png",
    "Molly Fashion Circle": "molly-fashion-circle.png",
    "MONDY": "mondy.png",
    "Moonstone": "moonstone.png",
    "Moose": "moose.png",
    "MYC Clothing": "myc-clothing.png",
    "Nadiyas Textile": "nadiyas-textile.png",
    "Nick Nack": "nick-nack.png",
    "Nils": "nils.png",
    "Nithijaya Sarees & Clothing": "",   // no logo yet: initials shown
    "NOLIMIT": "nolimit.png",
    "ODEL": "odel.png",
    "ODEL Brands Outlet Store": "odel-brands-outlet-store.png",
    "ODEL Sports": "odel-sports.png",
    "Outfit": "outfit.png",
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
    "Signature": "signature.png",
    "Sirasa Garments": "",   // no logo yet: initials shown
    "Sona Mandhir": "sona-mandhir.png",
    "Spring & Summer": "spring-and-summer.png",
    "Sriyani Dress Point": "sriyani-dress-point.png",
    "Sting": "sting.png",
    "STREET82": "street82.png",
    "SWX": "swx.png",
    "TAVY Elegance": "tavy-elegance.png",
    "The Bella Clothing Gallery": "the-bella-clothing-gallery.png",
    "The Brands Warehouse": "",   // no logo yet: initials shown
    "The Cult Original": "the-cult-original.png",
    "The Factory Outlet": "the-factory-outlet.png",
    "The Vanta Studios": "",   // no logo yet: initials shown
    "Thilakma City": "thilakma-city.png",
    "Thirteen Thirtyone": "thirteen-thirtyone.png",
    "Timy": "timy.png",
    "Tiyana Big City": "",   // no logo yet: initials shown
    "Tiyana Fashion": "",   // no logo yet: initials shown
    "TKS Fashion": "tks-fashion.png",
    "TOFO": "",   // no logo yet: initials shown
    "Tommy Hilfiger": "tommy-hilfiger.png",
    "Tropic Of Linen": "tropic-of-linen.png",
    "US Polo Assn.": "us-polo-assn.png",
    "Waves": "waves.png",
    "Wijaya Saree Mandir": "wijaya-saree-mandir.png",
    "Winmart": "winmart.png",
    "Yaliz": "yaliz.png",
    "Yarn & Darn": "yarn-and-darn.png",
    "ZIE Fashion": "zie-fashion.png",
    "ZigZag": "zigzag.png",

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
    "Centrepoint Homes": "centrepoint-homes.png",
    "Comfort World": "comfort-world.png",
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
    "Vogue Jewellers": "vogue-jewellers.png",

    // Online
    "Atlas": "atlas.png",
    "Cargills Online": "cargills-online.png",
    "DSI / Footcandy": "dsi-footcandy.png",
    "Galleria Milano": "galleria-milano.png",
    "Harriet": "harriet.png",
    "Hemas eStore": "hemas-estore.png",
    "KA Sports": "ka-sports.png",
    "Lassana Flora": "lassana-flora.png",
    "Mabroc Teas": "mabroc-teas.png",
    "Mintpay": "mintpay.png",
    "Nesh": "nesh.png",
    "Ting": "ting.png",
    "Tudo": "tudo.png",
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
    "Dufry Duty Free": "dufry-duty-free.png",
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
    "Fashion & Retail": "FashionRetail.jpg",
    "Gifts, Wellness & Watches": "GiftWellness.jpg",
    "Footwear": "Footwear.jpg",
    "Online": "Online.jpg",
    "Eyewear & Hearing": "Eyewear.jpg",
    "Baby & Kids": "BabyKids.jpg",
    "Home Care": "HomeAppliances.jpg",
    "0% Instalment Plans": "EasyPaymentPlans.jpg",
    "Extended Settlement Plans": "SettlementPlans.jpg",
    "Auto Care": "Autocare.jpg",
    "Travel & Leisure": "Travel.jpg",
    "Sports": "Sports.jpg",
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

  /* -------------------------------------------------------------------
     8. GOOGLE TAG, REMARKETING AND COOKIE CONSENT
     Paste the IDs Sampath's digital team gives you. Leave "" to switch
     a tag off. Nothing is loaded until a visitor clicks "Accept all" on
     the cookie banner.
       GA4_ID          Google Analytics 4 measurement ID, e.g. "G-ABC123XYZ"
       GOOGLE_ADS_ID   Google Ads tag ID for remarketing, e.g. "AW-123456789"
       GTM_ID          only if they manage tags in Google Tag Manager,
                       e.g. "GTM-ABCD123" (then GA4/Ads can be left "")
     CONSENT_BANNER: "AUTO" = show the banner only when an ID is set,
                     "ON" = always show it, "OFF" = never.
     Every category and offer has its own web address, and each page
     view is sent with the offer category and merchant, so audiences can
     be built per category and per offer. See README → "Tracking".
     ------------------------------------------------------------------- */
  ANALYTICS: {
    GA4_ID: "",
    GOOGLE_ADS_ID: "",
    GTM_ID: "",
    CONSENT_BANNER: "ON",
    PRIVACY_POLICY_URL: "https://www.sampath.lk",   // CHECK: replace with Sampath's privacy policy page
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
