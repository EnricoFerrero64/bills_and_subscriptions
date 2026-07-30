import { describe, expect, it } from "vitest";
import { extractDomain, formatCurrency } from "../../src/lib/storage";

describe("formatCurrency", () => {
  it("formats a valid ISO currency code", () => {
    const usd = formatCurrency(15.99, "USD");
    expect(usd).toContain("15.99");
    expect(usd).not.toBe("15.99 USD"); // i.e. it used Intl, not the fallback
  });

  it("always shows two decimals", () => {
    expect(formatCurrency(8, "USD")).toContain("8.00");
    expect(formatCurrency(8.005, "USD")).toContain("8.01");
  });

  it("never throws on a currency Intl rejects", () => {
    // Reachable without any bug in this addon: link rows carry whatever
    // currency the host stored on the activity, and importData() only validates
    // the shape of a backup, not its contents. Intl throws RangeError for
    // anything that is not a 3-letter code, and this runs inside render bodies.
    for (const bad of ["", "US$", "US", "usdollar", "12"]) {
      expect(() => formatCurrency(12.3, bad)).not.toThrow();
      expect(formatCurrency(12.3, bad)).toContain("12.30");
    }
    expect(formatCurrency(12.3, undefined as unknown as string)).toBe("12.30");
    expect(formatCurrency(12.3, "US$")).toBe("12.30 US$");
  });

  it("does not pretend a non-finite amount is zero", () => {
    expect(formatCurrency(Number.NaN, "US$")).toContain("NaN");
  });
});

describe("extractDomain", () => {
  it("strips scheme, path and www", () => {
    expect(extractDomain("https://www.netflix.com/browse")).toBe("netflix.com");
    expect(extractDomain("netflix.com")).toBe("netflix.com");
    expect(extractDomain("www.netflix.com")).toBe("netflix.com");
    expect(extractDomain("http://sub.netflix.com:8080/x?y=1")).toBe("sub.netflix.com");
  });

  it("returns something usable for junk instead of throwing", () => {
    expect(() => extractDomain("not a url at all")).not.toThrow();
    expect(extractDomain("")).toBe("");
  });
});
