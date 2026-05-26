import { useState, useEffect } from "react";
import { getContext } from "../context";
import type { Currency } from "./storage";

const FALLBACK: Currency = "USD";

export function useBaseCurrency(): Currency {
  const [currency, setCurrency] = useState<Currency>(FALLBACK);

  useEffect(() => {
    getContext()
      .api.settings.get()
      .then((s) => {
        if (s.baseCurrency) setCurrency(s.baseCurrency as Currency);
      })
      .catch(() => {});
  }, []);

  return currency;
}
