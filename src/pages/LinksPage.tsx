import { useState, useEffect, useCallback } from 'react';
import { Link2, Unlink } from 'lucide-react';
import { PageLayout } from '../components/PageLayout';
import { getSubscriptions, formatCurrency, type Subscription } from '../lib/storage';
import { getLinks, removeLink, type LinkedTransaction } from '../lib/linker-storage';

interface GroupedLinks {
  sub: Subscription;
  links: LinkedTransaction[];
}

export function LinksPage() {
  const [groups, setGroups] = useState<GroupedLinks[]>([]);

  const refresh = useCallback(() => {
    const subs = getSubscriptions();
    const allLinks = getLinks();
    const result: GroupedLinks[] = [];
    for (const sub of subs) {
      const links = allLinks.filter(l => l.entityId === sub.id && l.entityType === 'subscription');
      if (links.length > 0) {
        result.push({ sub, links: links.sort((a, b) => b.activityDate.localeCompare(a.activityDate)) });
      }
    }
    setGroups(result);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleUnlink = useCallback((subscriptionId: string, activityId: string) => {
    removeLink(subscriptionId, activityId);
    refresh();
  }, [refresh]);

  return (
    <PageLayout activePath="/addons/bills-and-subscriptions/links">
      <div className="p-4 flex flex-col gap-4">

        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">Linked Transactions</span>
          {groups.length > 0 && (
            <span className="ml-auto text-xs text-muted-foreground">
              {groups.reduce((n, g) => n + g.links.length, 0)} total
            </span>
          )}
        </div>

        {groups.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center gap-2 text-muted-foreground">
            <Link2 className="h-8 w-8 opacity-30" />
            <span className="text-sm">No linked transactions yet.</span>
            <span className="text-xs">Go to Suggestions and link transactions to your subscriptions.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {groups.map(({ sub, links }) => (
              <div key={sub.id} className="border border-border rounded-xl overflow-hidden">
                {/* Subscription header */}
                <div className="px-4 py-2.5 bg-muted/30 border-b border-border flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{sub.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatCurrency(sub.amount, sub.currency)} / {sub.billingCycle}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">{links.length} tx</span>
                </div>

                {/* Linked transactions */}
                <div className="divide-y divide-border">
                  {links.map(link => (
                    <div key={link.activityId} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <span className="truncate text-foreground">{link.description || '—'}</span>
                        <span className="text-xs text-muted-foreground">{link.activityDate} · {link.accountName}</span>
                      </div>
                      <span className="shrink-0 tabular-nums text-foreground">
                        {formatCurrency(link.amount, link.currency)}
                      </span>
                      <button
                        onClick={() => handleUnlink(sub.id, link.activityId)}
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
