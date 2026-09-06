export type Currency = {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  buy: number;
  sell: number;
};

export const CURRENCIES: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸", buy: 95.45, sell: 96.69 },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺", buy: 110.7, sell: 112.75 },
  { code: "GBP", name: "Pound Sterling", symbol: "£", flag: "🇬🇧", buy: 129.5, sell: 131.9 },
  { code: "THB", name: "Thai Bhat", symbol: "฿", flag: "🇹🇭", buy: 2.915, sell: 2.997 },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", flag: "🇸🇦", buy: 25.2, sell: 25.7 },
  { code: "AED", name: "Dubai Dirham", symbol: "د.إ", flag: "🇦🇪", buy: 25.95, sell: 26.55 },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾", buy: 23.3, sell: 24.5 },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬", buy: 74.5, sell: 76.1 },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩", buy: 0.0053, sell: 0.00587 },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳", buy: 14.11, sell: 14.95 },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", flag: "🇻🇳", buy: 0.00355, sell: 0.00388 },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦", buy: 68.5, sell: 69.95 },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "🇹🇷", buy: 1.8, sell: 2.14 },
  { code: "RUB", name: "Russian Rubles", symbol: "₽", flag: "🇷🇺", buy: 1.18, sell: 1.45 },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰", buy: 11.95, sell: 12.75 },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs", flag: "🇱🇰", buy: 0.28, sell: 0.335 },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭", buy: 117.0, sell: 121.8 },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵", buy: 0.595, sell: 0.618 },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£", flag: "🇪🇬", buy: 1.84, sell: 2.14 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺", buy: 67.5, sell: 69.0 },
];

export const COMPANY = {
  name: "Kirat Forex Pvt. Ltd.",
  shortName: "Kirat Forex",
  tagline: "Currency Exchange at Murshidabad",
  cin: "U67100WB2017PTC222041",
  email: "info@kiratforex.com",
  registered: {
    label: "Register Office",
    address: "Khidirpur colony, Baruipara, Hariharpara, Murshidabad, West Bengal, Pin: 742165",
    phone: "+91 9735739396",
    tel: "+919735739396",
  },
  branch: {
    label: "Branch Office",
    address:
      "11/9 K. K. Banerjee Road, PO - Berhampore, Dist - Murshidabad, W.B - 742101, Near Gora Bazar YAMAHA Showroom",
    phone: "+91 97339 24696",
    tel: "+919733924696",
  },
};

export const HIGHLIGHTS = [
  { title: "Safe and secure", sub: "transactions", icon: "shield" },
  { title: "Best rates", sub: "guaranteed", icon: "trending" },
  { title: "Doorstep delivery", sub: "available", icon: "truck" },
  { title: "Pay a small amount", sub: "now to lock in rates", icon: "lock" },
];

export const SERVICES = [
  {
    slug: "foreign-currencies",
    title: "Foreign Currencies",
    body: "A foreign currency is the currency used by a foreign country as its recognized form of monetary exchange. We buy & sell foreign currencies at highly competitive rates within the limits and regulations prescribed by RBI.",
    points: ["20+ currencies in stock", "RBI compliant limits", "Small denominations on request"],
  },
  {
    slug: "travellers-cheques",
    title: "Travellers Cheques",
    body: "A traveller's cheque is a medium of exchange that can be used in place of hard currency. We buy Travellers Cheques of all major currencies like USD, EURO, CHF, CAD, GBP and JPY.",
    points: ["All major currencies", "Instant encashment", "Loss protected"],
  },
  {
    slug: "forex-cards",
    title: "Forex Cards",
    body: "Forex Cards offer a safe and easy way to carry foreign currency on your travel abroad — ensuring that you are not inconvenienced on foreign shores. Available as single currency and multicurrency cards.",
    points: ["Single & multicurrency", "Reloadable abroad", "Zero cross-currency markup"],
  },
];

export const DUAL_SERVICES = [
  {
    title: "Currency Exchange",
    body: "If you are looking for foreign exchange solutions or a forex travel card, then you have landed at the right place. Travel hassle-free and collect memories that will last a lifetime, while we take care of all your foreign exchange requirements.",
    points: [
      "Rates are updated every 10 minutes",
      "Convenient multi-currency card",
      "Check free live currency rates",
    ],
  },
  {
    title: "Money Transfer",
    body: "Fast. Safe. Guaranteed. Learn why millions of people trust Money Transfer with their hard-earned money. Compare and save to get low fees and great exchange rates on international inward money transfers to 165+ countries.",
    points: [
      "Excellent rates",
      "Multiple receiving options",
      "Extensive network",
      "Send money instantly",
    ],
  },
];

export const STATS = [
  { value: 10000, suffix: "+", label: "Happy Customers" },
  { value: 20000, suffix: "", label: "Transactions" },
  { value: 5, suffix: "K+", label: "Reviews" },
  { value: 165, suffix: "+", label: "Countries Covered" },
];

export const TESTIMONIALS = [
  {
    stars: 5,
    quote:
      "Kirat Forex made my Hajj journey worry-free. They provided Saudi Riyals in small denominations which was very helpful. The staff understood the specific needs of Hajj pilgrims.",
    name: "Md. S. Alam",
    place: "Jangipur, Murshidabad",
  },
  {
    stars: 5,
    quote:
      "I used Kirat Forex for my Umrah trip last year. They provided Saudi Riyals at the best rate and even guided me on how much currency to carry. Professional service with a personal touch.",
    name: "Md. A. Hossain",
    place: "Kandi, Murshidabad",
  },
  {
    stars: 5,
    quote:
      "I was worried about carrying cash for my first solo trip to Europe. The prepaid travel card was a lifesaver. It worked everywhere from small cafes in Paris to train stations in Berlin.",
    name: "Dr. A. Latib",
    place: "Murshidabad, WB",
  },
  {
    stars: 5,
    quote:
      "We needed foreign currency urgently for our family vacation to Thailand. The team arranged everything within hours and delivered to our home. Compassionate and efficient service.",
    name: "Mrs. S. Chatterjee",
    place: "Baharampur, Murshidabad",
  },
  {
    stars: 5,
    quote:
      "This was my first international trip and I was nervous about handling foreign currency. The team explained everything patiently — from travel card to cash limits.",
    name: "P. Dey",
    place: "Lalbagh, Murshidabad",
  },
  {
    stars: 4,
    quote:
      "Availed forex services for official government travel abroad. The documentation was handled properly, and all RBI compliance was followed. Reliable and authorized service in Murshidabad.",
    name: "Dr. S. Mukherjee",
    place: "Berhampore, Murshidabad",
  },
  {
    stars: 5,
    quote:
      "We had family visiting from UK for a wedding. Kirat Forex arranged pound sterling with perfect denominations. The guests were very happy with the service. Highly professional.",
    name: "T. Mukherjee",
    place: "Beldanga, Murshidabad",
  },
  {
    stars: 5,
    quote:
      "Got Dirhams for our Dubai trip at a much better rate than the airport. The doorstep delivery was prompt and staff was very courteous. Will definitely use Kirat Forex again.",
    name: "F. Rahman",
    place: "Baharampur, Murshidabad",
  },
  {
    stars: 5,
    quote:
      "Relocating to Germany for work required careful forex planning. Kirat Forex helped me with currency, travel card, and all documentation. Complete support from start to finish.",
    name: "R. Das",
    place: "Murshidabad | Now in Berlin",
  },
];

export const RATE_UPDATED = "2026-08-25 12:20:49 PM";
