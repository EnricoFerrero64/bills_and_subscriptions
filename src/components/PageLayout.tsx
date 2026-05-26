import { useRef, useEffect, useState, useCallback } from "react";
import { CreditCard, BarChart2, Receipt, Settings, X } from "lucide-react";
import { getContext } from "../context";
import { getSettings, saveSettings, type AddonSettings } from "../lib/storage";
import type { ReactNode } from "react";

interface Tab {
  label: string;
  path: string;
  icon: ReactNode;
  settingKey?: keyof AddonSettings;
}

const ALL_TABS: Tab[] = [
  { label: "Summary",       path: "/addons/bills-and-subscriptions/summary", icon: <BarChart2  className="h-3.5 w-3.5" /> },
  { label: "Subscriptions", path: "/addons/bills-and-subscriptions",         icon: <CreditCard className="h-3.5 w-3.5" /> },
  { label: "Bills",         path: "/addons/bills-and-subscriptions/bills",   icon: <Receipt    className="h-3.5 w-3.5" />, settingKey: "billsEnabled" },
];

interface PageLayoutProps {
  children: ReactNode;
  activePath: string;
}

export function PageLayout({ children, activePath }: PageLayoutProps) {
  const ctx = getContext();
  const navRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const [animated, setAnimated] = useState(false);
  const [settings, setSettings] = useState<AddonSettings>(getSettings);
  const [showSettings, setShowSettings] = useState(false);

  const tabs = ALL_TABS.filter(
    (t) => !t.settingKey || settings[t.settingKey]
  );

  const measureTab = useCallback((path: string) => {
    const container = navRef.current;
    if (!container) return null;
    const btn = container.querySelector<HTMLElement>(`[data-path="${path}"]`);
    if (!btn) return null;
    return { left: btn.offsetLeft, width: btn.offsetWidth };
  }, []);

  useEffect(() => {
    const pos = measureTab(activePath);
    if (!pos) return;
    setAnimated(false);
    setIndicator(pos);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimated(true));
    });
  }, [activePath, measureTab]);

  const handleTabClick = (tab: Tab) => {
    if (tab.path === activePath) return;
    const pos = measureTab(tab.path);
    if (pos) setIndicator(pos);
    setTimeout(() => ctx.api.navigation.navigate(tab.path), 200);
  };

  const handleToggleSetting = (key: keyof AddonSettings) => {
    const next = { ...settings, [key]: !settings[key] };
    saveSettings(next);
    setSettings(next);

    // If we just disabled the active tab's feature, navigate away
    if (key === "billsEnabled" && !next.billsEnabled && activePath === "/addons/bills-and-subscriptions/bills") {
      ctx.api.navigation.navigate("/addons/bills-and-subscriptions/summary");
    }
  };

  return (
    <div className="bills-and-subscriptions-root flex flex-col min-h-screen bg-background text-foreground">

      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex flex-col gap-3 border-b border-border">

        {/* Title */}
        <span className="text-xl font-bold text-foreground tracking-tight">
          Subscriptions & Bills
        </span>

        {/* Pill nav + gear */}
        <div className="flex items-center gap-2 self-start">
        <div
          ref={navRef}
          className="relative inline-flex items-center rounded-full p-1 bg-muted"
        >
          <span
            className="absolute top-1 bottom-1 rounded-full bg-background"
            style={{
              left: indicator.left,
              width: indicator.width,
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              transition: animated
                ? "left 220ms cubic-bezier(0.4,0,0.2,1), width 220ms cubic-bezier(0.4,0,0.2,1)"
                : "none",
            }}
          />

          {tabs.map((tab) => {
            const isActive = activePath === tab.path;
            return (
              <button
                key={tab.path}
                data-path={tab.path}
                data-active={isActive}
                onClick={() => handleTabClick(tab)}
                className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-150 select-none ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShowSettings(true)}
          className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Settings className="h-3.5 w-3.5" />
        </button>
        </div>
      </div>

      {/* Page content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>

      {/* Settings modal */}
      {showSettings && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowSettings(false); }}
        >
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {/* Bills toggle */}
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm text-foreground">Bills tracking</span>
                  <span className="text-xs text-muted-foreground">Show the Bills tab and include bills in the summary</span>
                </div>
                <button
                  onClick={() => handleToggleSetting("billsEnabled")}
                  className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ml-4 ${
                    settings.billsEnabled ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-background shadow transition-transform ${
                      settings.billsEnabled ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
