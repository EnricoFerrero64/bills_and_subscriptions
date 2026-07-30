import { useState, useEffect, useCallback } from "react";
import { Link2, Unlink } from "lucide-react";
import { PageLayout } from "../components/PageLayout";
import {
  getSubscriptions,
  getBills,
  formatCurrency,
  formatDayLabel,
  type Bill,
  type Subscription,
} from "../lib/storage";
import { getLinks, removeLink, type LinkedTransaction } from "../lib/linker-storage";

/** A group is one entity's links, or the single bucket for links whose entity is gone. */
type GroupKind = "subscription" | "bill" | "orphaned";

export interface LinkGroup {
  /** React key. Prefixed with the kind so a bill and a subscription can never collide. */
  key: string;
  kind: GroupKind;
  name: string;
  /** Secondary line next to the name (amount / cycle for subs, amount / date for bills). */
  detail: string;
  links: LinkedTransaction[];
}

/** Shown in the type pill. Orphans say what is wrong, not what they are. */
const KIND_LABELS: Record<GroupKind, string> = {
  subscription: "Subscription",
  bill: "Bill",
  orphaned: "Orphaned",
};

/** Grouped by type, subscriptions first, then bills, then orphans. */
const KIND_ORDER: Record<GroupKind, number> = { subscription: 0, bill: 1, orphaned: 2 };

const ORPHAN_KEY = "orphaned";

/**
 * Renders "3 Feb", plus the year when the link is not from the current year.
 *
 * formatDayLabel() deliberately yields only day+month, but links survive for
 * years, so a bare "3 Feb" would be ambiguous on anything older. Appending the
 * year only when it differs keeps the common case short without ever hiding the
 * fact that a transaction is old. The raw ISO string still goes in title=.
 * Falls back to the raw string so an unparseable date is never blanked out.
 */
export function formatLinkDate(dateStr: string, currentYear: number): string {
  const label = formatDayLabel(dateStr);
  if (!label) return dateStr;
  const year = Number(dateStr.slice(0, 4));
  return Number.isFinite(year) && year !== currentYear ? `${label} ${year}` : label;
}

/**
 * Pure so it can be tested without a DOM: turns the stored links into render-ready
 * groups. Every stored link lands in exactly one group — subscription, bill, or
 * orphaned — which is the whole point: before this, bill links were resolved
 * against subscriptions only and silently disappeared from the page.
 */
export function buildLinkGroups(
  links: LinkedTransaction[],
  subs: Subscription[],
  bills: Bill[],
): LinkGroup[] {
  const subById = new Map(subs.map((s) => [s.id, s]));
  const billById = new Map(bills.map((b) => [b.id, b]));
  const currentYear = new Date().getFullYear();

  const byKey = new Map<string, LinkGroup>();

  const push = (group: Omit<LinkGroup, "links">, link: LinkedTransaction) => {
    const existing = byKey.get(group.key);
    if (existing) existing.links.push(link);
    else byKey.set(group.key, { ...group, links: [link] });
  };

  for (const link of links) {
    // entityType picks which store to trust first, but we fall back to the other
    // one: a mislabelled or legacy link should still be reviewable, not orphaned.
    const asSub = subById.get(link.entityId);
    const asBill = billById.get(link.entityId);
    const bill = link.entityType === "bill" ? asBill : asSub ? undefined : asBill;
    const sub = link.entityType === "bill" ? (asBill ? undefined : asSub) : asSub;

    if (bill) {
      push(
        {
          key: `bill:${bill.id}`,
          kind: "bill",
          name: bill.name,
          detail: `${formatCurrency(bill.amount, bill.currency)} · ${formatLinkDate(bill.date, currentYear)}`,
        },
        link,
      );
    } else if (sub) {
      push(
        {
          key: `subscription:${sub.id}`,
          kind: "subscription",
          name: sub.name,
          detail: `${formatCurrency(sub.amount, sub.currency)} / ${sub.billingCycle}`,
        },
        link,
      );
    } else {
      // D2: the entity is gone but the link is still stored. Surfacing it is the
      // only way the user can ever get rid of it.
      push(
        {
          key: ORPHAN_KEY,
          kind: "orphaned",
          name: "Orphaned links",
          detail: "The bill or subscription was deleted",
        },
        link,
      );
    }
  }

  const groups = [...byKey.values()];
  for (const group of groups) {
    // Newest transaction first, as before; activityId breaks ties so the order
    // never depends on storage insertion order.
    group.links.sort(
      (a, b) =>
        b.activityDate.localeCompare(a.activityDate) || a.activityId.localeCompare(b.activityId),
    );
  }
  // Type-clustered, then alphabetical by name; key is the deterministic tiebreak.
  groups.sort(
    (a, b) =>
      KIND_ORDER[a.kind] - KIND_ORDER[b.kind] ||
      a.name.localeCompare(b.name) ||
      a.key.localeCompare(b.key),
  );
  return groups;
}

