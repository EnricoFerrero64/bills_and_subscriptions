import "./index.css";
import React from "react";
import { Layers } from "lucide-react";
import type { AddonContext } from "@wealthfolio/addon-sdk";
import { setContext } from "./context";
import { SubscriptionsPage } from "./pages/SubscriptionsPage";
import { SummaryPage } from "./pages/SummaryPage";
import { BillsPage } from "./pages/BillsPage";
import { BillLinkingSuggestionsPage } from "./pages/BillLinkingSuggestionsPage";
import { BillLinkingLinksPage } from "./pages/BillLinkingLinksPage";

export default function enable(ctx: AddonContext) {
  setContext(ctx);

  const sidebarItem = ctx.sidebar.addItem({
    id: "bills-and-subscriptions",
    label: "Subscriptions & Bills",
    icon: <Layers className="h-5 w-5" />,
    route: "/addons/bills-and-subscriptions/summary",
    order: 400,
  });

  ctx.router.add({
    path: "/addons/bills-and-subscriptions",
    component: React.lazy(() => Promise.resolve({ default: SubscriptionsPage })),
  });

  ctx.router.add({
    path: "/addons/bills-and-subscriptions/summary",
    component: React.lazy(() => Promise.resolve({ default: SummaryPage })),
  });

  ctx.router.add({
    path: "/addons/bills-and-subscriptions/bills",
    component: React.lazy(() => Promise.resolve({ default: BillsPage })),
  });

  // Bill Linking routes
  ctx.router.add({
    path: "/addons/bills-and-subscriptions/bill-linking/suggestions",
    component: React.lazy(() => Promise.resolve({ default: BillLinkingSuggestionsPage })),
  });

  ctx.router.add({
    path: "/addons/bills-and-subscriptions/bill-linking/links",
    component: React.lazy(() => Promise.resolve({ default: BillLinkingLinksPage })),
  });

  ctx.onDisable(() => {
    try { sidebarItem.remove(); } catch {}
  });
}