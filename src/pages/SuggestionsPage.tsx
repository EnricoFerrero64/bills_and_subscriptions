import { useState, useEffect, useCallback } from 'react';
import { Search, Link2, ChevronDown, ChevronUp, Loader2, Unlink, AlertCircle } from 'lucide-react';
import { PageLayout } from '../components/PageLayout';
import { getSubscriptions, formatCurrency, type Subscription } from '../lib/storage';
import { findMatches, type TransactionMatch } from '../lib/linker';
import { saveLink, removeLink, getLinksForEntity, confidenceColor, type LinkedTransaction } from '../lib/linker-storage';
import { getContext } from '../context';

interface MatchState {
  loading: boolean;
  done: boolean;
  matches: TransactionMatch[];
  error?: string;
}

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color = confidenceColor(value);
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs tabular-nums" style={{ color }}>{pct}%</span>
    </div>
  );
}

interface MatchRowProps {
  match: TransactionMatch;
  onToggle: (match: TransactionMatch, linked: boolean) => void;
  linked: boolean;
}

function MatchRow({ match, onToggle, linked }: MatchRowProps) {
  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors text-sm">
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="truncate text-foreground font-medium">{match.comment || '—'}</span>
        <span className="text-xs text-muted-foreground">{match.activityDate} · {match.accountName}</span>
      </div>
      <span className="shrink-0 tabular-nums text-foreground">{formatCurrency(match.amount, match.currency)}</span>
      <ConfidenceBar value={match.confidence} />
      <button
        onClick={() => onToggle(match, linked)}
        title={linked ? 'Unlink' : 'Link this transaction'}
        className={`shrink-0 flex items-center gap-1 text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
          linked
            ? 'bg-primary/10 text-primary hover:bg-destructive/10 hover:text-destructive'
            : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
        }`}
      >
        {linked ? <Unlink className="h-3 w-3" /> : <Link2 className="h-3 w-3" />}
        {linked ? 'Unlink' : 'Link'}
      </button>
    </div>
  );
}

interface SubCardProps {
  sub: Subscription;
  matchState: MatchState | undefined;
  onScan: (sub: Subscription) => void;
  onToggleLink: (subId: string, match: TransactionMatch, linked: boolean) => void;
  linkSet: Set<string>;
}

function SubCard({ sub, matchState, onScan, onToggleLink, linkSet }: SubCardProps) {
  const [open, setOpen] = useState(false);
  const linkedCount = matchState?.matches.filter(m => linkSet.has(m.activityId)).length ?? 0;
  const totalCount = matchState?.matches.length ?? 0;

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => {
          if (!matchState?.done) onScan(sub);
          setOpen(o => !o);
        }}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-foreground truncate">{sub.name}</span>
            {linkedCount > 0 && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                {linkedCount} linked
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {formatCurrency(sub.amount, sub.currency)} · {sub.billingCycle}
          </span>
        </div>
        {matchState?.loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : matchState?.done ? (
          <span className="text-xs text-muted-foreground shrink-0">{totalCount} match{totalCount !== 1 ? 'es' : ''}</span>
        ) : (
          <span className="text-xs text-primary shrink-0">Scan</span>
        )}
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
      </div>

      {open && matchState && (
        <div className="border-t border-border bg-muted/20 px-3 py-2">
          {matchState.loading && (
            <div className="flex items-center gap-2 py-4 justify-center text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Scanning transactions…
            </div>
          )}
          {matchState.error && (
            <div className="flex items-center gap-2 py-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" /> {matchState.error}
            </div>
          )}
          {matchState.done && !matchState.loading && matchState.matches.length === 0 && (
            <p className="text-sm text-muted-foreground py-3 text-center">
              No matching transactions found. Check if the name and amount match your bank data.
            </p>
          )}
          {matchState.done && matchState.matches.map(m => (
            <MatchRow
              key={m.activityId}
              match={m}
              linked={linkSet.has(m.activityId)}
              onToggle={(match, linked) => onToggleLink(sub.id, match, linked)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function SuggestionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [accountIds, setAccountIds] = useState<string[]>([]);
  const [matchStates, setMatchStates] = useState<Record<string, MatchState>>({});
  const [linkSets, setLinkSets] = useState<Record<string, Set<string>>>({});
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const subs = getSubscriptions().filter(s => s.active);
    setSubscriptions(subs);

    // Init linkSets from localStorage
    const initial: Record<string, Set<string>> = {};
    for (const sub of subs) {
      const links = getLinksForEntity(sub.id);
      initial[sub.id] = new Set(links.map(l => l.activityId));
    }
    setLinkSets(initial);

    getContext().api.accounts.getAll().then(accounts => {
      setAccountIds(accounts.filter(a => a.isActive).map(a => a.id));
    }).catch(() => {});
  }, []);

  const scanSub = useCallback(async (sub: Subscription) => {
    setMatchStates(prev => ({ ...prev, [sub.id]: { loading: true, done: false, matches: [] } }));
    try {
      const matches = await findMatches(
        { name: sub.name, amount: sub.amount, currency: sub.currency },
        accountIds
      );
      setMatchStates(prev => ({ ...prev, [sub.id]: { loading: false, done: true, matches } }));
    } catch (e) {
      setMatchStates(prev => ({
        ...prev,
        [sub.id]: { loading: false, done: true, matches: [], error: 'Failed to fetch transactions' },
      }));
    }
  }, [accountIds]);

  const scanAll = useCallback(async () => {
    setScanning(true);
    for (const sub of subscriptions) {
      await scanSub(sub);
    }
    setScanning(false);
  }, [subscriptions, scanSub]);

  const handleToggleLink = useCallback((subId: string, match: TransactionMatch, currentlyLinked: boolean) => {
    if (currentlyLinked) {
      removeLink(subId, match.activityId);
      setLinkSets(prev => {
        const next = new Set(prev[subId] ?? []);
        next.delete(match.activityId);
        return { ...prev, [subId]: next };
      });
    } else {
      const link: LinkedTransaction = {
        entityId: subId,
        entityType: 'subscription',
        activityId: match.activityId,
        activityDate: match.activityDate,
        amount: match.amount,
        currency: match.currency,
        description: match.comment,
        accountName: match.accountName,
        linkedAt: new Date().toISOString(),
      };
      saveLink(link);
      setLinkSets(prev => {
        const next = new Set(prev[subId] ?? []);
        next.add(match.activityId);
        return { ...prev, [subId]: next };
      });
    }
  }, []);

  return (
    <PageLayout activePath="/addons/bills-and-subscriptions/suggestions">
      <div className="p-4 flex flex-col gap-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-foreground">Transaction Suggestions</span>
            <span className="text-xs text-muted-foreground">
              Match subscriptions to their real Wealthfolio transactions
            </span>
          </div>
          <button
            onClick={scanAll}
            disabled={scanning || accountIds.length === 0}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {scanning
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <Search className="h-3.5 w-3.5" />}
            {scanning ? 'Scanning…' : 'Scan All'}
          </button>
        </div>

        {accountIds.length === 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2.5">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading accounts…
          </div>
        )}

        {subscriptions.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            No active subscriptions yet. Add some in the Subscriptions tab first.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {subscriptions.map(sub => (
              <SubCard
                key={sub.id}
                sub={sub}
                matchState={matchStates[sub.id]}
                onScan={scanSub}
                onToggleLink={handleToggleLink}
                linkSet={linkSets[sub.id] ?? new Set()}
              />
            ))}
          </div>
        )}

      </div>
    </PageLayout>
  );
}
