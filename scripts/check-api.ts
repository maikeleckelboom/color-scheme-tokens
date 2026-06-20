// @ts-nocheck
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

assertEqual(
  Object.keys(packageJson.exports).sort(),
  [
    ".",
    "./package.json",
    "./schemas/compiled-token-set.v1.schema.json",
    "./schemas/token-fragment.v1.schema.json",
    "./schemas/token-graph.v1.schema.json",
  ],
  "package exports",
);

if ("dependencies" in packageJson && Object.keys(packageJson.dependencies).length > 0) {
  throw new Error("The core package must not declare runtime dependencies");
}

const manifests = [
  {
    name: "root",
    modulePath: "dist/index.js",
    dtsPath: "dist/index.d.ts",
    runtime: [
      "buildTokenSet",
      "compileTokenGraph",
      "defineTokenFragment",
      "defineTokenGraph",
      "exportCssVariables",
      "formatCssColor",
      "parseColor",
      "parseTokenGraph",
      "serializeTokenSet",
    ],
    types: [
      "JsonPrimitive",
      "JsonValue",
      "Issue",
      "NonEmptyIssues",
      "Result",
      "ColorSpace",
      "ColorInput",
      "ColorValue",
      "SrgbColorInput",
      "DisplayP3ColorInput",
      "OklchColorInput",
      "SrgbColor",
      "DisplayP3Color",
      "OklchColor",
      "ParseColorIssue",
      "TokenVisibility",
      "ReferenceInput",
      "ColorExpressionInput",
      "ColorExpression",
      "TokenDefinitionAuthoringInput",
      "TokenDefinitionInput",
      "TokenFragmentAuthoringInput",
      "TokenFragmentInput",
      "TokenGraphAuthoringInput",
      "TokenGraphInput",
      "TokenOrigin",
      "TokenGraphToken",
      "TokenGraph",
      "TokenGraphIssue",
      "TokenSelection",
      "CompileTokenGraphOptions",
      "CompileTokenGraphIssue",
      "CompiledToken",
      "CompiledTokenSet",
      "TokenSource",
      "BuildTokenSetOptions",
      "BuildTokenSetValue",
      "BuildTokenSetIssue",
      "CssScope",
      "CssModeSelectors",
      "ExportCssVariablesOptions",
      "ExportCssVariablesIssue",
    ],
  },
];

for (const manifest of manifests) {
  const module = await import(pathToFileURL(join(root, manifest.modulePath)).href);
  const runtime = Object.keys(module).sort();
  assertEqual(runtime, manifest.runtime, `${manifest.name} runtime exports`);

  const dts = readFileSync(join(root, manifest.dtsPath), "utf8");
  for (const typeName of manifest.types) {
    if (!new RegExp(`\\b${typeName}\\b`).test(dts)) {
      throw new Error(`${manifest.name} declaration is missing ${typeName}`);
    }
  }
  if (
    dts.includes("@texel/color") ||
    dts.includes("@material/material-color-utilities") ||
    dts.includes("css-tree")
  ) {
    throw new Error(`${manifest.name} declaration leaks dependency types`);
  }
}

const rootBundle = readFileSync(join(root, "dist/index.js"), "utf8");
if (
  rootBundle.includes("@texel/color") ||
  rootBundle.includes("@material/material-color-utilities") ||
  rootBundle.includes("css-tree")
) {
  throw new Error("Root import graph references optional engine dependencies");
}

function assertEqual(actual, expected, label) {
  const expectedSorted = [...expected].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expectedSorted)) {
    throw new Error(
      `${label} mismatch\nactual: ${actual.join(", ")}\nexpected: ${expectedSorted.join(", ")}`,
    );
  }
}
