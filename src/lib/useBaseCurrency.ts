import { useState, useEffect } from "react";
import { getContext } from "../context";
import { CURRENCIES, type Currency } from "./storage";

const FALLBACK: Currency = "USD";

export function useBaseCurrency(): Currency {
  const [currency, setCurrency] = useState<Currency>(FALLBACK);

  useEffect(() => {
    let mounted = true;
    const ctx = getContext();
    ctx.api.settings
      .get()
      .then((s) => {
        if (!mounted) return;
        if (s.baseCurrency && (CURRENCIES as readonly string[]).includes(s.baseCurrency)) {
          setCurrency(s.baseCurrency as Currency);
        }
      })
      .catch((err: unknown) => {
        // Degrading to USD silently means every amount in the addon is labelled
        // with the wrong symbol and nobody knows why. Not worth a toast — the UI
        // still works — but it must be diagnosable.
        try {
          ctx.api.logger?.error(
            `[bills-and-subscriptions] base currency lookup failed, falling back to ${FALLBACK}: ${
              err instanceof Error ? err.message : String(err)
            }`,
          );
        } catch {
          // Logger unavailable — nothing further we can do.
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  return currency;
}
