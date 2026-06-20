import { beforeEach, expect, test, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
});

test("reports sanitized engine failure causes without throwing", async () => {
  vi.doMock("../src/material3-engine", () => ({
    MATERIAL3_ENGINE_PACKAGE: "material-foundation/material-color-utilities",
    MATERIAL3_ENGINE_VERSION: "main@6fd88eb3e95ba1d457842e2a2bf847d06b3a018a",
    createMaterial3Graph() {
      throw new Error("forced engine failure");
    },
  }));

  const { material3 } = await import("../src/material3");
  const result = material3("#6750a4").build();

  expect(result.ok).toBe(false);
  if (result.ok) {
    return;
  }
  expect(result.issues).toEqual([
    expect.objectContaining({
      code: "material3-engine-failed",
      causeMessage: "forced engine failure",
      enginePackage: "material-foundation/material-color-utilities",
      engineVersion: "main@6fd88eb3e95ba1d457842e2a2bf847d06b3a018a",
    }),
  ]);
  expect(JSON.stringify(result.issues)).not.toContain("at ");
});
