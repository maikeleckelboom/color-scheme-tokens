import { describe, expect, it } from "vitest";
import * as api from "../src/index";
import * as material3Api from "../src/sources/material3/index";

describe("public API", () => {
  it("exports only the generic root runtime surface", () => {
    expect(Object.keys(api).sort()).toEqual(
      [
        "compileGraph",
        "createSchemeTokens",
        "createSourceGraph",
        "darkMode",
        "exportCssVariables",
        "hex",
        "lightMode",
        "literalColor",
        "modeKey",
        "parseHexColor",
        "parseModeKey",
        "parseTokenKey",
        "serializeTokenSet",
        "srgb255",
        "tokenKey",
        "validateGraph",
      ].sort(),
    );
  });

  it("exports Material 3 source runtime from the adapter subpath only", () => {
    expect(Object.prototype.hasOwnProperty.call(api, "material3Source")).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(api, "dynamicSchemeSource")).toBe(false);
    expect(Object.keys(material3Api)).toEqual(["material3Source"]);
  });

  it("does not expose legacy wrapper API names", () => {
    const forbidden = [
      "createTheme",
      "createColorScheme",
      "createCssVariables",
      "createCssVarMap",
      "createMaterialSchemeTokens",
      "createScheme",
      "MaterialTheme",
      "DynamicColorScheme",
      "DynamicSchemeSource",
      "dynamicSchemeSource",
      "material3Source",
      "PaletteStyle",
      "exportJsonTokens",
      "solidColorIntent",
      "createSchemeGraph",
    ];

    for (const name of forbidden) {
      expect(Object.prototype.hasOwnProperty.call(api, name)).toBe(false);
    }
  });
});
