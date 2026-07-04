import { getContext } from "../context";
import {
  getSubscriptions,
  getBills,
  getSyncLog,
  updateSyncLog,
  advanceDateByCycle,
} from "./storage";
import type { Subscription, Bill } from "./storage";

export interface SyncResult {
  synced: number;
  failed: number;
  skipped: number;
}

function getSubscriptionDates(sub: Subscription, today: string): string[] {
  if (!sub.startDate) return [];
  const dates: string[] = [];
  let current = sub.startDate;
  while (current <= today) {
    dates.push(current);
    current = advanceDateByCycle(current, sub.billingCycle);
  }
  return dates;
}

function getBillDates(bill: Bill, today: string): string[] {
  if (bill.date > today) return [];
  if (!bill.recurring || !bill.billingCycle) return [bill.date];
  const dates: string[] = [];
  let current = bill.date;
  while (current <= today) {
    dates.push(current);
    current = advanceDateByCycle(current, bill.billingCycle);
  }
  return dates;
}

export async function syncAll(accountId: string): Promise<SyncResult> {
  const ctx = getContext();
  const log = getSyncLog();
  const today = new Date().toISOString().slice(0, 10);

  let synced = 0, failed = 0, skipped = 0;
  const newEntries: Record<string, string> = {};

  const subs = getSubscriptions().filter((s) => s.active && s.startDate);
  for (const sub of subs) {
    for (const date of getSubscriptionDates(sub, today)) {
      const key = `${sub.id}:${date}`;
      if (key in log || key in newEntries) { skipped++; continue; }
      try {
        const activity = await ctx.api.activities.create({
          accountId,
          activityType: "WITHDRAWAL",
          activityDate: date,
          amount: sub.amount,
          currency: sub.currency,
          comment: `${sub.name} · ${sub.category}`,
        });
        newEntries[key] = activity.id;
        synced++;
      } catch {
        failed++;
      }
    }
  }

  const bills = getBills();
  for (const bill of bills) {
    for (const date of getBillDates(bill, today)) {
      const key = `bill:${bill.id}:${date}`;
      if (key in log || key in newEntries) { skipped++; continue; }
      try {
        const activity = await ctx.api.activities.create({
          accountId,
          activityType: "WITHDRAWAL",
          activityDate: date,
          amount: bill.amount,
          currency: bill.currency,
          comment: `${bill.name} · ${bill.category}`,
        });
        newEntries[key] = activity.id;
        synced++;
      } catch {
        failed++;
      }
    }
  }

  if (Object.keys(newEntries).length > 0) {
    updateSyncLog(newEntries);
  }

  return { synced, failed, skipped };
}