export function LinksPage() {
  const [groups, setGroups] = useState<LinkGroup[]>([]);
  // Counted from storage, not from what got rendered, so it stays honest even if
  // a link ends up in a group we would not otherwise show.
  const [total, setTotal] = useState(0);
  // Distinguishes "nothing stored" from "not read yet", so the empty state can
  // never flash before the first read completes.
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(() => {
    const links = getLinks();
    setGroups(buildLinkGroups(links, getSubscriptions(), getBills()));
    setTotal(links.length);
    setLoaded(true);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleUnlink = useCallback((entityId: string, activityId: string) => {
    removeLink(entityId, activityId);
    refresh();
  }, [refresh]);

  // Orphans have no entity to act on as a whole, so clearing them is a per-link loop.
  const handleClearGroup = useCallback((group: LinkGroup) => {
    for (const link of group.links) removeLink(link.entityId, link.activityId);
    refresh();
  }, [refresh]);

  const currentYear = new Date().getFullYear();

  return (
    <PageLayout activePath="/addons/bills-and-subscriptions/links">
      <div className="p-4 flex flex-col gap-4">

        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">Linked Transactions</span>
          {total > 0 && (
            <span className="ml-auto text-xs text-muted-foreground">{total} total</span>
          )}
        </div>

        {!loaded ? (
          <div className="text-center py-12 text-xs text-muted-foreground">Loading links…</div>
        ) : groups.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center gap-2 text-muted-foreground">
            <Link2 className="h-8 w-8 opacity-30" />
            <span className="text-sm">No linked transactions yet.</span>
            <span className="text-xs">
              Link transactions to your subscriptions from Suggestions, or to a bill from the Bills page.
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {groups.map((group) => (
              <div
                key={group.key}
                className={`border border-border rounded-xl overflow-hidden ${group.kind === "orphaned" ? "opacity-70" : ""}`}
              >
                {/* Entity header — name, type pill, detail */}
                <div className="px-4 py-2.5 bg-muted/30 border-b border-border flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{group.name}</span>
                  {/* Same neutral pill the Bills/Subscriptions rows use for their
                      account and recurring badges — a type label, not a category. */}
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
                    {KIND_LABELS[group.kind]}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">{group.detail}</span>
                  {group.kind === "orphaned" ? (
                    <button
                      onClick={() => handleClearGroup(group)}
                      title="Remove all orphaned links"
                      className="ml-auto shrink-0 text-xs px-2 py-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      Clear all
                    </button>
                  ) : (
                    <span className="ml-auto text-xs text-muted-foreground">{group.links.length} tx</span>
                  )}
                </div>

                {/* Linked transactions */}
                <div className="divide-y divide-border">
                  {group.links.map((link) => (
                    <div key={`${link.entityId}|${link.activityId}`} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <span className="truncate text-foreground">{link.description || "—"}</span>
                        <span className="text-xs text-muted-foreground" title={link.activityDate}>
                          {formatLinkDate(link.activityDate, currentYear)} · {link.accountName}
                        </span>
                      </div>
                      <span className="shrink-0 tabular-nums text-foreground">
                        {formatCurrency(link.amount, link.currency)}
                      </span>
                      <button
                        onClick={() => handleUnlink(link.entityId, link.activityId)}
                        title="Unlink this transaction"
                        className="shrink-0 flex items-center gap-1 text-xs px-2 py-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Unlink className="h-3 w-3" />
                        Unlink
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </PageLayout>
  );
}
