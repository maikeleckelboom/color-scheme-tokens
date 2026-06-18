import { describe, expect, it } from "vitest";
import {
  applyProfile,
  appSurfaceProfile,
  compileGraph,
  darkMode,
  hex,
  lightMode,
  solidColorIntent,
  tokenKey,
  validateGraph,
  type ColorSchemeTokenGraph,
  type ColorSchemeProfile,
  type TokenNode,
} from "../../src/index";

describe("applyProfile", () => {
  it("adds the exact app surface aliases without mutating the original graph", () => {
    const graph = baseGraph();
    const profiled = applyProfile(graph, appSurfaceProfile);

    expect(graph.tokens).toHaveLength(7);
    expect(profiled.tokens).toHaveLength(14);
    expect(appSurfaceProfile.tokens.map((token) => String(token.key))).toEqual([
      "chrome.background",
      "chrome.foreground",
      "chrome.border",
      "semantic.action.background",
      "semantic.action.foreground",
      "semantic.danger.background",
      "semantic.danger.foreground",
    ]);
    expect(validateGraph(profiled).ok).toBe(true);
  });

  it("is chainable and leaves duplicate token keys for graph validation to reject", () => {
    const graph = baseGraph();
    const firstProfile: ColorSchemeProfile = {
      name: "first",
      tokens: [
        { kind: "alias", key: tokenKey("chrome.background"), target: tokenKey("scheme.surface") },
      ],
    };
    const secondProfile: ColorSchemeProfile = {
      name: "second",
      tokens: [
        { kind: "alias", key: tokenKey("chrome.background"), target: tokenKey("scheme.primary") },
      ],
    };

    const problems = expectProblems(
      validateGraph(applyProfile(applyProfile(graph, firstProfile), secondProfile)),
    );

    expect(problems.some((problem) => problem.kind === "duplicate-token-key")).toBe(true);
  });

  it("rejects unknown alias targets during graph validation", () => {
    const graph = applyProfile(baseGraph(), {
      name: "unknown-target",
      tokens: [
        {
          kind: "alias",
          key: tokenKey("chrome.background"),
          target: tokenKey("scheme.missing"),
        },
      ],
    });

    const problems = expectProblems(validateGraph(graph));

    expect(problems.some((problem) => problem.kind === "unknown-alias-target")).toBe(true);
  });

  it("supports mode-specific alias targets", () => {
    const graph = applyProfile(baseGraph(), {
      name: "mode-alias",
      tokens: [
        {
          kind: "alias",
          key: tokenKey("chrome.background"),
          target: [
            { mode: lightMode, value: tokenKey("scheme.surface") },
            { mode: darkMode, value: tokenKey("scheme.primary") },
          ],
        },
      ],
    });
    const compiled = compileGraph(graph, { include: [tokenKey("chrome.background")] });

    expect(compiled.ok).toBe(true);
    if (!compiled.ok) return;
    expect(compiled.value.tokens).toHaveLength(1);
    expect(compiled.value.tokens[0]?.values.map((entry) => entry.value)).toEqual([
      hex("#ffffff"),
      hex("#d0bcff"),
    ]);
  });

  it("supports authored color tokens with ColorIntent payloads", () => {
    const graph = applyProfile(baseGraph(), {
      name: "authored-color",
      tokens: [
        {
          kind: "color",
          key: tokenKey("semantic.notice.background"),
          values: [
            { mode: lightMode, value: solidColorIntent(hex("#fff8e1")) },
            { mode: darkMode, value: solidColorIntent(hex("#332600")) },
          ],
        },
      ],
    });
    const compiled = compileGraph(graph, { include: [tokenKey("semantic.notice.background")] });

    expect(compiled.ok).toBe(true);
    if (!compiled.ok) return;
    expect(compiled.value.tokens[0]?.values[0]?.value).toEqual(hex("#fff8e1"));
  });
});

function baseGraph() {
  return testGraph({
    tokens: [
      colorToken("scheme.surface", "#ffffff", "#141218"),
      colorToken("scheme.onSurface", "#1d1b20", "#e6e0e9"),
      colorToken("scheme.outlineVariant", "#cac4d0", "#49454f"),
      colorToken("scheme.primary", "#6750a4", "#d0bcff"),
      colorToken("scheme.onPrimary", "#ffffff", "#381e72"),
      colorToken("scheme.error", "#ba1a1a", "#ffb4ab"),
      colorToken("scheme.onError", "#ffffff", "#690005"),
    ],
  });
}

function testGraph(options: { readonly tokens?: readonly TokenNode[] }): ColorSchemeTokenGraph {
  return {
    schemaVersion: "color-scheme-token-graph/v0",
    modes: [lightMode, darkMode],
    tokens: [...(options.tokens ?? [])],
  };
}

function expectProblems<Value, Problem>(
  result:
    | { readonly ok: true; readonly value?: Value; readonly graph?: Value }
    | { readonly ok: false; readonly problems: readonly Problem[] },
): readonly Problem[] {
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error("Expected result to fail.");
  return result.problems;
}

function colorToken(key: string, light: string, dark: string) {
  return {
    kind: "color" as const,
    key: tokenKey(key),
    values: [
      { mode: lightMode, value: solidColorIntent(hex(light)) },
      { mode: darkMode, value: solidColorIntent(hex(dark)) },
    ],
  };
}
