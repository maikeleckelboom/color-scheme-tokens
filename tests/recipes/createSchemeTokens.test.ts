import { describe, expect, it } from "vitest";
import {
  createSchemeTokens,
  darkMode,
  hex,
  lightMode,
  literalColor,
  tokenKey,
  type ColorSchemeTokenGraphTransform,
  type ColorSchemeTokenLayer,
} from "../../src/index";
import { material3Source } from "../../src/sources/material3";

describe("createSchemeTokens", () => {
  it("works with no aliases, no layers, and no transform", () => {
    const result = createSchemeTokens({
      source: material3Source({ sourceColor: hex("#6750A4") }),
      compile: {
        include: [tokenKey("m3.primary")],
      },
      css: { prefix: "theme" },
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.tokenSet.tokens.map((token) => String(token.key))).toEqual(["m3.primary"]);
    expect(result.value.cssVariables).toContain("--theme-m3-primary:");
  });

  it("expands aliases from source tokens into compiled and exported app tokens", () => {
    const result = createSchemeTokens({
      source: material3Source({ sourceColor: hex("#6750A4") }),
      aliases: {
        "app.action": "m3.primary",
        "app.canvas": "m3.surface",
      },
      compile: {
        include: [tokenKey("app.action"), tokenKey("app.canvas")],
      },
      css: { prefix: "theme" },
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.graph.tokens.slice(-2)).toEqual([
      {
        kind: "alias",
        key: tokenKey("app.action"),
        target: tokenKey("m3.primary"),
      },
      {
        kind: "alias",
        key: tokenKey("app.canvas"),
        target: tokenKey("m3.surface"),
      },
    ]);
    expect(result.value.tokenSet.tokens.map((token) => String(token.key))).toEqual([
      "app.action",
      "app.canvas",
    ]);
    expect(result.value.cssVariables).toContain("--theme-app-action:");
    expect(result.value.cssVariables).toContain("--theme-app-canvas:");
  });

  it("orchestrates source, layers, compiler, CSS export, and snapshot serialization", () => {
    const result = createSchemeTokens({
      source: material3Source({ sourceColor: hex("#6750A4") }),
      layers: [applicationLayer],
      compile: {
        include: [tokenKey("app.canvas"), tokenKey("app.action")],
      },
      css: { prefix: "theme" },
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.graph.tokens.some((token) => token.key === tokenKey("app.canvas"))).toBe(
      true,
    );
    expect(result.value.tokenSet.tokens.map((token) => String(token.key))).toEqual([
      "app.canvas",
      "app.action",
    ]);
    expect(result.value.cssVariables).toContain("--theme-app-canvas:");
    expect(JSON.parse(result.value.snapshot)).toEqual(
      expect.objectContaining({
        schemaVersion: "compiled-color-scheme-tokens/v0",
      }),
    );
  });

  it("applies aliases after layers and before transform", () => {
    const result = createSchemeTokens({
      source: material3Source({ sourceColor: hex("#6750A4") }),
      layers: [applicationLayer],
      aliases: {
        "app.chromeBackground": "app.canvas",
      },
      transform: (graph) => {
        expect(graph.tokens.some((token) => token.key === tokenKey("app.canvas"))).toBe(true);
        expect(graph.tokens.some((token) => token.key === tokenKey("app.chromeBackground"))).toBe(
          true,
        );

        return {
          ...graph,
          tokens: [
            ...graph.tokens,
            {
              kind: "alias",
              key: tokenKey("app.primaryAction"),
              target: tokenKey("app.chromeBackground"),
            },
          ],
        };
      },
      compile: {
        include: [tokenKey("app.primaryAction")],
      },
      css: { prefix: "theme" },
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.tokenSet.tokens.map((token) => String(token.key))).toEqual([
      "app.primaryAction",
    ]);
    expect(result.value.cssVariables).toContain("--theme-app-primary-action:");
  });

  it("applies singular transform after aliases and before compile", () => {
    const transform: ColorSchemeTokenGraphTransform = (graph) => {
      expect(graph.tokens.at(-1)).toEqual({
        kind: "alias",
        key: tokenKey("app.first"),
        target: tokenKey("m3.primary"),
      });

      return {
        ...graph,
        tokens: [
          ...graph.tokens,
          { kind: "alias", key: tokenKey("app.second"), target: tokenKey("app.first") },
        ],
      };
    };
    const result = createSchemeTokens({
      source: material3Source({ sourceColor: hex("#6750A4") }),
      aliases: {
        "app.first": "m3.primary",
      },
      transform,
      compile: {
        include: [tokenKey("app.first"), tokenKey("app.second")],
      },
    });
    const secondResult = createSchemeTokens({
      source: material3Source({ sourceColor: hex("#6750A4") }),
      aliases: {
        "app.first": "m3.primary",
      },
      transform,
      compile: {
        include: [tokenKey("app.first"), tokenKey("app.second")],
      },
    });

    expect(result.ok).toBe(true);
    expect(secondResult.ok).toBe(true);
    if (!secondResult.ok) return;
    if (!result.ok) return;
    expect(result.value.graph.tokens.slice(-2).map((token) => String(token.key))).toEqual([
      "app.first",
      "app.second",
    ]);
    expect(result.value.snapshot).toBe(secondResult.value.snapshot);
  });

  it("compiles and exports transform-added token nodes", () => {
    const result = createSchemeTokens({
      source: material3Source({ sourceColor: hex("#6750A4") }),
      transform: (graph) => ({
        ...graph,
        tokens: [
          ...graph.tokens,
          {
            kind: "color",
            key: tokenKey("app.staticAccent"),
            values: [
              { mode: lightMode, value: literalColor(hex("#112233")) },
              { mode: darkMode, value: literalColor(hex("#ddeeff")) },
            ],
          },
        ],
      }),
      compile: {
        include: [tokenKey("app.staticAccent")],
      },
      css: { prefix: "theme" },
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.tokenSet.tokens[0]?.key).toBe(tokenKey("app.staticAccent"));
    expect(result.value.cssVariables).toContain("--theme-app-static-accent: #112233;");
    expect(result.value.snapshot).toContain('"key": "app.staticAccent"');
  });

  it("validates transform output through the compile path", () => {
    const result = createSchemeTokens({
      source: material3Source({ sourceColor: hex("#6750A4") }),
      transform: (graph) => ({
        ...graph,
        tokens: [
          ...graph.tokens,
          {
            kind: "alias",
            key: tokenKey("app.missing"),
            target: tokenKey("m3.missing"),
          },
        ],
      }),
    });

    const problems = expectProblems(result);

    expect(problems.some((problem) => problem.kind === "invalid-graph")).toBe(true);
  });

  it("returns structured problems from source failures", () => {
    const result = createSchemeTokens({
      source: material3Source({
        sourceColor: { ...hex("#6750A4"), alpha: 0.2 },
      }),
    });

    expect(expectProblems(result).some((problem) => problem.kind === "unsupported-alpha")).toBe(
      true,
    );
  });
});

const applicationLayer: ColorSchemeTokenLayer = {
  name: "application",
  tokens: [
    { kind: "alias", key: tokenKey("app.canvas"), target: tokenKey("m3.surface") },
    { kind: "alias", key: tokenKey("app.text"), target: tokenKey("m3.onSurface") },
    { kind: "alias", key: tokenKey("app.action"), target: tokenKey("m3.primary") },
    { kind: "alias", key: tokenKey("app.actionText"), target: tokenKey("m3.onPrimary") },
  ],
};

function expectProblems<Value, Problem>(
  result:
    | { readonly ok: true; readonly value: Value }
    | { readonly ok: false; readonly problems: readonly Problem[] },
): readonly Problem[] {
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error("Expected result to fail.");
  return result.problems;
}
