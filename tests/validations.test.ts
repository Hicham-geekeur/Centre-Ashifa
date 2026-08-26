import { describe, it, expect } from "vitest";
import { supportFormSchema, calculateTotal } from "@/lib/validations";

const base = { firstName: "Ali", lastName: "Ben", email: "ali@example.com" };

describe("calculateTotal", () => {
  it("livre x quantité + port", () => {
    expect(calculateTotal(2)).toBe(29);
  });
});

describe("supportFormSchema", () => {
  it("accepte un don ponctuel libre", () => {
    const r = supportFormSchema.safeParse({ ...base, kind: "donation", interval: "once", amount: 37 });
    expect(r.success).toBe(true);
  });
  it("accepte un don mensuel", () => {
    const r = supportFormSchema.safeParse({ ...base, kind: "donation", interval: "month", amount: 10 });
    expect(r.success).toBe(true);
  });
  it("refuse un don < 1 € ou > 10 000 €", () => {
    expect(supportFormSchema.safeParse({ ...base, kind: "donation", interval: "once", amount: 0 }).success).toBe(false);
    expect(supportFormSchema.safeParse({ ...base, kind: "donation", interval: "once", amount: 10001 }).success).toBe(false);
  });
  it("refuse un don non entier", () => {
    expect(supportFormSchema.safeParse({ ...base, kind: "donation", interval: "once", amount: 10.5 }).success).toBe(false);
  });
  it("accepte une adhésion à un palier mensuel", () => {
    expect(supportFormSchema.safeParse({ ...base, kind: "membership", interval: "month", amount: 10 }).success).toBe(true);
  });
  it("refuse une adhésion hors palier ou ponctuelle", () => {
    expect(supportFormSchema.safeParse({ ...base, kind: "membership", interval: "month", amount: 7 }).success).toBe(false);
    expect(supportFormSchema.safeParse({ ...base, kind: "membership", interval: "once", amount: 10 }).success).toBe(false);
  });
  it("refuse un email invalide", () => {
    expect(supportFormSchema.safeParse({ ...base, email: "nope", kind: "donation", interval: "once", amount: 10 }).success).toBe(false);
  });
});
