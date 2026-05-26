import { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  type BillingCycle,
  type SubscriptionCategory,
  type Currency,
  CATEGORIES,
  CURRENCIES,
} from "../lib/storage";

export interface SubFormState {
  name: string;
  amount: string;
  currency: Currency;
  billingCycle: BillingCycle;
  category: SubscriptionCategory;
  website: string;
  notes: string;
  active: boolean;
}

export function blankSubForm(currency: Currency = "USD"): SubFormState {
  return {
    name: "",
    amount: "",
    currency,
    billingCycle: "monthly",
    category: "Other",
    website: "",
    notes: "",
    active: true,
  };
}

interface SubFormProps {
  initial: SubFormState;
  editingId: string | null;
  onSave: (form: SubFormState) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function SubForm({ initial, editingId, onSave, onDelete, onClose }: SubFormProps) {
  const [form, setForm] = useState<SubFormState>(initial);

  const set = (field: keyof SubFormState, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    if (!form.name.trim() || !form.amount) return;
    onSave(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-5 flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-foreground">
          {editingId ? "Edit subscription" : "Add subscription"}
        </h2>

        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground">Service name</label>
          <input
            autoFocus
            type="text"
            placeholder="e.g. Netflix, Spotify…"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Amount + Currency */}
        <div className="flex gap-2">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs text-muted-foreground">Amount</label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => set("amount", e.target.value)}
              className="bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="flex flex-col gap-1.5 w-28">
            <label className="text-xs text-muted-foreground">Currency</label>
            <select
              value={form.currency}
              onChange={(e) => set("currency", e.target.value as Currency)}
              className="bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Billing cycle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground">Billing cycle</label>
          <div className="flex gap-1.5">
            {(["monthly", "yearly", "quarterly", "weekly"] as BillingCycle[]).map((cycle) => (
              <button
                key={cycle}
                onClick={() => set("billingCycle", cycle)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  form.billingCycle === cycle
                    ? "bg-primary text-primary-foreground border-transparent"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground">Category</label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value as SubscriptionCategory)}
            className="bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* Website */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground">
            Website <span className="text-muted-foreground/50">(optional — used to load logo)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. netflix.com"
            value={form.website}
            onChange={(e) => set("website", e.target.value)}
            className="bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground">Notes <span className="text-muted-foreground/50">(optional)</span></label>
          <input
            type="text"
            placeholder="e.g. Family plan, shared with…"
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            className="bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1 border-t border-border mt-1">
          {editingId && (
            <button
              onClick={() => onDelete(editingId)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!form.name.trim() || !form.amount}
            className="px-4 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-40 transition-opacity bg-primary text-primary-foreground"
          >
            {editingId ? "Save" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
