import { useState, useEffect } from "react";
import { getContext } from "../context";
import { CURRENCIES, type Currency } from "./storage";

const FALLBACK: Currency = "USD";

export function useBaseCurrency(): Currency {
  const [currency, setCurrency] = useState<Currency>(FALLBACK);

  useEffect(() => {
    getContext()
      .api.settings.get()
      .then((s) => {
        if (s.baseCurrency && (CURRENCIES as readonly string[]).includes(s.baseCurrency)) {
          setCurrency(s.baseCurrency as Currency);
        }
      })
      .catch(() => {});
  }, []);

  return currency;
}
