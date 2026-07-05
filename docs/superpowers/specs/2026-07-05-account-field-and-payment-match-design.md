# Design: Account Field + Inline Payment Matching

**Date:** 2026-07-05
**Addon:** bills-and-subscriptions
**Status:** Approved

---

## Context

Users want to:
1. Indicate which Wealthfolio account a bill/subscription is domiciled on.
2. Have the system automatically find the matching bank transaction when a bill is due.
3. Confirm the match with one click (which also marks the bill as paid).
4. Fall back to a manual picker if the auto-scan misses.

---

## Feature 1 — Account field on Bill and Subscription

### Data model
Add `accountId?: string` to both `Subscription` and `Bill` interfaces in `src/lib/storage.ts`.

### Forms
- Both `SubForm` and `BillForm` get an optional **Account** dropdown at the bottom.
- Loaded via `ctx.api.accounts.getAll()` on mount; filtered to active accounts.
- Label: *"Account (optional — narrows transaction search)"*
- Default: empty (no account = search all).

### Row display
- If `accountId` is set, show a small pill badge on the row with the account name (fetched once on mount and cached in a context/state map).
- Positioned next to the existing category/recurring badges.

### Search behaviour
- `findMatches(target, accountIds)` already accepts an array.
- If `bill.accountId` is set → pass `[bill.accountId]`.
- If not → pass all active account IDs.

---

## Feature 2 — Inline auto-suggestion on Bills page

### Auto-scan on mount
When `BillsPage` mounts:
1. Fetch all active accounts once (or just the one stored on each bill).
2. For each **unpaid** bill, run `findMatches()` in the background (Promise.all, non-blocking).
3. Take only the **top result** per bill (index 0), but only if `confidence ≥ 0.25`.
4. Store in local React state: `suggestions: Record<billId, TransactionMatch | null>`.

The scan runs silently; a subtle spinner on the bill row indicates it's in progress.

### Suggestion banner
If a suggestion is found, show an inline banner **below the bill row** (not a modal):

```
┌─────────────────────────────────────────────────────┐
│ 💳  CONDOMINIO Q3   €450,00 · 3 lug · Conto BancoPosta │  [✓ Confirm]  [✗]  [▾]
└─────────────────────────────────────────────────────┘
```

- **✓ Confirm**: links the transaction + marks bill as paid in one action.
- **✗**: dismisses the suggestion; the manual 🔍 button becomes visible.
- **▾** (chevron): opens the full ranked list (TransactionPickerModal) without dismissing.

Dismissed suggestions are stored in component state (not persisted — they reappear on next page load and re-scan).

### Manual fallback button
A small **🔍** icon button is always present on each bill row (visible when no suggestion is shown, or after dismissal). Clicking it opens `TransactionPickerModal` for that bill.

---

## Feature 3 — TransactionPickerModal

A modal showing up to 10 ranked matches for a given bill:

| Date | Description | Amount | Account | Match % | |
|------|-------------|--------|---------|---------|---|
| 3 lug | CONDOMINIO Q3 | €450 | BancoPosta | 87% | Select |
| 1 lug | CONDOMINIO | €450 | BancoPosta | 71% | Select |

- If `findMatches()` hasn't run yet for this bill, it runs on modal open with a loading spinner.
- **Select** → link + mark paid + close modal.
- **Skip / Close** → close without linking (bill stays unpaid).

---

## Feature 4 — LinkedTransaction schema update

Current `subscriptionId` field is misleading for bills. Update:

```ts
// Before
interface LinkedTransaction {
  subscriptionId: string;
  ...
}

// After
interface LinkedTransaction {
  entityId: string;              // id of the Bill or Subscription
  entityType: 'subscription' | 'bill';
  activityId: string;
  activityDate: string;
  amount: number;
  currency: string;
  description: string;
  accountName: string;
  linkedAt: string;
}
```

Update all functions in `linker-storage.ts` and all consumers (`SuggestionsPage`, `LinksPage`) to use `entityId` / `entityType`.

Since the addon is freshly deployed and no links have been stored yet, no migration is needed.

---

## Files to modify / create

| File | Change |
|------|--------|
| `src/lib/storage.ts` | Add `accountId?: string` to `Bill` and `Subscription` |
| `src/lib/linker-storage.ts` | `subscriptionId` → `entityId` + `entityType` |
| `src/components/SubForm.tsx` | Add account dropdown |
| `src/pages/BillsPage.tsx` | Add account dropdown in BillForm; inline suggestion banner; 🔍 button; auto-scan on mount |
| `src/pages/SubscriptionsPage.tsx` | Add account dropdown in SubForm call; show account badge on row |
| `src/pages/SuggestionsPage.tsx` | Update `entityId`/`entityType`; load accounts for filter |
| `src/pages/LinksPage.tsx` | Update to use `entityId`/`entityType`; show entity type label |
| `src/components/TransactionPickerModal.tsx` | **New** — ranked transaction list modal |

---

## Confirmation flow (Bills)

```
BillsPage loads
  └── auto-scan (background)
        ├── found (confidence ≥ 0.25)
        │     └── show suggestion banner
        │           ├── ✓ Confirm → saveLink(entityId, 'bill', ...) + togglePaid(bill)
        │           ├── ✗ dismiss → show 🔍 button
        │           └── ▾ open picker → TransactionPickerModal → Select → saveLink + togglePaid
        └── not found
              └── show 🔍 button
                    └── click → TransactionPickerModal → Select → saveLink + togglePaid
```

---

## Out of scope

- Subscriptions do not get the inline suggestion on the Subscriptions page (they use the existing Suggestions tab).
- No changes to SummaryPage or sync logic.
- No server-side persistence — everything stays in localStorage.
