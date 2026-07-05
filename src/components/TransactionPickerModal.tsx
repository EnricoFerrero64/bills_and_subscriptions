import { useState, useEffect } from 'react';
import { Loader2, Link2, X } from 'lucide-react';
import { findMatches, type TransactionMatch } from '../lib/linker';
import { formatCurrency } from '../lib/storage';
import { confidenceColor } from '../lib/linker-storage';

interface TransactionPickerModalProps {
  entityName: string;
  entityAmount: number;
  entityCurrency: string;
  accountIds: string[];
  onSelect: (match: TransactionMatch) => void;
  onClose: () => void;
}

export function TransactionPickerModal({
  entityName,
  entityAmount,
  entityCurrency,
  accountIds,
  onSelect,
  onClose,
}: TransactionPickerModalProps) {
  const [matches, setMatches] = useState<TransactionMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    findMatches({ name: entityName, amount: entityAmount, currency: entityCurrency }, accountIds)
      .then(results => {
        setMatches(results.slice(0, 10));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch transactions');
        setLoading(false);
      });
  }, [entityName, entityAmount, entityCurrency, accountIds]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden"
        style={{ maxHeight: '80vh' }}
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
          {!loading && !error && matches.length === 0 && (
            <div className="py-10 text-sm text-muted-foreground text-center">
              No matching transactions found.
            </div>
          )}
          {!loading && matches.map(match => {
            const pct = Math.round(match.confidence * 100);
            const color = confidenceColor(match.confidence);
            return (
              <div
                key={match.activityId}
                className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground truncate">{match.comment || '—'}</span>
                  <span className="text-xs text-muted-foreground">{match.activityDate} · {match.accountName}</span>
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
