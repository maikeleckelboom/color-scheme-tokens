import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import * as root from "../../src";

const repoRoot = process.cwd();

describe("package boundary", () => {
  test("root runtime exports are exact", () => {
    expect(Object.keys(root).sort()).toEqual([
      "buildTokenSet",
      "compileTokenGraph",
      "defineTokenFragment",
      "defineTokenGraph",
      "exportCssVariables",
      "formatCssColor",
      "parseColor",
      "parseTokenGraph",
      "serializeTokenSet",
    ]);
  });

  test("package exports expose only root, schemas, and package metadata", () => {
    const manifest = readManifest();
    expect(Object.keys(manifest.exports).sort()).toEqual([
      ".",
      "./package.json",
      "./schemas/compiled-token-set.v1.schema.json",
      "./schemas/token-fragment.v1.schema.json",
      "./schemas/token-graph.v1.schema.json",
    ]);
  });

  test("core package has no runtime dependency graph", () => {
    const manifest = readManifest();
    expect(manifest.dependencies ?? {}).toEqual({});
    expect(JSON.stringify(manifest)).not.toContain("@material/material-color-utilities");
    expect(JSON.stringify(manifest)).not.toContain("@texel/color");
    expect(JSON.stringify(manifest)).not.toContain("css-tree");
  });

  test("source tree does not contain engine-backed adapter paths or imports", () => {
    expect(existsSync(join(repoRoot, "src", "conversion"))).toBe(false);
    expect(existsSync(join(repoRoot, "src", "sources", "material3"))).toBe(false);

    const sourceText = listFiles(join(repoRoot, "src"))
      .map((path) => readFileSync(path, "utf8"))
      .join("\n");
    expect(sourceText).not.toContain("@material/material-color-utilities");
    expect(sourceText).not.toContain("@texel/color");
    expect(sourceText).not.toContain("css-tree");
  });
});

interface PackageManifest {
  readonly dependencies?: Readonly<Record<string, string>>;
  readonly exports: Readonly<Record<string, unknown>>;
}

function readManifest(): PackageManifest {
  return JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8")) as PackageManifest;
}

function listFiles(directory: string): readonly string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}
