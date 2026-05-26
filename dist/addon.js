const r$1 = () => window.React;
function makeElement(type, props, key) {
  const config = {};
  if (key !== void 0 && key !== null) {
    config.key = String(key);
  }
  if (props) {
    for (const k in props) {
      if (k !== "key") config[k] = props[k];
    }
  }
  const children = config.children;
  delete config.children;
  if (Array.isArray(children)) {
    return r$1().createElement(type, config, ...children);
  }
  if (children !== void 0) {
    return r$1().createElement(type, config, children);
  }
  return r$1().createElement(type, config);
}
function jsxDEV(type, props, key, _isStaticChildren, _source, _self) {
  return makeElement(type, props, key);
}
const r = () => window.React;
const ReactProxy = new Proxy({}, {
  get: (_t, key) => r()[key]
});
const useState = (...args) => r().useState(...args);
const useEffect = (...args) => r().useEffect(...args);
const useRef = (...args) => r().useRef(...args);
const useCallback = (...args) => r().useCallback(...args);
const useContext = (...args) => r().useContext(...args);
const createContext = (...args) => r().createContext(...args);
const forwardRef = (...args) => r().forwardRef(...args);
const createElement = (...args) => r().createElement(...args);
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};
const LucideContext = createContext({});
const useLucideContext = () => useContext(LucideContext);
const Icon = forwardRef(
  ({ color, size, strokeWidth, absoluteStrokeWidth, className = "", children, iconNode, ...rest }, ref) => {
    const {
      size: contextSize = 24,
      strokeWidth: contextStrokeWidth = 2,
      absoluteStrokeWidth: contextAbsoluteStrokeWidth = false,
      color: contextColor = "currentColor",
      className: contextClass = ""
    } = useLucideContext() ?? {};
    const calculatedStrokeWidth = absoluteStrokeWidth ?? contextAbsoluteStrokeWidth ? Number(strokeWidth ?? contextStrokeWidth) * 24 / Number(size ?? contextSize) : strokeWidth ?? contextStrokeWidth;
    return createElement(
      "svg",
      {
        ref,
        ...defaultAttributes,
        width: size ?? contextSize ?? defaultAttributes.width,
        height: size ?? contextSize ?? defaultAttributes.height,
        stroke: color ?? contextColor,
        strokeWidth: calculatedStrokeWidth,
        className: mergeClasses("lucide", contextClass, className),
        ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => createElement(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    );
  }
);
const createLucideIcon = (iconName, iconNode) => {
  const Component = forwardRef(
    ({ className, ...props }, ref) => createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
const __iconNode$b = [
  ["path", { d: "M5 21v-6", key: "1hz6c0" }],
  ["path", { d: "M12 21V3", key: "1lcnhd" }],
  ["path", { d: "M19 21V9", key: "unv183" }]
];
const ChartNoAxesColumn = createLucideIcon("chart-no-axes-column", __iconNode$b);
const __iconNode$a = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode$a);
const __iconNode$9 = [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
];
const CreditCard = createLucideIcon("credit-card", __iconNode$9);
const __iconNode$8 = [
  [
    "path",
    {
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
      key: "zw3jo"
    }
  ],
  [
    "path",
    {
      d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
      key: "1wduqc"
    }
  ],
  [
    "path",
    {
      d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
      key: "kqbvx6"
    }
  ]
];
const Layers = createLucideIcon("layers", __iconNode$8);
const __iconNode$7 = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode$7);
const __iconNode$6 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode$6);
const __iconNode$5 = [
  ["path", { d: "M12 17V7", key: "pyj7ub" }],
  ["path", { d: "M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8", key: "1elt7d" }],
  [
    "path",
    {
      d: "M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z",
      key: "ycz6yz"
    }
  ]
];
const Receipt = createLucideIcon("receipt", __iconNode$5);
const __iconNode$4 = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode$4);
const __iconNode$3 = [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "M10 11v6", key: "nco0om" }],
  ["path", { d: "M14 11v6", key: "outv1u" }],
  ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = createLucideIcon("zap", __iconNode);
