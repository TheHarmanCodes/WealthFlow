import * as Localization from "expo-localization";

export interface CurrencyItem {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  countries: string;
  popular?: boolean;
}

export const CURRENCIES: CurrencyItem[] = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸", countries: "United States", popular: true },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳", countries: "India", popular: true },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺", countries: "Eurozone, Germany, France, Italy, Spain", popular: true },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧", countries: "United Kingdom", popular: true },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$", flag: "🇨🇦", countries: "Canada", popular: true },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺", countries: "Australia", popular: true },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵", countries: "Japan", popular: true },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪", countries: "United Arab Emirates" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬", countries: "Singapore" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭", countries: "Switzerland, Liechtenstein" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳", countries: "China" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰", countries: "Hong Kong" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", flag: "🇳🇿", countries: "New Zealand" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", flag: "🇸🇦", countries: "Saudi Arabia" },
  { code: "QAR", name: "Qatari Riyal", symbol: "﷼", flag: "🇶🇦", countries: "Qatar" },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك", flag: "🇰🇼", countries: "Kuwait" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷", countries: "South Korea" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾", countries: "Malaysia" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩", countries: "Indonesia" },
  { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭", countries: "Thailand" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", flag: "🇵🇭", countries: "Philippines" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", flag: "🇻🇳", countries: "Vietnam" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨", flag: "🇵🇰", countries: "Pakistan" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", flag: "🇧🇩", countries: "Bangladesh" },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs", flag: "🇱🇰", countries: "Sri Lanka" },
  { code: "NPR", name: "Nepalese Rupee", symbol: "रू", flag: "🇳🇵", countries: "Nepal" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷", countries: "Brazil" },
  { code: "MXN", name: "Mexican Peso", symbol: "MX$", flag: "🇲🇽", countries: "Mexico" },
  { code: "ARS", name: "Argentine Peso", symbol: "$", flag: "🇦🇷", countries: "Argentina" },
  { code: "CLP", name: "Chilean Peso", symbol: "$", flag: "🇨🇱", countries: "Chile" },
  { code: "COP", name: "Colombian Peso", symbol: "$", flag: "🇨🇴", countries: "Colombia" },
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦", countries: "South Africa" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬", countries: "Nigeria" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", flag: "🇰🇪", countries: "Kenya" },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£", flag: "🇪🇬", countries: "Egypt" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "🇹🇷", countries: "Turkey" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", flag: "🇸🇪", countries: "Sweden" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", flag: "🇳🇴", countries: "Norway" },
  { code: "DKK", name: "Danish Krone", symbol: "kr", flag: "🇩🇰", countries: "Denmark" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł", flag: "🇵🇱", countries: "Poland" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč", flag: "🇨🇿", countries: "Czechia" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft", flag: "🇭🇺", countries: "Hungary" },
  { code: "ILS", name: "Israeli New Shekel", symbol: "₪", flag: "🇮🇱", countries: "Israel" },
  { code: "TWD", name: "New Taiwan Dollar", symbol: "NT$", flag: "🇹🇼", countries: "Taiwan" },
];

const CURRENCY_MAP = new Map(CURRENCIES.map((c) => [c.code, c]));

const REGION_TO_CURRENCY: Record<string, string> = {
  US: "USD",
  IN: "INR",
  GB: "GBP",
  UK: "GBP",
  CA: "CAD",
  AU: "AUD",
  JP: "JPY",
  AE: "AED",
  SG: "SGD",
  CH: "CHF",
  CN: "CNY",
  HK: "HKD",
  NZ: "NZD",
  SA: "SAR",
  QA: "QAR",
  KW: "KWD",
  KR: "KRW",
  MY: "MYR",
  ID: "IDR",
  TH: "THB",
  PH: "PHP",
  VN: "VND",
  PK: "PKR",
  BD: "BDT",
  LK: "LKR",
  NP: "NPR",
  BR: "BRL",
  MX: "MXN",
  AR: "ARS",
  CL: "CLP",
  CO: "COP",
  ZA: "ZAR",
  NG: "NGN",
  KE: "KES",
  EG: "EGP",
  TR: "TRY",
  SE: "SEK",
  NO: "NOK",
  DK: "DKK",
  PL: "PLN",
  CZ: "CZK",
  HU: "HUF",
  IL: "ILS",
  TW: "TWD",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
  BE: "EUR",
  AT: "EUR",
  PT: "EUR",
  IE: "EUR",
  FI: "EUR",
  GR: "EUR",
};

export function getCurrencyByCode(code: string): CurrencyItem {
  return CURRENCY_MAP.get(code.toUpperCase()) ?? CURRENCIES[0];
}

export function formatCurrencyBadge(currency: CurrencyItem): string {
  return `${currency.code} (${currency.symbol})`;
}

export interface DetectedCurrencyResult {
  currency: CurrencyItem;
  regionCode: string | null;
}

/**
 * Resolves the user's primary currency from the device locale & country code.
 */
export function detectDeviceCurrency(): DetectedCurrencyResult {
  try {
    const locales = Localization.getLocales();
    const primary = locales[0];
    const region = primary?.regionCode?.toUpperCase() ?? null;
    const rawCode = primary?.currencyCode?.toUpperCase() ?? null;

    if (rawCode && CURRENCY_MAP.has(rawCode)) {
      return {
        currency: CURRENCY_MAP.get(rawCode)!,
        regionCode: region,
      };
    }

    if (region && REGION_TO_CURRENCY[region]) {
      const mapped = CURRENCY_MAP.get(REGION_TO_CURRENCY[region]);
      if (mapped) {
        return { currency: mapped, regionCode: region };
      }
    }

    if (rawCode) {
      return {
        currency: {
          code: rawCode,
          name: rawCode,
          symbol: primary?.currencySymbol ?? rawCode,
          flag: "🌐",
          countries: region ?? "Local Region",
        },
        regionCode: region,
      };
    }

    return { currency: CURRENCIES[0], regionCode: region };
  } catch {
    return { currency: CURRENCIES[0], regionCode: null };
  }
}
