import { describe, expect, it } from "vitest";
import {
  compileGraph,
  createSchemeGraph,
  dynamicSchemeSource,
  hex,
  tokenKey,
} from "../../src/index";

describe("dynamicSchemeSource", () => {
  it("generates the reconciled required dynamic role inventory", () => {
    const source = dynamicSchemeSource({ sourceColor: hex("#6750A4") });
    const requiredRoles = source.roleSet.roles.filter((role) => role.required);
    const optionalRoles = source.roleSet.roles.filter((role) => !role.required);
    const graph = expectOk(createSchemeGraph({ source }));

    expect(requiredRoles).toHaveLength(55);
    expect(optionalRoles).toHaveLength(4);
    expect(Object.prototype.hasOwnProperty.call(source, "defaults")).toBe(false);
    expect(graph.tokens).toHaveLength(59);
    expect(graph.tokens.every((token) => String(token.key).startsWith("scheme."))).toBe(true);
    expect(graph.tokens.some((token) => String(token.key).startsWith("material."))).toBe(false);

    const compiled = expectOk(compileGraph(graph));
    expect(compiled.tokens.find((token) => token.key === tokenKey("scheme.primary"))).toEqual(
      definedToken(),
    );
  });

  it("includes optional dim roles symmetrically when the upstream source provides them", () => {
    const graph = expectOk(
      createSchemeGraph({
        source: dynamicSchemeSource({
          sourceColor: hex("#6750A4"),
        }),
      }),
    );

    for (const key of [
      "scheme.primaryDim",
      "scheme.secondaryDim",
      "scheme.tertiaryDim",
      "scheme.errorDim",
    ]) {
      const token = expectColorToken(
        graph.tokens.find((candidate) => candidate.key === tokenKey(key)),
      );
      expect(token.values.map((entry) => String(entry.mode))).toEqual(["light", "dark"]);
    }
  });

  it("rejects non-opaque and non-srgb source colors with structured source problems", () => {
    const alphaResult = dynamicSchemeSource({
      sourceColor: { ...hex("#6750A4"), alpha: 0.5 },
    }).createGraph();
    const wideColorResult = dynamicSchemeSource({
      sourceColor: {
        colorSpace: "display-p3",
        r: 0.4,
        g: 0.31,
        b: 0.64,
        alpha: 1,
      } as never,
    }).createGraph();

    expect(
      expectProblems(alphaResult).some((problem) => problem.kind === "unsupported-alpha"),
    ).toBe(true);
    expect(
      expectProblems(wideColorResult).some(
        (problem) => problem.kind === "unsupported-source-color",
      ),
    ).toBe(true);
  });

  it("rejects invalid contrast levels before generation", () => {
    const result = dynamicSchemeSource({
      sourceColor: hex("#6750A4"),
      contrastLevel: 1.5,
    }).createGraph();

    expect(expectProblems(result)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: "invalid-contrast-level",
        }),
      ]),
    );
  });
});

function definedToken(): unknown {
  return expect.objectContaining({
    key: tokenKey("scheme.primary"),
    values: expect.any(Array),
  });
}

function expectColorToken<Token extends { readonly kind: string } | undefined>(
  token: Token,
): Extract<Token, { readonly kind: "color" }> {
  expect(token?.kind).toBe("color");
  if (token?.kind !== "color") throw new Error("Expected color token.");
  return token as Extract<Token, { readonly kind: "color" }>;
}

function expectOk<Value, Problem>(
  result:
    | { readonly ok: true; readonly value: Value }
    | { readonly ok: false; readonly problems: readonly Problem[] },
): Value {
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(JSON.stringify(result.problems));
  return result.value;
}

function expectProblems<Value, Problem>(
  result:
    | { readonly ok: true; readonly value: Value }
    | { readonly ok: false; readonly problems: readonly Problem[] },
): readonly Problem[] {
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error("Expected result to fail.");
  return result.problems;
}
