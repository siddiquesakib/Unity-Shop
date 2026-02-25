"use client";

import { createContext, useContext, useState, useEffect } from "react";

const currencies = [
  { code: "USD", symbol: "$", flag: "🇺🇸", name: "US Dollar", rate: 1.0 },
  { code: "EUR", symbol: "€", flag: "🇪🇺", name: "Euro", rate: 0.92 },
  { code: "GBP", symbol: "£", flag: "🇬🇧", name: "British Pound", rate: 0.79 },
  { code: "JPY", symbol: "¥", flag: "🇯🇵", name: "Japanese Yen", rate: 149.5 },
  { code: "CNY", symbol: "¥", flag: "🇨🇳", name: "Chinese Yuan", rate: 7.24 },
  { code: "INR", symbol: "₹", flag: "🇮🇳", name: "Indian Rupee", rate: 83.12 },
  { code: "AED", symbol: "د.إ", flag: "🇦🇪", name: "UAE Dirham", rate: 3.67 },
  {
    code: "CAD",
    symbol: "C$",
    flag: "🇨🇦",
    name: "Canadian Dollar",
    rate: 1.36,
  },
  {
    code: "AUD",
    symbol: "A$",
    flag: "🇦🇺",
    name: "Australian Dollar",
    rate: 1.53,
  },
  { code: "SAR", symbol: "ر.س", flag: "🇸🇦", name: "Saudi Riyal", rate: 3.75 },
  {
    code: "BDT",
    symbol: "৳",
    flag: "🇧🇩",
    name: "Bangladeshi Taka",
    rate: 108.5,
  },
];

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState("USD");

  // Load currency from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("currency");
    if (saved && currencies.find((c) => c.code === saved)) {
      setCurrencyState(saved);
    }
  }, []);

  // Save currency
  const setCurrency = (code) => {
    setCurrencyState(code);
    localStorage.setItem("currency", code);
  };

  // Format price - converts and formats
  const formatPrice = (amount, fromCurrency = "USD") => {
    const currentCurrency = currencies.find((c) => c.code === currency);
    const sourceCurrency = currencies.find((c) => c.code === fromCurrency);

    if (!currentCurrency || !sourceCurrency) {
      return `$${amount.toFixed(2)}`;
    }

    // Convert: amount in source currency → USD → current currency
    const amountInUSD = amount / sourceCurrency.rate;
    const convertedAmount = amountInUSD * currentCurrency.rate;

    // Format with proper decimals
    const formatted = convertedAmount.toFixed(2);

    return `${currentCurrency.symbol}${formatted}`;
  };

  const value = {
    currency,
    setCurrency,
    formatPrice,
    currencies,
    currentCurrency: currencies.find((c) => c.code === currency),
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
}
