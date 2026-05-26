import "./index.css";
import React from "react";
import { Layers } from "lucide-react";
import type { AddonContext } from "@wealthfolio/addon-sdk";
import { setContext } from "./context";
import { SubscriptionsPage } from "./pages/SubscriptionsPage";
import { SummaryPage } from "./pages/SummaryPage";
import { BillsPage } from "./pages/BillsPage";

export default function enable(ctx: AddonContext) {
  setContext(ctx);

  const sidebarItem = ctx.sidebar.addItem({
    id: "subscription-stack",
    label: "Subscriptions & Bills",
    icon: <Layers className="h-5 w-5" />,
    route: "/addons/subscription-stack/summary",
    order: 400,
  });

  ctx.router.add({
    path: "/addons/subscription-stack",
    component: React.lazy(() => Promise.resolve({ default: SubscriptionsPage })),
  });

  ctx.router.add({
    path: "/addons/subscription-stack/summary",
    component: React.lazy(() => Promise.resolve({ default: SummaryPage })),
  });

  ctx.router.add({
    path: "/addons/subscription-stack/bills",
    component: React.lazy(() => Promise.resolve({ default: BillsPage })),
  });

  ctx.onDisable(() => {
    try { sidebarItem.remove(); } catch {}
  });
}
