import { useState, useEffect, useMemo } from "react";
import { Loader2, Link2, X } from "lucide-react";
import {
  findMatches,
  matchAgainst,
  MIN_SUGGEST_CONFIDENCE,
  type ExpenseTx,
  type TransactionMatch,
} from "../lib/linker";
import { formatCurrency, formatFullDate, describeError } from "../lib/storage";
import { confidenceColor } from "../lib/linker-storage";
import { getContext } from "../context";

/** How many candidates the picker offers. Passed to the matcher as its `limit`
 *  so the ranking itself is truncated, instead of slicing the result blind. */
const PICKER_LIMIT = 10;

interface TransactionPickerModalProps {
  entityName: string;
  entityAmount: number;
  entityCurrency: string;
  accountIds: string[];
  onSelect: (match: TransactionMatch) => void;
  onClose: () => void;
  /**
   * The entity's own date (a bill's due date). When given, date proximity
   * contributes to the ranking; without it the matcher scores every candidate's
   * date as a neutral 0.5.
   */
  entityDate?: string;
  /**
   * Activity history the caller has already loaded (BillsPage loads and matches
   * the very same rows before opening this modal). When present the modal scores
   * in memory and performs no IO. Absent -> it fetches for itself, exactly as
   * before, so existing call sites are unaffected.
   */
  activities?: ExpenseTx[];
  /** Already-ranked matches from the caller: skips both the fetch and the scoring. */
  matches?: TransactionMatch[];
  /** Activities linked to other entities, which must not be offered again. */
  excludeActivityIds?: Set<string>;
}


export function TransactionPickerModal({
  entityName,
  entityAmount,
  entityCurrency,
  accountIds,
  onSelect,
  onClose,
  entityDate,
  activities,
  matches,
  excludeActivityIds,
}: TransactionPickerModalProps) {
  const [fetched, setFetched] = useState<TransactionMatch[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Anything the caller handed us is derived, never stored in state: a pure
  // computation cannot write to an unmounted component, and an unstable
  // `activities`/`excludeActivityIds` identity cannot drive a setState loop.
  const provided = useMemo<TransactionMatch[] | null>(() => {
    if (matches) return matches.slice(0, PICKER_LIMIT);
    if (activities) {
      return matchAgainst(
        { name: entityName, amount: entityAmount, currency: entityCurrency, date: entityDate },
        activities,
        { excludeActivityIds, limit: PICKER_LIMIT },
      );
    }
    return null;
  }, [matches, activities, entityName, entityAmount, entityCurrency, entityDate, excludeActivityIds]);

  // Sets and arrays are compared by identity, so a caller building one inline
  // would re-trigger the effect on every render. Key on the contents instead.
  const excludeKey = useMemo(
    () => (excludeActivityIds ? [...excludeActivityIds].sort().join("|") : ""),
    [excludeActivityIds],
  );

  useEffect(() => {
    if (provided !== null) return; // caller supplied the data: nothing to fetch

    let cancelled = false;
    setFetched(null);
    setError(null);
    findMatches(
      { name: entityName, amount: entityAmount, currency: entityCurrency, date: entityDate },
      accountIds,
      { excludeActivityIds, limit: PICKER_LIMIT },
    )
      .then(results => {
        if (cancelled) return;
        setFetched(results);
      })
      .catch(err => {
        // Log even when cancelled: the failure happened and is worth a trace.
        getContext().api.logger.error(
          `[bills-and-subscriptions] transaction picker fetch failed for "${entityName}": ${describeError(err)}`,
        );
        if (cancelled) return;
        setError("Couldn't load transactions. Check Wealthfolio and try again.");
      });

    // The modal is routinely closed before the fetch settles.
    return () => { cancelled = true; };
    // excludeKey stands in for excludeActivityIds' contents (read above).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provided, entityName, entityAmount, entityCurrency, entityDate, accountIds, excludeKey]);

  const results = provided ?? fetched;
  const loading = results === null && error === null;
  const rows = results ?? [];
  // MIN_SUGGEST_CONFIDENCE is the lib's bar for a match the UI may stand behind.
  // Rows below it are still selectable — this is a manual picker — but they get
  // a warning instead of being presented as findings.
  const allWeak = rows.length > 0 && rows.every(m => m.confidence < MIN_SUGGEST_CONFIDENCE);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden"
        style={{ maxHeight: "80vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div>
            <span className="text-sm font-semibold text-foreground">Match transaction</span>
            <p className="text-xs text-muted-foreground mt-0.5">
              {entityName} · {formatCurrency(entityAmount, entityCurrency)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-3 py-2">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Searching transactions…
            </div>
          )}
          {error && (
            <div className="py-4 text-sm text-destructive text-center">{error}</div>
          )}
          {!loading && !error && rows.length === 0 && (
            <div className="py-10 text-sm text-muted-foreground text-center">
              No matching transactions found.
            </div>
          )}
          {allWeak && !error && (
            <p className="text-xs text-muted-foreground px-2 py-1.5">
              Only weak matches — check the description and amount before linking.
            </p>
          )}
          {!loading && rows.map(match => {
            const pct = Math.round(match.confidence * 100);
            const color = confidenceColor(match.confidence);
            const dateLabel = formatFullDate(match.activityDate);
            return (
              <div
                key={match.activityId}
                className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground truncate">{match.comment || "—"}</span>
                  <span className="text-xs text-muted-foreground">
                    {/* An unparseable date must not leave a dangling separator behind. */}
                    {[dateLabel, match.accountName].filter(Boolean).join(" · ")}
                  </span>
                </div>
                <span className="shrink-0 tabular-nums text-sm text-foreground">
                  {formatCurrency(match.amount, match.currency)}
                </span>
                <span className="shrink-0 text-xs font-medium tabular-nums w-8 text-right" style={{ color }}>
                  {pct}%
                </span>
                <button
                  onClick={() => onSelect(match)}
                  className="shrink-0 flex items-center gap-1 text-xs px-2.5 py-1 rounded-md font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <Link2 className="h-3 w-3" />
                  Select
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Close without linking
          </button>
        </div>
      </div>
    </div>
  );
}
