import { describe, expect, it } from "vitest";
import {
  appSurfaceProfile,
  createSchemeTokens,
  dynamicSchemeSource,
  hex,
  tokenKey,
} from "../../src/index";

describe("createSchemeTokens", () => {
  it("orchestrates dynamic source, profile, compiler, CSS export, and snapshot serialization", () => {
    const result = createSchemeTokens({
      source: dynamicSchemeSource({ sourceColor: hex("#6750A4") }),
      profile: appSurfaceProfile,
      compile: {
        include: [tokenKey("chrome.background"), tokenKey("semantic.action.background")],
      },
      css: { prefix: "theme" },
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(
      result.value.graph.tokens.some((token) => token.key === tokenKey("chrome.background")),
    ).toBe(true);
    expect(result.value.tokenSet.tokens.map((token) => String(token.key))).toEqual([
      "chrome.background",
      "semantic.action.background",
    ]);
    expect(result.value.cssVariables).toContain("--theme-chrome-background:");
    expect(JSON.parse(result.value.snapshot)).toEqual(
      expect.objectContaining({
        schemaVersion: "compiled-color-scheme-tokens/v0",
      }),
    );
  });

  it("returns structured problems from source failures", () => {
    const result = createSchemeTokens({
      source: dynamicSchemeSource({
        sourceColor: { ...hex("#6750A4"), alpha: 0.2 },
      }),
      profile: appSurfaceProfile,
    });

    expect(expectProblems(result).some((problem) => problem.kind === "unsupported-alpha")).toBe(
      true,
    );
  });
});

function expectProblems<Value, Problem>(
  result:
    | { readonly ok: true; readonly value: Value }
    | { readonly ok: false; readonly problems: readonly Problem[] },
): readonly Problem[] {
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error("Expected result to fail.");
  return result.problems;
}