let _ctx = null;
function setContext(ctx) {
  _ctx = ctx;
}
function getContext() {
  if (!_ctx) throw new Error("Addon context not initialized");
  return _ctx;
}
const FALLBACK = "USD";
function useBaseCurrency() {
  const [currency, setCurrency] = useState(FALLBACK);
  useEffect(() => {
    getContext().api.settings.get().then((s) => {
      if (s.baseCurrency) setCurrency(s.baseCurrency);
    }).catch(() => {
    });
  }, []);
  return currency;
}
const CATEGORIES = [
  "Entertainment",
  "Productivity",
  "Health & Fitness",
  "Finance",
  "News & Media",
  "Education",
  "Cloud & Storage",
  "Communication",
  "Shopping",
  "Utilities",
  "Other"
];
const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "JPY",
  "CHF",
  "SEK",
  "NOK",
  "DKK",
  "NZD",
  "SGD",
  "HKD",
  "BRL",
  "MXN",
  "INR",
  "KRW",
  "PLN",
  "CZK",
  "HUF"
];
const CYCLE_LABELS = {
  monthly: "/ mo",
  yearly: "/ yr",
  quarterly: "/ qtr",
  weekly: "/ wk"
};
const CATEGORY_COLORS = {
  "Entertainment": { bg: "rgba(148,97,212,0.15)", color: "#9461d4" },
  // purple
  "Productivity": { bg: "rgba(77,125,204,0.15)", color: "#4d7dcc" },
  // blue
  "Health & Fitness": { bg: "rgba(54,161,93,0.15)", color: "#36a15d" },
  // green
  "Finance": { bg: "rgba(181,128,38,0.15)", color: "#b58026" },
  // amber
  "News & Media": { bg: "rgba(198,83,133,0.15)", color: "#c65385" },
  // rose
  "Education": { bg: "rgba(59,176,164,0.15)", color: "#3bb0a4" },
  // teal
  "Cloud & Storage": { bg: "rgba(114,140,53,0.15)", color: "#728c35" },
  // olive
  "Communication": { bg: "rgba(91,92,200,0.15)", color: "#5b5cc8" },
  // indigo
  "Shopping": { bg: "rgba(175,140,44,0.15)", color: "#af8c2c" },
  // gold
  "Utilities": { bg: "rgba(210,114,45,0.15)", color: "#d2722d" },
  // orange
  "Other": { bg: "rgba(128,149,179,0.12)", color: "#8095b3" }
  // slate
};
const BILL_CATEGORIES = [
  "Electricity",
  "Water",
  "Gas",
  "Internet",
  "Phone",
  "Rent",
  "Insurance",
  "Other"
];
const BILL_CATEGORY_COLORS = {
  "Electricity": { bg: "rgba(175,140,44,0.15)", color: "#af8c2c" },
  // gold
  "Water": { bg: "rgba(59,176,164,0.15)", color: "#3bb0a4" },
  // teal
  "Gas": { bg: "rgba(210,114,45,0.15)", color: "#d2722d" },
  // orange
  "Internet": { bg: "rgba(91,92,200,0.15)", color: "#5b5cc8" },
  // indigo
  "Phone": { bg: "rgba(198,83,133,0.15)", color: "#c65385" },
  // rose
  "Rent": { bg: "rgba(200,64,64,0.15)", color: "#c84040" },
  // red
  "Insurance": { bg: "rgba(54,161,93,0.15)", color: "#36a15d" },
  // green
  "Other": { bg: "rgba(128,149,179,0.12)", color: "#8095b3" }
  // slate
};
const BILLS_KEY = "ss:bills";
function getBills() {
  return load(BILLS_KEY);
}
function saveBill(bill) {
  const all = load(BILLS_KEY);
  const idx = all.findIndex((b) => b.id === bill.id);
  if (idx >= 0) {
    all[idx] = bill;
  } else {
    all.unshift(bill);
  }
  save(BILLS_KEY, all);
}
function deleteBill(id) {
  save(BILLS_KEY, load(BILLS_KEY).filter((b) => b.id !== id));
}
const SETTINGS_KEY = "ss:settings";
const DEFAULT_SETTINGS = { billsEnabled: true };
function getSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}
function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent("ss:settings-changed"));
}
function extractDomain(website) {
  try {
    const url = website.startsWith("http") ? website : `https://${website}`;
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return website.replace(/^www\./, "");
  }
}
function toMonthly(amount, cycle) {
  switch (cycle) {
    case "weekly":
      return amount * 52 / 12;
    case "monthly":
      return amount;
    case "quarterly":
      return amount / 3;
    case "yearly":
      return amount / 12;
  }
}
function toYearly(amount, cycle) {
  switch (cycle) {
    case "weekly":
      return amount * 52;
    case "monthly":
      return amount * 12;
    case "quarterly":
      return amount * 4;
    case "yearly":
      return amount;
  }
}
function advanceDateByCycle(dateStr, cycle) {
  const d = new Date(dateStr);
  switch (cycle) {
    case "weekly":
      d.setDate(d.getDate() + 7);
      break;
    case "monthly":
      d.setMonth(d.getMonth() + 1);
      break;
    case "quarterly":
      d.setMonth(d.getMonth() + 3);
      break;
    case "yearly":
      d.setFullYear(d.getFullYear() + 1);
      break;
  }
  return d.toISOString().slice(0, 10);
}
function formatCurrency(amount, currency) {
  return new Intl.NumberFormat(void 0, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}
const SUBS_KEY = "ss:subscriptions";
function load(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function save(key, items) {
  localStorage.setItem(key, JSON.stringify(items));
}
function getSubscriptions() {
  return load(SUBS_KEY);
}
function saveSubscription(sub) {
  const all = load(SUBS_KEY);
  const idx = all.findIndex((s) => s.id === sub.id);
  if (idx >= 0) {
    all[idx] = sub;
  } else {
    all.unshift(sub);
  }
  save(SUBS_KEY, all);
}
function deleteSubscription(id) {
  save(SUBS_KEY, load(SUBS_KEY).filter((s) => s.id !== id));
}
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
const ALL_TABS = [
  { label: "Summary", path: "/addons/subscription-stack/summary", icon: /* @__PURE__ */ jsxDEV(ChartNoAxesColumn, { className: "h-3.5 w-3.5" }, void 0) },
  { label: "Subscriptions", path: "/addons/subscription-stack", icon: /* @__PURE__ */ jsxDEV(CreditCard, { className: "h-3.5 w-3.5" }, void 0) },
  { label: "Bills", path: "/addons/subscription-stack/bills", icon: /* @__PURE__ */ jsxDEV(Receipt, { className: "h-3.5 w-3.5" }, void 0), settingKey: "billsEnabled" }
];
function PageLayout({ children, activePath }) {
  const ctx = getContext();
  const navRef = useRef(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const [animated, setAnimated] = useState(false);
  const [settings, setSettings] = useState(getSettings);
  const [showSettings, setShowSettings] = useState(false);
  const tabs = ALL_TABS.filter(
    (t) => !t.settingKey || settings[t.settingKey]
  );
  const measureTab = useCallback((path) => {
    const container = navRef.current;
    if (!container) return null;
    const btn = container.querySelector(`[data-path="${path}"]`);
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
  }, []);
  const handleTabClick = (tab) => {
    if (tab.path === activePath) return;
    const pos = measureTab(tab.path);
    if (pos) setIndicator(pos);
    setTimeout(() => ctx.api.navigation.navigate(tab.path), 200);
  };
  const handleToggleSetting = (key) => {
    const next = { ...settings, [key]: !settings[key] };
    saveSettings(next);
    setSettings(next);
    if (!next.billsEnabled && activePath === "/addons/subscription-stack/bills") {
      ctx.api.navigation.navigate("/addons/subscription-stack/summary");
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "subscription-stack-root flex flex-col min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "px-4 pt-4 pb-3 flex flex-col gap-3 border-b border-border", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-bold text-foreground tracking-tight", children: "Subscriptions & Bills" }, void 0, false, {
        fileName: "E:/Projects/Apps/Subscription_Stack/src/components/PageLayout.tsx",
        lineNumber: 81,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 self-start", children: [
        /* @__PURE__ */ jsxDEV(
          "div",
          {
            ref: navRef,
            className: "relative inline-flex items-center rounded-full p-1 bg-muted",
            children: [
              /* @__PURE__ */ jsxDEV(
                "span",
                {
                  className: "absolute top-1 bottom-1 rounded-full bg-background",
                  style: {
                    left: indicator.left,
                    width: indicator.width,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    transition: animated ? "left 220ms cubic-bezier(0.4,0,0.2,1), width 220ms cubic-bezier(0.4,0,0.2,1)" : "none"
                  }
                },
                void 0,
                false,
                {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/components/PageLayout.tsx",
                  lineNumber: 91,
                  columnNumber: 11
                },
                this
              ),
              tabs.map((tab) => {
                const isActive = activePath === tab.path;
                return /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    "data-path": tab.path,
                    "data-active": isActive,
                    onClick: () => handleTabClick(tab),
                    className: `relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-150 select-none ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`,
                    children: [
                      tab.icon,
                      tab.label
                    ]
                  },
                  tab.path,
                  true,
                  {
                    fileName: "E:/Projects/Apps/Subscription_Stack/src/components/PageLayout.tsx",
                    lineNumber: 106,
                    columnNumber: 15
                  },
                  this
                );
              })
            ]
          },
          void 0,
          true,
          {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/components/PageLayout.tsx",
            lineNumber: 87,
            columnNumber: 9
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setShowSettings(true),
            className: "w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
            children: /* @__PURE__ */ jsxDEV(Settings, { className: "h-3.5 w-3.5" }, void 0, false, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/components/PageLayout.tsx",
              lineNumber: 128,
              columnNumber: 11
            }, this)
          },
          void 0,
          false,
          {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/components/PageLayout.tsx",
            lineNumber: 124,
            columnNumber: 9
          },
          this
        )
      ] }, void 0, true, {
        fileName: "E:/Projects/Apps/Subscription_Stack/src/components/PageLayout.tsx",
        lineNumber: 86,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "E:/Projects/Apps/Subscription_Stack/src/components/PageLayout.tsx",
      lineNumber: 78,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex-1 overflow-auto", children }, void 0, false, {
      fileName: "E:/Projects/Apps/Subscription_Stack/src/components/PageLayout.tsx",
      lineNumber: 134,
      columnNumber: 7
    }, this),
    showSettings && /* @__PURE__ */ jsxDEV(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4",
        style: { backgroundColor: "rgba(0,0,0,0.55)" },
        onClick: (e) => {
          if (e.target === e.currentTarget) setShowSettings(false);
        },
        children: /* @__PURE__ */ jsxDEV("div", { className: "bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-5 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxDEV("h2", { className: "text-sm font-semibold text-foreground", children: "Settings" }, void 0, false, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/components/PageLayout.tsx",
              lineNumber: 147,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => setShowSettings(false),
                className: "text-muted-foreground hover:text-foreground transition-colors",
                children: /* @__PURE__ */ jsxDEV(X, { className: "h-4 w-4" }, void 0, false, {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/components/PageLayout.tsx",
                  lineNumber: 152,
                  columnNumber: 17
                }, this)
              },
              void 0,
              false,
              {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/components/PageLayout.tsx",
                lineNumber: 148,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/components/PageLayout.tsx",
            lineNumber: 146,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-3", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between py-2 border-b border-border", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-0.5", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-sm text-foreground", children: "Bills tracking" }, void 0, false, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/components/PageLayout.tsx",
                lineNumber: 160,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground", children: "Show the Bills tab and include bills in the summary" }, void 0, false, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/components/PageLayout.tsx",
                lineNumber: 161,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/components/PageLayout.tsx",
              lineNumber: 159,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => handleToggleSetting("billsEnabled"),
                className: `relative w-10 h-6 rounded-full transition-colors shrink-0 ml-4 ${settings.billsEnabled ? "bg-primary" : "bg-muted"}`,
                children: /* @__PURE__ */ jsxDEV(
                  "span",
                  {
                    className: `absolute top-1 w-4 h-4 rounded-full bg-background shadow transition-transform ${settings.billsEnabled ? "translate-x-5" : "translate-x-1"}`
                  },
                  void 0,
                  false,
                  {
                    fileName: "E:/Projects/Apps/Subscription_Stack/src/components/PageLayout.tsx",
                    lineNumber: 169,
                    columnNumber: 19
                  },
                  this
                )
              },
              void 0,
              false,
              {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/components/PageLayout.tsx",
                lineNumber: 163,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/components/PageLayout.tsx",
            lineNumber: 158,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/components/PageLayout.tsx",
            lineNumber: 156,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/components/PageLayout.tsx",
          lineNumber: 145,
          columnNumber: 11
        }, this)
      },
      void 0,
      false,
      {
        fileName: "E:/Projects/Apps/Subscription_Stack/src/components/PageLayout.tsx",
        lineNumber: 140,
        columnNumber: 9
      },
      this
    )
  ] }, void 0);
}
function LogoAvatar({ name, website, colors, size = "md" }) {
  const [imgError, setImgError] = useState(false);
  const dim = size === "sm" ? "w-7 h-7" : "w-9 h-9";
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const domain = website ? extractDomain(website) : null;
  const faviconUrl = domain ? `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128` : null;
  if (faviconUrl && !imgError) {
    return /* @__PURE__ */ jsxDEV("div", { className: `${dim} rounded-lg overflow-hidden shrink-0 bg-white`, children: /* @__PURE__ */ jsxDEV(
      "img",
      {
        src: faviconUrl,
        alt: "",
        className: "w-full h-full object-cover",
        onError: () => setImgError(true)
      },
      void 0,
      false,
      {
        fileName: "E:/Projects/Apps/Subscription_Stack/src/components/LogoAvatar.tsx",
        lineNumber: 25,
        columnNumber: 9
      },
      this
    ) }, void 0);
  }
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: `${dim} rounded-lg flex items-center justify-center ${textSize} font-semibold shrink-0`,
      style: { backgroundColor: colors.bg, color: colors.color },
      children: name.charAt(0).toUpperCase()
    },
    void 0
  );
}
function blankSubForm(currency = "USD") {
  return {
    name: "",
    amount: "",
    currency,
    billingCycle: "monthly",
    category: "Other",
    website: "",
    notes: "",
    active: true
  };
}
function SubForm({ initial, editingId, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(initial);
  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const handleSave = () => {
    if (!form.name.trim() || !form.amount) return;
    onSave(form);
  };
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      style: { backgroundColor: "rgba(0,0,0,0.55)" },
      onClick: (e) => {
        if (e.target === e.currentTarget) onClose();
      },
      children: /* @__PURE__ */ jsxDEV("div", { className: "bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-5 flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxDEV("h2", { className: "text-sm font-semibold text-foreground", children: editingId ? "Edit subscription" : "Add subscription" }, void 0, false, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
          lineNumber: 61,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "text-xs text-muted-foreground", children: "Service name" }, void 0, false, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
            lineNumber: 67,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              autoFocus: true,
              type: "text",
              placeholder: "e.g. Netflix, Spotify…",
              value: form.name,
              onChange: (e) => set("name", e.target.value),
              className: "bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            },
            void 0,
            false,
            {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
              lineNumber: 68,
              columnNumber: 11
            },
            this
          )
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
          lineNumber: 66,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5 flex-1", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-xs text-muted-foreground", children: "Amount" }, void 0, false, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
              lineNumber: 81,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "number",
                min: "0",
                step: "0.01",
                placeholder: "0.00",
                value: form.amount,
                onChange: (e) => set("amount", e.target.value),
                className: "bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              },
              void 0,
              false,
              {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
                lineNumber: 82,
                columnNumber: 13
              },
              this
            )
          ] }, void 0, true, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
            lineNumber: 80,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5 w-28", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-xs text-muted-foreground", children: "Currency" }, void 0, false, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
              lineNumber: 93,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(
              "select",
              {
                value: form.currency,
                onChange: (e) => set("currency", e.target.value),
                className: "bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring",
                children: CURRENCIES.map((c) => /* @__PURE__ */ jsxDEV("option", { value: c, children: c }, c, false, {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
                  lineNumber: 99,
                  columnNumber: 38
                }, this))
              },
              void 0,
              false,
              {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
                lineNumber: 94,
                columnNumber: 13
              },
              this
            )
          ] }, void 0, true, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
            lineNumber: 92,
            columnNumber: 11
          }, this)
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
          lineNumber: 79,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "text-xs text-muted-foreground", children: "Billing cycle" }, void 0, false, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
            lineNumber: 106,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex gap-1.5", children: ["monthly", "yearly", "quarterly", "weekly"].map((cycle) => /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => set("billingCycle", cycle),
              className: `flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${form.billingCycle === cycle ? "bg-primary text-primary-foreground border-transparent" : "border-border text-muted-foreground hover:text-foreground hover:border-border"}`,
              children: cycle.charAt(0).toUpperCase() + cycle.slice(1)
            },
            cycle,
            false,
            {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
              lineNumber: 109,
              columnNumber: 15
            },
            this
          )) }, void 0, false, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
            lineNumber: 107,
            columnNumber: 11
          }, this)
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
          lineNumber: 105,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "text-xs text-muted-foreground", children: "Category" }, void 0, false, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
            lineNumber: 126,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV(
            "select",
            {
              value: form.category,
              onChange: (e) => set("category", e.target.value),
              className: "bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring",
              children: CATEGORIES.map((cat) => /* @__PURE__ */ jsxDEV("option", { value: cat, children: cat }, cat, false, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
                lineNumber: 132,
                columnNumber: 38
              }, this))
            },
            void 0,
            false,
            {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
              lineNumber: 127,
              columnNumber: 11
            },
            this
          )
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
          lineNumber: 125,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "text-xs text-muted-foreground", children: [
            "Website ",
            /* @__PURE__ */ jsxDEV("span", { className: "text-muted-foreground/50", children: "(optional — used to load logo)" }, void 0, false, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
              lineNumber: 139,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
            lineNumber: 138,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "text",
              placeholder: "e.g. netflix.com",
              value: form.website,
              onChange: (e) => set("website", e.target.value),
              className: "bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            },
            void 0,
            false,
            {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
              lineNumber: 141,
              columnNumber: 11
            },
            this
          )
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
          lineNumber: 137,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "text-xs text-muted-foreground", children: [
            "Notes ",
            /* @__PURE__ */ jsxDEV("span", { className: "text-muted-foreground/50", children: "(optional)" }, void 0, false, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
              lineNumber: 152,
              columnNumber: 66
            }, this)
          ] }, void 0, true, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
            lineNumber: 152,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "text",
              placeholder: "e.g. Family plan, shared with…",
              value: form.notes,
              onChange: (e) => set("notes", e.target.value),
              className: "bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            },
            void 0,
            false,
            {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
              lineNumber: 153,
              columnNumber: 11
            },
            this
          )
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
          lineNumber: 151,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 pt-1 border-t border-border mt-1", children: [
          editingId && /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => onDelete(editingId),
              className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors",
              children: [
                /* @__PURE__ */ jsxDEV(Trash2, { className: "h-3.5 w-3.5" }, void 0, false, {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
                  lineNumber: 169,
                  columnNumber: 15
                }, this),
                "Delete"
              ]
            },
            void 0,
            true,
            {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
              lineNumber: 165,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("div", { className: "flex-1" }, void 0, false, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
            lineNumber: 173,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: onClose,
              className: "px-4 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
              children: "Cancel"
            },
            void 0,
            false,
            {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
              lineNumber: 174,
              columnNumber: 11
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: handleSave,
              disabled: !form.name.trim() || !form.amount,
              className: "px-4 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-40 transition-opacity bg-primary text-primary-foreground",
              children: editingId ? "Save" : "Add"
            },
            void 0,
            false,
            {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
              lineNumber: 180,
              columnNumber: 11
            },
            this
          )
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
          lineNumber: 163,
          columnNumber: 9
        }, this)
      ] }, void 0, true, {
        fileName: "E:/Projects/Apps/Subscription_Stack/src/components/SubForm.tsx",
        lineNumber: 60,
        columnNumber: 7
      }, this)
    },
    void 0
  );
}
const CURRENT_PATH$2 = "/addons/subscription-stack";
function SubscriptionsPage() {
  const baseCurrency = useBaseCurrency();
  const [subscriptions, setSubscriptions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formInitial, setFormInitial] = useState(() => ({ ...blankSubForm(baseCurrency), currency: baseCurrency }));
  const [listOpen, setListOpen] = useState(true);
  const refresh = useCallback(() => {
    setSubscriptions(getSubscriptions());
  }, []);
  useEffect(() => {
    refresh();
  }, [refresh]);
  const openAdd = () => {
    setEditingId(null);
    setFormInitial({ ...blankSubForm(baseCurrency), currency: baseCurrency });
    setShowForm(true);
  };
  const openEdit = (sub) => {
    setEditingId(sub.id);
    setFormInitial({
      name: sub.name,
      amount: String(sub.amount),
      currency: sub.currency,
      billingCycle: sub.billingCycle,
      category: sub.category,
      website: sub.website ?? "",
      notes: sub.notes ?? "",
      active: sub.active
    });
    setShowForm(true);
  };
  const handleSave = (form) => {
    const sub = {
      id: editingId ?? generateId(),
      name: form.name.trim(),
      amount: parseFloat(form.amount) || 0,
      currency: form.currency,
      billingCycle: form.billingCycle,
      category: form.category,
      website: form.website.trim() || void 0,
      notes: form.notes.trim() || void 0,
      active: form.active
    };
    saveSubscription(sub);
    refresh();
    setShowForm(false);
  };
  const handleDelete = (id) => {
    deleteSubscription(id);
    refresh();
    setShowForm(false);
  };
  const toggleActive = (sub) => {
    saveSubscription({ ...sub, active: !sub.active });
    refresh();
  };
  const activeSubs = subscriptions.filter((s) => s.active);
  const currencyTotals = activeSubs.reduce((acc, s) => {
    const cur = s.currency;
    if (!acc[cur]) acc[cur] = { monthly: 0, yearly: 0 };
    acc[cur].monthly += toMonthly(s.amount, s.billingCycle);
    acc[cur].yearly += toMonthly(s.amount, s.billingCycle) * 12;
    return acc;
  }, {});
  const sortedSubs = [...subscriptions].sort((a, b) => {
    if (a.active !== b.active) return a.active ? -1 : 1;
    return toMonthly(b.amount, b.billingCycle) - toMonthly(a.amount, a.billingCycle);
  });
  const currencies = Object.keys(currencyTotals);
  const primaryCurrency = currencies[0] ?? "USD";
  const mixedCurrencies = currencies.length > 1;
  return /* @__PURE__ */ jsxDEV(PageLayout, { activePath: CURRENT_PATH$2, children: [
    /* @__PURE__ */ jsxDEV("div", { className: "px-4 py-4 flex flex-col gap-3 max-w-2xl", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxDEV("h1", { className: "text-base font-semibold text-foreground", children: "Subscriptions" }, void 0, false, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
          lineNumber: 110,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: openAdd,
            className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground",
            children: [
              /* @__PURE__ */ jsxDEV(Plus, { className: "h-3.5 w-3.5" }, void 0, false, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
                lineNumber: 115,
                columnNumber: 13
              }, this),
              "Add"
            ]
          },
          void 0,
          true,
          {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
            lineNumber: 111,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
        lineNumber: 109,
        columnNumber: 9
      }, this),
      activeSubs.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "bg-card border border-border rounded-xl p-6", children: mixedCurrencies ? /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-5", children: currencies.map((cur) => /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-0.5", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground", children: [
          cur,
          " / month"
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
          lineNumber: 127,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-bold text-foreground tabular-nums", children: formatCurrency(currencyTotals[cur].monthly, cur) }, void 0, false, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
          lineNumber: 128,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground", children: [
          formatCurrency(currencyTotals[cur].yearly, cur),
          " / yr"
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
          lineNumber: 131,
          columnNumber: 21
        }, this)
      ] }, cur, true, {
        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
        lineNumber: 126,
        columnNumber: 19
      }, this)) }, void 0, false, {
        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
        lineNumber: 124,
        columnNumber: 15
      }, this) : /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-6", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-0.5", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground", children: "Monthly" }, void 0, false, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
            lineNumber: 140,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-4xl font-bold text-foreground tabular-nums", children: formatCurrency(currencyTotals[primaryCurrency].monthly, primaryCurrency) }, void 0, false, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
            lineNumber: 141,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
          lineNumber: 139,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "w-px bg-border self-stretch" }, void 0, false, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
          lineNumber: 145,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-0.5", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground", children: "Yearly" }, void 0, false, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
            lineNumber: 147,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-semibold text-foreground tabular-nums", children: formatCurrency(currencyTotals[primaryCurrency].yearly, primaryCurrency) }, void 0, false, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
            lineNumber: 148,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
          lineNumber: 146,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex-1" }, void 0, false, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
          lineNumber: 152,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-end gap-0.5", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground", children: [
            activeSubs.length,
            " active"
          ] }, void 0, true, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
            lineNumber: 154,
            columnNumber: 19
          }, this),
          subscriptions.length > activeSubs.length && /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground", children: [
            subscriptions.length - activeSubs.length,
            " paused"
          ] }, void 0, true, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
            lineNumber: 156,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
          lineNumber: 153,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
        lineNumber: 138,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
        lineNumber: 122,
        columnNumber: 11
      }, this),
      sortedSubs.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center justify-center py-16 gap-3 text-center", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "w-12 h-12 rounded-lg bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxDEV(CreditCard, { className: "h-6 w-6 text-muted-foreground" }, void 0, false, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
          lineNumber: 170,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
          lineNumber: 169,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-muted-foreground", children: "No subscriptions yet." }, void 0, false, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
          lineNumber: 172,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: openAdd,
            className: "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold mt-1 bg-primary text-primary-foreground",
            children: [
              /* @__PURE__ */ jsxDEV(Plus, { className: "h-3.5 w-3.5" }, void 0, false, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
                lineNumber: 177,
                columnNumber: 15
              }, this),
              "Add your first subscription"
            ]
          },
          void 0,
          true,
          {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
            lineNumber: 173,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
        lineNumber: 168,
        columnNumber: 11
      }, this) : /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setListOpen((o) => !o),
            className: "flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors py-1 select-none w-fit",
            children: [
              /* @__PURE__ */ jsxDEV(
                ChevronDown,
                {
                  className: "h-3.5 w-3.5 transition-transform duration-200",
                  style: { transform: listOpen ? "rotate(0deg)" : "rotate(-90deg)" }
                },
                void 0,
                false,
                {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
                  lineNumber: 189,
                  columnNumber: 15
                },
                this
              ),
              sortedSubs.length,
              " subscription",
              sortedSubs.length !== 1 ? "s" : ""
            ]
          },
          void 0,
          true,
          {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
            lineNumber: 185,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "div",
          {
            className: "grid transition-all duration-200",
            style: { gridTemplateRows: listOpen ? "1fr" : "0fr" },
            children: /* @__PURE__ */ jsxDEV("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5", children: sortedSubs.map((sub) => {
              const catColors = CATEGORY_COLORS[sub.category];
              const monthly = toMonthly(sub.amount, sub.billingCycle);
              const isNotMonthly = sub.billingCycle !== "monthly";
              return /* @__PURE__ */ jsxDEV(
                "div",
                {
                  className: `bg-card border border-border rounded-xl px-3 py-2.5 flex items-center gap-3 transition-opacity ${sub.active ? "" : "opacity-45"}`,
                  children: [
                    /* @__PURE__ */ jsxDEV(LogoAvatar, { name: sub.name, website: sub.website, colors: CATEGORY_COLORS[sub.category] }, void 0, false, {
                      fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
                      lineNumber: 215,
                      columnNumber: 19
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-medium text-foreground truncate", children: sub.name }, void 0, false, {
                        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
                        lineNumber: 219,
                        columnNumber: 21
                      }, this),
                      /* @__PURE__ */ jsxDEV(
                        "span",
                        {
                          className: "text-xs px-2 py-0.5 rounded-full font-medium shrink-0",
                          style: { backgroundColor: catColors.bg, color: catColors.color },
                          children: sub.category
                        },
                        void 0,
                        false,
                        {
                          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
                          lineNumber: 220,
                          columnNumber: 21
                        },
                        this
                      )
                    ] }, void 0, true, {
                      fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
                      lineNumber: 218,
                      columnNumber: 19
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-end gap-0.5 shrink-0", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-semibold text-foreground tabular-nums", children: [
                        formatCurrency(sub.amount, sub.currency),
                        " ",
                        /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-normal text-muted-foreground", children: CYCLE_LABELS[sub.billingCycle] }, void 0, false, {
                          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
                          lineNumber: 232,
                          columnNumber: 23
                        }, this)
                      ] }, void 0, true, {
                        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
                        lineNumber: 230,
                        columnNumber: 21
                      }, this),
                      isNotMonthly && /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
                        "≈ ",
                        formatCurrency(monthly, sub.currency),
                        "/mo"
                      ] }, void 0, true, {
                        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
                        lineNumber: 237,
                        columnNumber: 23
                      }, this)
                    ] }, void 0, true, {
                      fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
                      lineNumber: 229,
                      columnNumber: 19
                    }, this),
                    /* @__PURE__ */ jsxDEV(
                      "button",
                      {
                        onClick: () => toggleActive(sub),
                        title: sub.active ? "Pause" : "Resume",
                        className: `w-7 h-3.5 rounded-full transition-colors shrink-0 relative ${sub.active ? "bg-primary" : "bg-muted"}`,
                        children: /* @__PURE__ */ jsxDEV(
                          "span",
                          {
                            className: "absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full shadow transition-all",
                            style: { left: sub.active ? "calc(100% - 12px)" : "2px" }
                          },
                          void 0,
                          false,
                          {
                            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
                            lineNumber: 250,
                            columnNumber: 21
                          },
                          this
                        )
                      },
                      void 0,
                      false,
                      {
                        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
                        lineNumber: 244,
                        columnNumber: 19
                      },
                      this
                    ),
                    /* @__PURE__ */ jsxDEV(
                      "button",
                      {
                        onClick: () => openEdit(sub),
                        className: "text-muted-foreground hover:text-foreground transition-colors shrink-0 p-1 rounded-lg hover:bg-muted",
                        children: /* @__PURE__ */ jsxDEV(Pencil, { className: "h-3.5 w-3.5" }, void 0, false, {
                          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
                          lineNumber: 261,
                          columnNumber: 21
                        }, this)
                      },
                      void 0,
                      false,
                      {
                        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
                        lineNumber: 257,
                        columnNumber: 19
                      },
                      this
                    )
                  ]
                },
                sub.id,
                true,
                {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
                  lineNumber: 209,
                  columnNumber: 17
                },
                this
              );
            }) }, void 0, false, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
              lineNumber: 202,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
              lineNumber: 201,
              columnNumber: 15
            }, this)
          },
          void 0,
          false,
          {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
            lineNumber: 197,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
        lineNumber: 182,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
      lineNumber: 106,
      columnNumber: 7
    }, this),
    showForm && /* @__PURE__ */ jsxDEV(
      SubForm,
      {
        initial: formInitial,
        editingId,
        onSave: handleSave,
        onDelete: handleDelete,
        onClose: () => setShowForm(false)
      },
      void 0,
      false,
      {
        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SubscriptionsPage.tsx",
        lineNumber: 274,
        columnNumber: 9
      },
      this
    )
  ] }, void 0);
}
const CURRENT_PATH$1 = "/addons/subscription-stack/summary";
function currentMonthLabel() {
  return (/* @__PURE__ */ new Date()).toLocaleDateString(void 0, { month: "long", year: "numeric" });
}
function billMonthLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString(void 0, { month: "long", year: "numeric" });
}
function SummaryPage() {
  const baseCurrency = useBaseCurrency();
  const [settings, setSettings] = useState(getSettings);
  const billsEnabled = settings.billsEnabled;
  const [subscriptions, setSubscriptions] = useState([]);
  const [bills, setBills] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  useEffect(() => {
    const onSettingsChanged = () => {
      const next = getSettings();
      setSettings(next);
      if (!next.billsEnabled) setBills([]);
      else setBills(getBills());
    };
    window.addEventListener("ss:settings-changed", onSettingsChanged);
    return () => window.removeEventListener("ss:settings-changed", onSettingsChanged);
  }, []);
  useEffect(() => {
    setSubscriptions(getSubscriptions());
    if (billsEnabled) setBills(getBills());
  }, [billsEnabled]);
  const handleAddSub = (form) => {
    saveSubscription({
      id: generateId(),
      name: form.name.trim(),
      amount: parseFloat(form.amount) || 0,
      currency: form.currency,
      billingCycle: form.billingCycle,
      category: form.category,
      website: form.website || void 0,
      notes: form.notes || void 0,
      active: true
    });
    setSubscriptions(getSubscriptions());
    setShowAddForm(false);
  };
  const active = subscriptions.filter((s) => s.active);
  const byCurrency = active.reduce((acc, s) => {
    if (!acc[s.currency]) acc[s.currency] = [];
    acc[s.currency].push(s);
    return acc;
  }, {});
  const currencies = Object.keys(byCurrency);
  const primaryCurrency = currencies[0] ?? "USD";
  const primarySubs = byCurrency[primaryCurrency] ?? [];
  const grandMonthly = primarySubs.reduce((sum, s) => sum + toMonthly(s.amount, s.billingCycle), 0);
  const grandYearly = primarySubs.reduce((sum, s) => sum + toYearly(s.amount, s.billingCycle), 0);
  const subCategoryMap = primarySubs.reduce((acc, s) => {
    const cat = s.category;
    if (!acc[cat]) acc[cat] = { category: cat, monthly: 0, yearly: 0, currency: s.currency, count: 0 };
    acc[cat].monthly += toMonthly(s.amount, s.billingCycle);
    acc[cat].yearly += toYearly(s.amount, s.billingCycle);
    acc[cat].count += 1;
    return acc;
  }, {});
  const subCategoryTotals = Object.values(subCategoryMap).sort((a, b) => b.monthly - a.monthly);
  const maxSubMonthly = subCategoryTotals[0]?.monthly ?? 1;
  const sortedSubs = [...primarySubs].sort((a, b) => toMonthly(b.amount, b.billingCycle) - toMonthly(a.amount, a.billingCycle));
  const thisMonth = currentMonthLabel();
  const thisMonthBills = bills.filter((b) => billMonthLabel(b.date) === thisMonth);
  const billPrimaryCur = thisMonthBills[0]?.currency ?? primaryCurrency;
  const billMonthTotal = thisMonthBills.reduce((sum, b) => sum + b.amount, 0);
  const billUnpaidTotal = thisMonthBills.filter((b) => !b.paid).reduce((sum, b) => sum + b.amount, 0);
  const billUnpaidCount = thisMonthBills.filter((b) => !b.paid).length;
  const billCategoryMap = bills.reduce((acc, b) => {
    const cat = b.category;
    if (!acc[cat]) acc[cat] = { category: cat, total: 0, currency: b.currency, count: 0, bills: [] };
    acc[cat].total += b.amount;
    acc[cat].count += 1;
    const isDuplicate = acc[cat].bills.some((existing) => {
      if (b.website && existing.website)
        return extractDomain(b.website) === extractDomain(existing.website);
      return existing.name.trim().toLowerCase() === b.name.trim().toLowerCase();
    });
    if (!isDuplicate) acc[cat].bills.push(b);
    return acc;
  }, {});
  const billCategoryTotals = Object.values(billCategoryMap).sort((a, b) => b.total - a.total);
  const maxBillTotal = billCategoryTotals[0]?.total ?? 1;
  const billsByMonth = bills.reduce((acc, b) => {
    const m = billMonthLabel(b.date);
    if (!acc[m]) acc[m] = { total: 0, currency: b.currency };
    acc[m].total += b.amount;
    return acc;
  }, {});
  const billMonthHistory = Object.entries(billsByMonth).sort(([a], [b]) => {
    const toSort = (label) => {
      const d = new Date(label);
      return isNaN(d.getTime()) ? label : d.toISOString();
    };
    return toSort(b).localeCompare(toSort(a));
  }).slice(0, 6).reverse();
  const maxMonthHistory = Math.max(...billMonthHistory.map(([, v]) => v.total), 1);
  const hasSubscriptions = active.length > 0;
  const hasBills = billsEnabled && bills.length > 0;
  const billMonthCount = Object.keys(billsByMonth).length;
  const billTotalAllTime = bills.reduce((sum, b) => sum + b.amount, 0);
  const billMonthlyAvg = billMonthCount > 0 ? billTotalAllTime / billMonthCount : 0;
  const combinedCurrency = primaryCurrency;
  const combinedMonthly = grandMonthly + billMonthlyAvg;
  const combinedYearly = grandYearly + billMonthlyAvg * 12;
  const currenciesMismatch = hasBills && billPrimaryCur !== primaryCurrency && primaryCurrency !== "USD";
  if (!hasSubscriptions && !hasBills) {
    return /* @__PURE__ */ jsxDEV(PageLayout, { activePath: CURRENT_PATH$1, children: /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center justify-center py-20 gap-2 text-center px-4", children: [
      /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-muted-foreground", children: "Nothing to summarise yet." }, void 0, false, {
        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
        lineNumber: 189,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-muted-foreground/60", children: "Add subscriptions or bills to see your spending overview." }, void 0, false, {
        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
        lineNumber: 190,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
      lineNumber: 188,
      columnNumber: 9
    }, this) }, void 0);
  }
  return /* @__PURE__ */ jsxDEV(PageLayout, { activePath: CURRENT_PATH$1, children: [
    /* @__PURE__ */ jsxDEV("div", { className: "px-4 py-4 flex flex-col gap-4", children: [
      (hasSubscriptions || hasBills) && /* @__PURE__ */ jsxDEV("div", { className: "border rounded-xl p-5 w-1/2", style: { backgroundColor: "color-mix(in srgb, var(--chart-1) 8%, transparent)", borderColor: "color-mix(in srgb, var(--chart-1) 25%, transparent)" }, children: [
        /* @__PURE__ */ jsxDEV("div", { className: `grid divide-x divide-border items-stretch ${hasBills ? "grid-cols-3" : "grid-cols-2"}`, children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col justify-center gap-1 pr-5", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground uppercase tracking-wide font-semibold", children: "Total spend" }, void 0, false, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
              lineNumber: 207,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-3xl font-bold text-foreground tabular-nums leading-none", children: formatCurrency(combinedMonthly, combinedCurrency) }, void 0, false, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
              lineNumber: 208,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground", children: "per month" }, void 0, false, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
              lineNumber: 211,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
            lineNumber: 206,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col justify-center gap-1 px-5", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground uppercase tracking-wide font-semibold", children: "Yearly projection" }, void 0, false, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
              lineNumber: 216,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-3xl font-bold text-foreground tabular-nums leading-none", children: formatCurrency(combinedYearly, combinedCurrency) }, void 0, false, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
              lineNumber: 217,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground", children: [
              formatCurrency(combinedYearly / 52, combinedCurrency),
              " / week"
            ] }, void 0, true, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
              lineNumber: 220,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
            lineNumber: 215,
            columnNumber: 15
          }, this),
          hasSubscriptions && hasBills && combinedMonthly > 0 && /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col justify-center gap-3 pl-5", children: [
            (() => {
              const pct = Math.round(grandMonthly / combinedMonthly * 100);
              return /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between text-xs", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-muted-foreground", children: "Subscriptions" }, void 0, false, {
                    fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                    lineNumber: 233,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "font-semibold text-foreground tabular-nums", children: formatCurrency(grandMonthly, combinedCurrency) }, void 0, false, {
                    fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                    lineNumber: 234,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                  lineNumber: 232,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "relative h-3 rounded-full overflow-hidden", style: { backgroundColor: "color-mix(in srgb, var(--chart-1) 20%, transparent)" }, children: /* @__PURE__ */ jsxDEV("div", { className: "h-full rounded-full flex items-center", style: { width: `${pct}%`, backgroundColor: "color-mix(in srgb, var(--chart-1) 60%, var(--chart-2))" }, children: /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-semibold text-white px-2 whitespace-nowrap", children: [
                  pct,
                  "%"
                ] }, void 0, true, {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                  lineNumber: 238,
                  columnNumber: 29
                }, this) }, void 0, false, {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                  lineNumber: 237,
                  columnNumber: 27
                }, this) }, void 0, false, {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                  lineNumber: 236,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                lineNumber: 231,
                columnNumber: 23
              }, this);
            })(),
            (() => {
              const pct = Math.round(billMonthlyAvg / combinedMonthly * 100);
              return /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between text-xs", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-muted-foreground", children: "Bills" }, void 0, false, {
                    fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                    lineNumber: 249,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "font-semibold text-foreground tabular-nums", children: formatCurrency(billMonthlyAvg, combinedCurrency) }, void 0, false, {
                    fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                    lineNumber: 250,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                  lineNumber: 248,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "relative h-3 rounded-full overflow-hidden", style: { backgroundColor: "color-mix(in srgb, var(--chart-5) 20%, transparent)" }, children: /* @__PURE__ */ jsxDEV("div", { className: "h-full rounded-full flex items-center", style: { width: `${pct}%`, backgroundColor: "color-mix(in srgb, var(--chart-5) 60%, var(--chart-6))" }, children: /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-semibold text-white px-2 whitespace-nowrap", children: [
                  pct,
                  "%"
                ] }, void 0, true, {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                  lineNumber: 254,
                  columnNumber: 29
                }, this) }, void 0, false, {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                  lineNumber: 253,
                  columnNumber: 27
                }, this) }, void 0, false, {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                  lineNumber: 252,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                lineNumber: 247,
                columnNumber: 23
              }, this);
            })()
          ] }, void 0, true, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
            lineNumber: 227,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
          lineNumber: 203,
          columnNumber: 13
        }, this),
        currenciesMismatch && /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-muted-foreground/60 mt-3", children: [
          "Bills are in ",
          billPrimaryCur,
          "; combined total uses ",
          combinedCurrency,
          " figures as-is."
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
          lineNumber: 265,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
        lineNumber: 202,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-4 items-start", children: [
        hasSubscriptions && /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxDEV("h2", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Subscriptions" }, void 0, false, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
            lineNumber: 278,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "bg-card border border-border rounded-xl p-4 flex flex-col gap-1", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground", children: "Monthly" }, void 0, false, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                lineNumber: 282,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-bold text-foreground tabular-nums", children: formatCurrency(grandMonthly, primaryCurrency) }, void 0, false, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                lineNumber: 283,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground", children: [
                active.length,
                " active"
              ] }, void 0, true, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                lineNumber: 286,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
              lineNumber: 281,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "bg-card border border-border rounded-xl p-4 flex flex-col gap-1", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground", children: "Yearly" }, void 0, false, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                lineNumber: 289,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-bold text-foreground tabular-nums", children: formatCurrency(grandYearly, primaryCurrency) }, void 0, false, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                lineNumber: 290,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground", children: [
                formatCurrency(grandYearly / 52, primaryCurrency),
                "/wk"
              ] }, void 0, true, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                lineNumber: 293,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
              lineNumber: 288,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
            lineNumber: 280,
            columnNumber: 15
          }, this),
          currencies.length > 1 && /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-muted-foreground/70 px-1", children: [
            "Showing ",
            primaryCurrency,
            " only. Also in ",
            currencies.slice(1).join(", "),
            "."
          ] }, void 0, true, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
            lineNumber: 300,
            columnNumber: 17
          }, this),
          subCategoryTotals.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "bg-card border border-border rounded-xl p-4 flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxDEV("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "By category" }, void 0, false, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
              lineNumber: 307,
              columnNumber: 19
            }, this),
            subCategoryTotals.map((ct) => {
              const colors = CATEGORY_COLORS[ct.category];
              const barPct = Math.round(ct.monthly / maxSubMonthly * 100);
              return /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "text-xs px-2 py-0.5 rounded-full font-medium", style: { backgroundColor: colors.bg, color: colors.color }, children: ct.category }, void 0, false, {
                      fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                      lineNumber: 315,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground/60", children: [
                      ct.count,
                      " ",
                      ct.count === 1 ? "sub" : "subs"
                    ] }, void 0, true, {
                      fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                      lineNumber: 318,
                      columnNumber: 29
                    }, this)
                  ] }, void 0, true, {
                    fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                    lineNumber: 314,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-semibold text-foreground tabular-nums", children: [
                    formatCurrency(ct.monthly, ct.currency),
                    /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-normal text-muted-foreground", children: "/mo" }, void 0, false, {
                      fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                      lineNumber: 321,
                      columnNumber: 70
                    }, this)
                  ] }, void 0, true, {
                    fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                    lineNumber: 320,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                  lineNumber: 313,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "h-1 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxDEV("div", { className: "h-full rounded-full", style: { width: `${barPct}%`, backgroundColor: colors.color, opacity: 0.7 } }, void 0, false, {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                  lineNumber: 325,
                  columnNumber: 27
                }, this) }, void 0, false, {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                  lineNumber: 324,
                  columnNumber: 25
                }, this)
              ] }, ct.category, true, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                lineNumber: 312,
                columnNumber: 23
              }, this);
            })
          ] }, void 0, true, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
            lineNumber: 306,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-card border border-border rounded-xl p-4 flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxDEV("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Stack" }, void 0, false, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                lineNumber: 335,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => setShowAddForm(true),
                  className: "w-5 h-5 rounded-full flex items-center justify-center bg-muted hover:bg-muted-foreground/20 transition-colors",
                  children: /* @__PURE__ */ jsxDEV(Plus, { className: "w-3 h-3 text-muted-foreground" }, void 0, false, {
                    fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                    lineNumber: 340,
                    columnNumber: 21
                  }, this)
                },
                void 0,
                false,
                {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                  lineNumber: 336,
                  columnNumber: 19
                },
                this
              )
            ] }, void 0, true, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
              lineNumber: 334,
              columnNumber: 17
            }, this),
            sortedSubs.length === 0 ? /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-muted-foreground/60 py-2", children: "No active subscriptions." }, void 0, false, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
              lineNumber: 345,
              columnNumber: 19
            }, this) : sortedSubs.map((sub, idx) => /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground/50 w-4 text-right shrink-0 tabular-nums", children: idx + 1 }, void 0, false, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                lineNumber: 349,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV(LogoAvatar, { name: sub.name, website: sub.website, colors: CATEGORY_COLORS[sub.category], size: "sm" }, void 0, false, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                lineNumber: 350,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-sm text-foreground flex-1 truncate", children: sub.name }, void 0, false, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                lineNumber: 351,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-semibold text-foreground tabular-nums shrink-0", children: [
                formatCurrency(toMonthly(sub.amount, sub.billingCycle), sub.currency),
                /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-normal text-muted-foreground", children: "/mo" }, void 0, false, {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                  lineNumber: 354,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                lineNumber: 352,
                columnNumber: 23
              }, this)
            ] }, sub.id, true, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
              lineNumber: 348,
              columnNumber: 21
            }, this))
          ] }, void 0, true, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
            lineNumber: 333,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
          lineNumber: 277,
          columnNumber: 13
        }, this),
        hasBills && /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxDEV("h2", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Bills" }, void 0, false, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
            lineNumber: 367,
            columnNumber: 15
          }, this),
          thisMonthBills.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "bg-card border border-border rounded-xl p-4 flex flex-col gap-1", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground", children: "This month" }, void 0, false, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                lineNumber: 372,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-bold text-foreground tabular-nums", children: formatCurrency(billMonthTotal, billPrimaryCur) }, void 0, false, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                lineNumber: 373,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground", children: [
                thisMonthBills.length,
                " bill",
                thisMonthBills.length !== 1 ? "s" : ""
              ] }, void 0, true, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                lineNumber: 376,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
              lineNumber: 371,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "bg-card border border-border rounded-xl p-4 flex flex-col gap-1", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground", children: "Unpaid" }, void 0, false, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                lineNumber: 379,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-bold text-foreground tabular-nums", children: formatCurrency(billUnpaidTotal, billPrimaryCur) }, void 0, false, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                lineNumber: 380,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground", children: [
                billUnpaidCount,
                " outstanding"
              ] }, void 0, true, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                lineNumber: 383,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
              lineNumber: 378,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
            lineNumber: 370,
            columnNumber: 17
          }, this),
          billMonthHistory.length > 1 && (() => {
            const VIEW_W = 480;
            const VIEW_H = 180;
            const PAD_L = 44;
            const PAD_R = 44;
            const PAD_T = 12;
            const PAD_B = 22;
            const plotW = VIEW_W - PAD_L - PAD_R;
            const plotH = VIEW_H - PAD_T - PAD_B;
            const n = billMonthHistory.length;
            const slotW = plotW / n;
            const barW = Math.max(slotW * 0.24, 3);
            const cumulativeTotals = [];
            let running = 0;
            for (const [, { total }] of billMonthHistory) {
              running += total;
              cumulativeTotals.push(running);
            }
            const maxCumulative = running || 1;
            const barYMax = maxMonthHistory || 1;
            const toX = (i) => PAD_L + slotW * i + slotW / 2;
            const toBarY = (v) => PAD_T + plotH - v / barYMax * plotH;
            const toLineY = (v) => PAD_T + plotH - v / maxCumulative * plotH;
            const TICK_COUNT = 4;
            const barTicks = Array.from({ length: TICK_COUNT + 1 }, (_, i) => Math.round(i / TICK_COUNT * barYMax));
            const lineTicks = Array.from({ length: TICK_COUNT + 1 }, (_, i) => Math.round(i / TICK_COUNT * maxCumulative));
            const linePoints = cumulativeTotals.map((v, i) => `${toX(i)},${toLineY(v)}`).join(" ");
            const fmtTick = (v) => {
              if (v >= 1e4) return `${(v / 1e3).toFixed(0)}k`;
              if (v >= 1e3) return `${(v / 1e3).toFixed(1)}k`;
              return String(Math.round(v));
            };
            return /* @__PURE__ */ jsxDEV("div", { className: "bg-card border border-border rounded-xl p-4 flex flex-col gap-2", children: [
              /* @__PURE__ */ jsxDEV("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Monthly history" }, void 0, false, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                lineNumber: 427,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("svg", { viewBox: `0 0 ${VIEW_W} ${VIEW_H}`, width: "100%", className: "overflow-visible", children: [
                barTicks.map((tick, i) => /* @__PURE__ */ jsxDEV(
                  "line",
                  {
                    x1: PAD_L,
                    y1: toBarY(tick),
                    x2: VIEW_W - PAD_R,
                    y2: toBarY(tick),
                    stroke: "currentColor",
                    strokeOpacity: i === 0 ? 0 : 0.06,
                    strokeWidth: "1"
                  },
                  i,
                  false,
                  {
                    fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                    lineNumber: 431,
                    columnNumber: 25
                  },
                  this
                )),
                /* @__PURE__ */ jsxDEV(
                  "line",
                  {
                    x1: PAD_L,
                    y1: toBarY(0),
                    x2: VIEW_W - PAD_R,
                    y2: toBarY(0),
                    style: { stroke: "var(--chart-3)" },
                    strokeWidth: "0.5",
                    strokeDasharray: "2 4",
                    strokeLinecap: "round"
                  },
                  void 0,
                  false,
                  {
                    fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                    lineNumber: 435,
                    columnNumber: 23
                  },
                  this
                ),
                barTicks.filter((_, i) => i > 0).map((tick, i) => /* @__PURE__ */ jsxDEV(
                  "text",
                  {
                    x: PAD_L - 6,
                    y: toBarY(tick) + 3.5,
                    textAnchor: "end",
                    fontSize: "9",
                    fill: "currentColor",
                    fillOpacity: "0.45",
                    children: fmtTick(tick)
                  },
                  i,
                  false,
                  {
                    fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                    lineNumber: 439,
                    columnNumber: 25
                  },
                  this
                )),
                lineTicks.filter((_, i) => i > 0).map((tick, i) => /* @__PURE__ */ jsxDEV(
                  "text",
                  {
                    x: VIEW_W - PAD_R + 6,
                    y: toLineY(tick) + 3.5,
                    textAnchor: "start",
                    fontSize: "9",
                    fill: "var(--chart-2)",
                    fillOpacity: "0.8",
                    children: fmtTick(tick)
                  },
                  i,
                  false,
                  {
                    fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                    lineNumber: 446,
                    columnNumber: 25
                  },
                  this
                )),
                billMonthHistory.map(([month, { total }], i) => {
                  const isCurrentMonth = month === thisMonth;
                  const bH = Math.max(total / barYMax * plotH, 1);
                  const x = toX(i) - barW / 2;
                  const y = PAD_T + plotH - bH;
                  const r2 = Math.min(5, barW / 2, bH);
                  const d = `M${x},${y + bH} L${x},${y + r2} Q${x},${y} ${x + r2},${y} L${x + barW - r2},${y} Q${x + barW},${y} ${x + barW},${y + r2} L${x + barW},${y + bH} Z`;
                  return /* @__PURE__ */ jsxDEV("g", { children: [
                    /* @__PURE__ */ jsxDEV(
                      "path",
                      {
                        d,
                        style: { fill: isCurrentMonth ? "var(--chart-1)" : "color-mix(in srgb, var(--chart-3) 45%, transparent)" }
                      },
                      void 0,
                      false,
                      {
                        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                        lineNumber: 461,
                        columnNumber: 29
                      },
                      this
                    ),
                    /* @__PURE__ */ jsxDEV(
                      "text",
                      {
                        x: toX(i),
                        y: y - 4,
                        textAnchor: "middle",
                        fontSize: "8",
                        fill: "currentColor",
                        fillOpacity: isCurrentMonth ? 0.8 : 0.45,
                        fontWeight: isCurrentMonth ? "600" : "400",
                        children: fmtTick(total)
                      },
                      void 0,
                      false,
                      {
                        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                        lineNumber: 463,
                        columnNumber: 29
                      },
                      this
                    )
                  ] }, month, true, {
                    fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                    lineNumber: 460,
                    columnNumber: 27
                  }, this);
                }),
                /* @__PURE__ */ jsxDEV(
                  "polyline",
                  {
                    points: linePoints,
                    fill: "none",
                    style: { stroke: "var(--chart-2)" },
                    strokeWidth: "1.5",
                    strokeLinejoin: "round",
                    strokeLinecap: "round"
                  },
                  void 0,
                  false,
                  {
                    fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                    lineNumber: 472,
                    columnNumber: 23
                  },
                  this
                ),
                cumulativeTotals.map((v, i) => /* @__PURE__ */ jsxDEV("circle", { cx: toX(i), cy: toLineY(v), r: "2.5", style: { fill: "var(--chart-2)" } }, i, false, {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                  lineNumber: 476,
                  columnNumber: 25
                }, this)),
                billMonthHistory.map(([month], i) => {
                  const isCurrentMonth = month === thisMonth;
                  const label = new Date(month).toLocaleDateString(void 0, { month: "short", year: "2-digit" });
                  return /* @__PURE__ */ jsxDEV(
                    "text",
                    {
                      x: toX(i),
                      y: VIEW_H - 4,
                      textAnchor: "middle",
                      fontSize: "9",
                      fill: "currentColor",
                      fillOpacity: isCurrentMonth ? 0.8 : 0.4,
                      fontWeight: isCurrentMonth ? "600" : "400",
                      children: label
                    },
                    month,
                    false,
                    {
                      fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                      lineNumber: 483,
                      columnNumber: 27
                    },
                    this
                  );
                })
              ] }, void 0, true, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                lineNumber: 428,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-5 pt-1", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "w-3 h-2.5 rounded-sm", style: { backgroundColor: "color-mix(in srgb, var(--chart-3) 50%, transparent)" } }, void 0, false, {
                    fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                    lineNumber: 494,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground", children: "Monthly" }, void 0, false, {
                    fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                    lineNumber: 495,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                  lineNumber: 493,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxDEV("svg", { width: "16", height: "10", viewBox: "0 0 16 10", children: [
                    /* @__PURE__ */ jsxDEV("line", { x1: "0", y1: "5", x2: "16", y2: "5", style: { stroke: "var(--chart-2)" }, strokeWidth: "1.5" }, void 0, false, {
                      fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                      lineNumber: 499,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("circle", { cx: "8", cy: "5", r: "2.5", style: { fill: "var(--chart-2)" } }, void 0, false, {
                      fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                      lineNumber: 500,
                      columnNumber: 27
                    }, this)
                  ] }, void 0, true, {
                    fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                    lineNumber: 498,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground", children: "Cumulative" }, void 0, false, {
                    fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                    lineNumber: 502,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                  lineNumber: 497,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                lineNumber: 492,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
              lineNumber: 426,
              columnNumber: 19
            }, this);
          })(),
          billCategoryTotals.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "bg-card border border-border rounded-xl p-4 flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxDEV("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "By category" }, void 0, false, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
              lineNumber: 511,
              columnNumber: 19
            }, this),
            billCategoryTotals.map((ct) => {
              const colors = BILL_CATEGORY_COLORS[ct.category];
              const barPct = Math.round(ct.total / maxBillTotal * 100);
              const uniqueBills = ct.bills;
              const categoryBills = uniqueBills.slice(0, 4);
              const overflow = uniqueBills.length - categoryBills.length;
              return /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "text-xs px-2 py-0.5 rounded-full font-medium shrink-0", style: { backgroundColor: colors.bg, color: colors.color }, children: ct.category }, void 0, false, {
                      fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                      lineNumber: 522,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1", children: [
                      categoryBills.map((b) => /* @__PURE__ */ jsxDEV(LogoAvatar, { name: b.name, website: b.website, colors, size: "sm" }, b.id, false, {
                        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                        lineNumber: 528,
                        columnNumber: 33
                      }, this)),
                      overflow > 0 && /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground/60 ml-1", children: [
                        "+",
                        overflow
                      ] }, void 0, true, {
                        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                        lineNumber: 531,
                        columnNumber: 33
                      }, this)
                    ] }, void 0, true, {
                      fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                      lineNumber: 526,
                      columnNumber: 29
                    }, this)
                  ] }, void 0, true, {
                    fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                    lineNumber: 521,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-semibold text-foreground tabular-nums", children: formatCurrency(ct.total, ct.currency) }, void 0, false, {
                    fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                    lineNumber: 535,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                  lineNumber: 520,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "h-1 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxDEV("div", { className: "h-full rounded-full", style: { width: `${barPct}%`, backgroundColor: colors.color, opacity: 0.7 } }, void 0, false, {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                  lineNumber: 538,
                  columnNumber: 27
                }, this) }, void 0, false, {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                  lineNumber: 537,
                  columnNumber: 25
                }, this)
              ] }, ct.category, true, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
                lineNumber: 519,
                columnNumber: 23
              }, this);
            })
          ] }, void 0, true, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
            lineNumber: 510,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
          lineNumber: 366,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
        lineNumber: 273,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
      lineNumber: 198,
      columnNumber: 7
    }, this),
    showAddForm && /* @__PURE__ */ jsxDEV(
      SubForm,
      {
        initial: blankSubForm(baseCurrency),
        editingId: null,
        onSave: handleAddSub,
        onDelete: () => {
        },
        onClose: () => setShowAddForm(false)
      },
      void 0,
      false,
      {
        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/SummaryPage.tsx",
        lineNumber: 551,
        columnNumber: 9
      },
      this
    )
  ] }, void 0);
}
const CURRENT_PATH = "/addons/subscription-stack/bills";
const BILL_CYCLES = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" }
];
const today = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
const BLANK_FORM = {
  name: "",
  amount: "",
  currency: "EUR",
  category: "Electricity",
  date: today(),
  website: "",
  notes: "",
  paid: false,
  recurring: false,
  billingCycle: "monthly"
};
function BillForm({ initial, editingId, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(initial);
  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      style: { backgroundColor: "rgba(0,0,0,0.55)" },
      onClick: (e) => {
        if (e.target === e.currentTarget) onClose();
      },
      children: /* @__PURE__ */ jsxDEV("div", { className: "bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-5 flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxDEV("h2", { className: "text-sm font-semibold text-foreground", children: editingId ? "Edit bill" : "Add bill" }, void 0, false, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
          lineNumber: 67,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "text-xs text-muted-foreground", children: "Name" }, void 0, false, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
            lineNumber: 73,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "text",
              placeholder: "e.g. Water Q1, January electricity…",
              value: form.name,
              onChange: (e) => set("name", e.target.value),
              className: "bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            },
            void 0,
            false,
            {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
              lineNumber: 74,
              columnNumber: 11
            },
            this
          )
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
          lineNumber: 72,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "text-xs text-muted-foreground", children: [
            "Website ",
            /* @__PURE__ */ jsxDEV("span", { className: "text-muted-foreground/50", children: "(optional — for logo)" }, void 0, false, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
              lineNumber: 85,
              columnNumber: 68
            }, this)
          ] }, void 0, true, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
            lineNumber: 85,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "text",
              placeholder: "e.g. edf.fr, voo.be…",
              value: form.website,
              onChange: (e) => set("website", e.target.value),
              className: "bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            },
            void 0,
            false,
            {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
              lineNumber: 86,
              columnNumber: 11
            },
            this
          )
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
          lineNumber: 84,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5 flex-1", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-xs text-muted-foreground", children: "Amount" }, void 0, false, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
              lineNumber: 98,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "number",
                min: "0",
                step: "0.01",
                placeholder: "0.00",
                value: form.amount,
                onChange: (e) => set("amount", e.target.value),
                className: "bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              },
              void 0,
              false,
              {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                lineNumber: 99,
                columnNumber: 13
              },
              this
            )
          ] }, void 0, true, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
            lineNumber: 97,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5 w-28", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-xs text-muted-foreground", children: "Currency" }, void 0, false, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
              lineNumber: 110,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(
              "select",
              {
                value: form.currency,
                onChange: (e) => set("currency", e.target.value),
                className: "bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring",
                children: CURRENCIES.map((c) => /* @__PURE__ */ jsxDEV("option", { value: c, children: c }, c, false, {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                  lineNumber: 116,
                  columnNumber: 38
                }, this))
              },
              void 0,
              false,
              {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                lineNumber: 111,
                columnNumber: 13
              },
              this
            )
          ] }, void 0, true, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
            lineNumber: 109,
            columnNumber: 11
          }, this)
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
          lineNumber: 96,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "text-xs text-muted-foreground", children: "Category" }, void 0, false, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
            lineNumber: 123,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV(
            "select",
            {
              value: form.category,
              onChange: (e) => set("category", e.target.value),
              className: "bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring",
              children: BILL_CATEGORIES.map((c) => /* @__PURE__ */ jsxDEV("option", { value: c, children: c }, c, false, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                lineNumber: 129,
                columnNumber: 41
              }, this))
            },
            void 0,
            false,
            {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
              lineNumber: 124,
              columnNumber: 11
            },
            this
          )
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
          lineNumber: 122,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "text-xs text-muted-foreground", children: "Date received" }, void 0, false, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
            lineNumber: 135,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "date",
              value: form.date,
              onChange: (e) => set("date", e.target.value),
              className: "bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            },
            void 0,
            false,
            {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
              lineNumber: 136,
              columnNumber: 11
            },
            this
          )
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
          lineNumber: 134,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-0.5", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-xs text-muted-foreground", children: "Recurring" }, void 0, false, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
              lineNumber: 147,
              columnNumber: 13
            }, this),
            form.recurring && /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground/60", children: "Next bill created automatically when paid" }, void 0, false, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
              lineNumber: 149,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
            lineNumber: 146,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => set("recurring", !form.recurring),
              className: `w-9 h-5 rounded-full transition-colors relative shrink-0 ${form.recurring ? "bg-primary" : "bg-muted"}`,
              children: /* @__PURE__ */ jsxDEV(
                "span",
                {
                  className: "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all",
                  style: { left: form.recurring ? "calc(100% - 18px)" : "2px" }
                },
                void 0,
                false,
                {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                  lineNumber: 158,
                  columnNumber: 13
                },
                this
              )
            },
            void 0,
            false,
            {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
              lineNumber: 154,
              columnNumber: 11
            },
            this
          )
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
          lineNumber: 145,
          columnNumber: 9
        }, this),
        form.recurring && /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "text-xs text-muted-foreground", children: "Billing cycle" }, void 0, false, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
            lineNumber: 168,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: BILL_CYCLES.map(({ value, label }) => /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => set("billingCycle", value),
              className: `flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${form.billingCycle === value ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"}`,
              children: label
            },
            value,
            false,
            {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
              lineNumber: 171,
              columnNumber: 17
            },
            this
          )) }, void 0, false, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
            lineNumber: 169,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
          lineNumber: 167,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "text-xs text-muted-foreground", children: "Mark as paid" }, void 0, false, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
            lineNumber: 189,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => set("paid", !form.paid),
              className: `w-9 h-5 rounded-full transition-colors relative ${form.paid ? "bg-primary" : "bg-muted"}`,
              children: /* @__PURE__ */ jsxDEV(
                "span",
                {
                  className: "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all",
                  style: { left: form.paid ? "calc(100% - 18px)" : "2px" }
                },
                void 0,
                false,
                {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                  lineNumber: 194,
                  columnNumber: 13
                },
                this
              )
            },
            void 0,
            false,
            {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
              lineNumber: 190,
              columnNumber: 11
            },
            this
          )
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
          lineNumber: 188,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "text-xs text-muted-foreground", children: [
            "Notes ",
            /* @__PURE__ */ jsxDEV("span", { className: "text-muted-foreground/50", children: "(optional)" }, void 0, false, {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
              lineNumber: 203,
              columnNumber: 66
            }, this)
          ] }, void 0, true, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
            lineNumber: 203,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "text",
              placeholder: "e.g. Higher than usual due to winter…",
              value: form.notes,
              onChange: (e) => set("notes", e.target.value),
              className: "bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            },
            void 0,
            false,
            {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
              lineNumber: 204,
              columnNumber: 11
            },
            this
          )
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
          lineNumber: 202,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 pt-1 border-t border-border mt-1", children: [
          editingId && /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => onDelete(editingId),
              className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors",
              children: [
                /* @__PURE__ */ jsxDEV(Trash2, { className: "h-3.5 w-3.5" }, void 0, false, {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                  lineNumber: 220,
                  columnNumber: 15
                }, this),
                "Delete"
              ]
            },
            void 0,
            true,
            {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
              lineNumber: 216,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("div", { className: "flex-1" }, void 0, false, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
            lineNumber: 224,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: onClose,
              className: "px-4 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
              children: "Cancel"
            },
            void 0,
            false,
            {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
              lineNumber: 225,
              columnNumber: 11
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => {
                if (form.name.trim() && form.amount) onSave(form);
              },
              disabled: !form.name.trim() || !form.amount,
              className: "px-4 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-40 transition-opacity bg-primary text-primary-foreground",
              children: editingId ? "Save" : "Add"
            },
            void 0,
            false,
            {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
              lineNumber: 231,
              columnNumber: 11
            },
            this
          )
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
          lineNumber: 214,
          columnNumber: 9
        }, this)
      ] }, void 0, true, {
        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
        lineNumber: 66,
        columnNumber: 7
      }, this)
    },
    void 0
  );
}
function monthLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString(void 0, { month: "long", year: "numeric" });
}
function BillsPage() {
  const baseCurrency = useBaseCurrency();
  const [bills, setBills] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formInitial, setFormInitial] = useState(() => ({ ...BLANK_FORM, currency: baseCurrency }));
  const [collapsedMonths, setCollapsedMonths] = useState(/* @__PURE__ */ new Set());
  const refresh = useCallback(() => setBills(getBills()), []);
  useEffect(() => {
    refresh();
  }, [refresh]);
  const openAdd = () => {
    setEditingId(null);
    setFormInitial({ ...BLANK_FORM, currency: baseCurrency, date: today() });
    setShowForm(true);
  };
  const openEdit = (bill) => {
    setEditingId(bill.id);
    setFormInitial({
      name: bill.name,
      amount: String(bill.amount),
      currency: bill.currency,
      category: bill.category,
      date: bill.date,
      website: bill.website ?? "",
      notes: bill.notes ?? "",
      paid: bill.paid,
      recurring: bill.recurring,
      billingCycle: bill.billingCycle ?? "monthly"
    });
    setShowForm(true);
  };
  const handleSave = (form) => {
    saveBill({
      id: editingId ?? generateId(),
      name: form.name.trim(),
      amount: parseFloat(form.amount) || 0,
      currency: form.currency,
      category: form.category,
      date: form.date,
      website: form.website.trim() || void 0,
      notes: form.notes.trim() || void 0,
      paid: form.paid,
      recurring: form.recurring,
      billingCycle: form.recurring ? form.billingCycle : void 0
    });
    refresh();
    setShowForm(false);
  };
  const handleDelete = (id) => {
    deleteBill(id);
    refresh();
    setShowForm(false);
  };
  const togglePaid = (bill) => {
    const markingPaid = !bill.paid;
    saveBill({ ...bill, paid: markingPaid });
    if (markingPaid && bill.recurring && bill.billingCycle) {
      saveBill({
        id: generateId(),
        name: bill.name,
        amount: bill.amount,
        currency: bill.currency,
        category: bill.category,
        date: advanceDateByCycle(bill.date, bill.billingCycle),
        website: bill.website,
        notes: bill.notes,
        paid: false,
        recurring: true,
        billingCycle: bill.billingCycle
      });
    }
    refresh();
  };
  const toggleMonth = (month) => {
    setCollapsedMonths((prev) => {
      const next = new Set(prev);
      next.has(month) ? next.delete(month) : next.add(month);
      return next;
    });
  };
  const sorted = [...bills].sort((a, b) => b.date.localeCompare(a.date));
  const grouped = sorted.reduce((acc, bill) => {
    const month = monthLabel(bill.date);
    const group = acc.find((g) => g.month === month);
    if (group) group.items.push(bill);
    else acc.push({ month, items: [bill] });
    return acc;
  }, []);
  const currentMonth = monthLabel(today());
  const currentMonthBills = grouped.find((g) => g.month === currentMonth)?.items ?? [];
  const currentTotal = currentMonthBills.reduce((sum, b) => sum + b.amount, 0);
  const currentCurrency = currentMonthBills[0]?.currency ?? "EUR";
  const unpaidCount = currentMonthBills.filter((b) => !b.paid).length;
  return /* @__PURE__ */ jsxDEV(PageLayout, { activePath: CURRENT_PATH, children: [
    /* @__PURE__ */ jsxDEV("div", { className: "px-4 py-4 flex flex-col gap-3 max-w-2xl", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxDEV("h1", { className: "text-base font-semibold text-foreground", children: "Bills" }, void 0, false, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
          lineNumber: 363,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: openAdd,
            className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground",
            children: [
              /* @__PURE__ */ jsxDEV(Plus, { className: "h-3.5 w-3.5" }, void 0, false, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                lineNumber: 368,
                columnNumber: 13
              }, this),
              "Add"
            ]
          },
          void 0,
          true,
          {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
            lineNumber: 364,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
        lineNumber: 362,
        columnNumber: 9
      }, this),
      currentMonthBills.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "bg-card border border-border rounded-xl p-6", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-6", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-0.5", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground", children: "This month" }, void 0, false, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
            lineNumber: 378,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-4xl font-bold text-foreground tabular-nums", children: formatCurrency(currentTotal, currentCurrency) }, void 0, false, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
            lineNumber: 379,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
          lineNumber: 377,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "w-px bg-border self-stretch" }, void 0, false, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
          lineNumber: 383,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-0.5", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground", children: "Unpaid" }, void 0, false, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
            lineNumber: 385,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-xl font-semibold text-foreground tabular-nums", children: [
            unpaidCount,
            " bill",
            unpaidCount !== 1 ? "s" : ""
          ] }, void 0, true, {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
            lineNumber: 386,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
          lineNumber: 384,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
        lineNumber: 376,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
        lineNumber: 375,
        columnNumber: 11
      }, this),
      bills.length === 0 && /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center justify-center py-16 gap-3 text-center", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "w-12 h-12 rounded-lg bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxDEV(Zap, { className: "h-6 w-6 text-muted-foreground" }, void 0, false, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
          lineNumber: 398,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
          lineNumber: 397,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-muted-foreground", children: "No bills yet." }, void 0, false, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
          lineNumber: 400,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: openAdd,
            className: "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold mt-1 bg-primary text-primary-foreground",
            children: [
              /* @__PURE__ */ jsxDEV(Plus, { className: "h-3.5 w-3.5" }, void 0, false, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                lineNumber: 405,
                columnNumber: 15
              }, this),
              "Add your first bill"
            ]
          },
          void 0,
          true,
          {
            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
            lineNumber: 401,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
        lineNumber: 396,
        columnNumber: 11
      }, this),
      grouped.map(({ month, items }) => {
        const isOpen = !collapsedMonths.has(month);
        const monthTotal = items.reduce((sum, b) => sum + b.amount, 0);
        const cur = items[0]?.currency ?? "EUR";
        return /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => toggleMonth(month),
              className: "flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors py-1 select-none w-full",
              children: [
                /* @__PURE__ */ jsxDEV(
                  ChevronDown,
                  {
                    className: "h-3.5 w-3.5 transition-transform duration-200",
                    style: { transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)" }
                  },
                  void 0,
                  false,
                  {
                    fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                    lineNumber: 424,
                    columnNumber: 17
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV("span", { children: month }, void 0, false, {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                  lineNumber: 428,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "flex-1" }, void 0, false, {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                  lineNumber: 429,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "tabular-nums", children: formatCurrency(monthTotal, cur) }, void 0, false, {
                  fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                  lineNumber: 430,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
              lineNumber: 420,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "div",
            {
              className: "grid transition-all duration-200",
              style: { gridTemplateRows: isOpen ? "1fr" : "0fr" },
              children: /* @__PURE__ */ jsxDEV("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5", children: items.map((bill) => {
                const colors = BILL_CATEGORY_COLORS[bill.category];
                return /* @__PURE__ */ jsxDEV(
                  "div",
                  {
                    className: `bg-card border border-border rounded-xl px-3 py-2.5 flex items-center gap-3 transition-opacity ${bill.paid ? "opacity-50" : ""}`,
                    children: [
                      /* @__PURE__ */ jsxDEV(LogoAvatar, { name: bill.name, website: bill.website, colors }, void 0, false, {
                        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                        lineNumber: 448,
                        columnNumber: 27
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-0.5 flex-1 min-w-0", children: [
                        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
                          /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-medium text-foreground truncate", children: bill.name }, void 0, false, {
                            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                            lineNumber: 453,
                            columnNumber: 31
                          }, this),
                          /* @__PURE__ */ jsxDEV(
                            "span",
                            {
                              className: "text-xs px-2 py-0.5 rounded-full font-medium shrink-0",
                              style: { backgroundColor: colors.bg, color: colors.color },
                              children: bill.category
                            },
                            void 0,
                            false,
                            {
                              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                              lineNumber: 454,
                              columnNumber: 31
                            },
                            this
                          ),
                          bill.recurring && /* @__PURE__ */ jsxDEV("span", { className: "flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full font-medium shrink-0 bg-muted text-muted-foreground", children: [
                            /* @__PURE__ */ jsxDEV(RefreshCw, { className: "h-2.5 w-2.5" }, void 0, false, {
                              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                              lineNumber: 462,
                              columnNumber: 35
                            }, this),
                            bill.billingCycle
                          ] }, void 0, true, {
                            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                            lineNumber: 461,
                            columnNumber: 33
                          }, this)
                        ] }, void 0, true, {
                          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                          lineNumber: 452,
                          columnNumber: 29
                        }, this),
                        /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-muted-foreground", children: new Date(bill.date).toLocaleDateString(void 0, { day: "numeric", month: "short" }) }, void 0, false, {
                          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                          lineNumber: 467,
                          columnNumber: 29
                        }, this)
                      ] }, void 0, true, {
                        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                        lineNumber: 451,
                        columnNumber: 27
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-semibold text-foreground tabular-nums shrink-0", children: formatCurrency(bill.amount, bill.currency) }, void 0, false, {
                        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                        lineNumber: 473,
                        columnNumber: 27
                      }, this),
                      /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          onClick: () => togglePaid(bill),
                          title: bill.paid ? "Mark unpaid" : "Mark paid",
                          className: `w-7 h-3.5 rounded-full transition-colors shrink-0 relative ${bill.paid ? "bg-primary" : "bg-muted"}`,
                          children: /* @__PURE__ */ jsxDEV(
                            "span",
                            {
                              className: "absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full shadow transition-all",
                              style: { left: bill.paid ? "calc(100% - 12px)" : "2px" }
                            },
                            void 0,
                            false,
                            {
                              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                              lineNumber: 483,
                              columnNumber: 29
                            },
                            this
                          )
                        },
                        void 0,
                        false,
                        {
                          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                          lineNumber: 478,
                          columnNumber: 27
                        },
                        this
                      ),
                      /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          onClick: () => openEdit(bill),
                          className: "text-muted-foreground hover:text-foreground transition-colors shrink-0 p-1 rounded-lg hover:bg-muted",
                          children: /* @__PURE__ */ jsxDEV(Pencil, { className: "h-3.5 w-3.5" }, void 0, false, {
                            fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                            lineNumber: 494,
                            columnNumber: 29
                          }, this)
                        },
                        void 0,
                        false,
                        {
                          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                          lineNumber: 490,
                          columnNumber: 27
                        },
                        this
                      )
                    ]
                  },
                  bill.id,
                  true,
                  {
                    fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                    lineNumber: 443,
                    columnNumber: 25
                  },
                  this
                );
              }) }, void 0, false, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                lineNumber: 439,
                columnNumber: 19
              }, this) }, void 0, false, {
                fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
                lineNumber: 438,
                columnNumber: 17
              }, this)
            },
            void 0,
            false,
            {
              fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
              lineNumber: 434,
              columnNumber: 15
            },
            this
          )
        ] }, month, true, {
          fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
          lineNumber: 418,
          columnNumber: 13
        }, this);
      })
    ] }, void 0, true, {
      fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
      lineNumber: 359,
      columnNumber: 7
    }, this),
    showForm && /* @__PURE__ */ jsxDEV(
      BillForm,
      {
        initial: formInitial,
        editingId,
        onSave: handleSave,
        onDelete: handleDelete,
        onClose: () => setShowForm(false)
      },
      void 0,
      false,
      {
        fileName: "E:/Projects/Apps/Subscription_Stack/src/pages/BillsPage.tsx",
        lineNumber: 508,
        columnNumber: 9
      },
      this
    )
  ] }, void 0);
}
function enable(ctx) {
  setContext(ctx);
  const sidebarItem = ctx.sidebar.addItem({
    id: "subscription-stack",
    label: "Subscriptions & Bills",
    icon: /* @__PURE__ */ jsxDEV(Layers, { className: "h-5 w-5" }, void 0),
    route: "/addons/subscription-stack/summary",
    order: 400
  });
  ctx.router.add({
    path: "/addons/subscription-stack",
    component: ReactProxy.lazy(() => Promise.resolve({ default: SubscriptionsPage }))
  });
  ctx.router.add({
    path: "/addons/subscription-stack/summary",
    component: ReactProxy.lazy(() => Promise.resolve({ default: SummaryPage }))
  });
  ctx.router.add({
    path: "/addons/subscription-stack/bills",
    component: ReactProxy.lazy(() => Promise.resolve({ default: BillsPage }))
  });
  ctx.onDisable(() => {
    try {
      sidebarItem.remove();
    } catch {
    }
  });
}
export {
  enable as default
};
//# sourceMappingURL=addon.js.map
