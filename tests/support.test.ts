import { describe, it, expect, beforeEach, vi } from "vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

async function loadFresh() {
  vi.resetModules();
  const dir = mkdtempSync(join(tmpdir(), "ashifa-"));
  vi.spyOn(process, "cwd").mockReturnValue(dir);
  return await import("@/lib/support");
}

describe("support storage", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("sauvegarde puis relit une entrée", async () => {
    const s = await loadFresh();
    s.saveSupportEntry({
      id: "SUP-1", kind: "donation", interval: "once", amount: 20,
      firstName: "Ali", lastName: "Ben", email: "ali@example.com",
      status: "pending", createdAt: "2026-08-26T00:00:00.000Z",
    });
    expect(s.getSupportEntry("SUP-1")?.amount).toBe(20);
    expect(s.getSupportEntry("nope")).toBeNull();
  });

  it("marque payé avec les identifiants Stripe", async () => {
    const s = await loadFresh();
    s.saveSupportEntry({
      id: "SUP-2", kind: "membership", interval: "month", amount: 10,
      firstName: "Ali", lastName: "Ben", email: "ali@example.com",
      status: "pending", createdAt: "2026-08-26T00:00:00.000Z",
    });
    s.markSupportPaid("SUP-2", { stripeCustomerId: "cus_1", stripeSubscriptionId: "sub_1" });
    const e = s.getSupportEntry("SUP-2")!;
    expect(e.status).toBe("paid");
    expect(e.stripeCustomerId).toBe("cus_1");
    expect(e.stripeSubscriptionId).toBe("sub_1");
  });

  it("retrouve le dernier customer payé par email (insensible à la casse)", async () => {
    const s = await loadFresh();
    const base = { kind: "donation" as const, interval: "month" as const, amount: 10, firstName: "A", lastName: "B", status: "paid" as const };
    s.saveSupportEntry({ ...base, id: "SUP-a", email: "ali@example.com", createdAt: "2026-01-01T00:00:00.000Z", stripeCustomerId: "cus_old" });
    s.saveSupportEntry({ ...base, id: "SUP-b", email: "ALI@example.com", createdAt: "2026-02-01T00:00:00.000Z", stripeCustomerId: "cus_new" });
    s.saveSupportEntry({ ...base, id: "SUP-c", email: "ali@example.com", createdAt: "2026-03-01T00:00:00.000Z", status: "pending" });
    expect(s.findLatestCustomerIdByEmail("Ali@Example.com")).toBe("cus_new");
    expect(s.findLatestCustomerIdByEmail("x@y.z")).toBeNull();
  });

  it("génère un id préfixé SUP-", async () => {
    const s = await loadFresh();
    expect(s.generateSupportId()).toMatch(/^SUP-[a-z0-9]+-[a-z0-9]{6}$/);
  });
});
