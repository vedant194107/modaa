"use client";

export type CurrencyCode = "USD" | "INR" | "EUR" | "GBP" | "JPY";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // Conversion rate from USD
  label: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: "USD", symbol: "$", rate: 1.0, label: "USD ($)" },
  INR: { code: "INR", symbol: "₹", rate: 83.5, label: "INR (₹)" },
  EUR: { code: "EUR", symbol: "€", rate: 0.92, label: "EUR (€)" },
  GBP: { code: "GBP", symbol: "£", rate: 0.79, label: "GBP (£)" },
  JPY: { code: "JPY", symbol: "¥", rate: 155.0, label: "JPY (¥)" },
};

const CURRENCY_KEY = "the_drop_active_currency";

export function getActiveCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "INR";
  const saved = localStorage.getItem(CURRENCY_KEY) as CurrencyCode;
  if (saved && CURRENCIES[saved]) {
    return saved;
  }
  return "INR";
}

export function setActiveCurrency(code: CurrencyCode) {
  if (typeof window === "undefined") return;
  if (CURRENCIES[code]) {
    localStorage.setItem(CURRENCY_KEY, code);
    window.dispatchEvent(new CustomEvent("currency-updated", { detail: code }));
  }
}

export function formatPrice(amountInUSD: number | string, currencyOverride?: CurrencyCode): string {
  const code = currencyOverride || getActiveCurrency();
  const config = CURRENCIES[code] || CURRENCIES.INR;
  
  let numVal = 0;
  if (typeof amountInUSD === "number") {
    numVal = amountInUSD;
  } else {
    numVal = parseFloat(String(amountInUSD).replace(/[^0-9.]/g, "")) || 0;
  }

  const converted = numVal * config.rate;

  if (config.code === "JPY") {
    return `${config.symbol}${Math.round(converted).toLocaleString()}`;
  }
  if (config.code === "INR") {
    return `${config.symbol}${Math.round(converted).toLocaleString("en-IN")}`;
  }

  return `${config.symbol}${converted.toFixed(2)}`;
}
