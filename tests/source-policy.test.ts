import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("source policy", () => {
  it("keeps the public index explicit and free of legacy wrapper exports", async () => {
    const index = await readFile("src/index.ts", "utf8");
    const forbidden = [
      "createTheme",
      "createScheme",
      "createColorScheme",
      "createCssVariables",
      "createCssVarMap",
      "MaterialTheme",
      "DynamicColorScheme",
      "PaletteStyle",
      "exportJsonTokens",
    ];

    expect(index).not.toMatch(/export\s+\*/);
    for (const name of forbidden) {
      expect(index).not.toMatch(new RegExp(`\\b${name}\\b`));
    }
  });

  it("does not use deprecated upstream dynamic-color APIs", async () => {
    const source = await readSourceFiles("src");

    expect(source).not.toMatch(/import\s*\{[^}]*\bScheme\b[^}]*\}/);
    expect(source).not.toMatch(
      /\bScheme\.(light|dark|lightContent|darkContent|lightFromCorePalette|darkFromCorePalette)\b/,
    );
    expect(source).not.toMatch(/\bMaterialDynamicColors\./);
    expect(source).not.toContain("themeFromSourceColor");
    expect(source).not.toContain("applyTheme");
  });
});

async function readSourceFiles(directory: string): Promise<string> {
  const entries = await readdir(directory, { withFileTypes: true });
  const contents = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return readSourceFiles(path);
      if (!entry.name.endsWith(".ts")) return "";
      return readFile(path, "utf8");
    }),
  );

  return contents.join("\n");
}
