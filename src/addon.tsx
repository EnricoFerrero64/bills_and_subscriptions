import "./index.css";
import React from "react";
import { Layers } from "lucide-react";
import type { AddonContext } from "@wealthfolio/addon-sdk";
import { setContext } from "./context";
import { SubscriptionsPage } from "./pages/SubscriptionsPage";
import { SummaryPage } from "./pages/SummaryPage";
import { BillsPage } from "./pages/BillsPage";
import { SuggestionsPage } from "./pages/SuggestionsPage";
import { LinksPage } from "./pages/LinksPage";

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

  ctx.router.add({
    path: "/addons/bills-and-subscriptions/suggestions",
    component: React.lazy(() => Promise.resolve({ default: SuggestionsPage })),
  });

  ctx.router.add({
    path: "/addons/bills-and-subscriptions/links",
    component: React.lazy(() => Promise.resolve({ default: LinksPage })),
  });

  ctx.onDisable(() => {
    try { sidebarItem.remove(); } catch {}
  });
}
