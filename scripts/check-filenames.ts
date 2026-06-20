import { readdirSync, statSync } from "node:fs";
import { basename, join } from "node:path";

const checkedRoots = ["src", "tests", "scripts", "docs", "packages"] as const;
const conventionalNames = new Set([
  "AGENTS.md",
  "CHANGELOG.md",
  "LICENSE",
  "NOTICE.md",
  "README.md",
  "index.ts",
  "package.json",
  "tsconfig.json",
]);
const kebabCaseFileName = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+(?:-[a-z0-9]+)*)*$/;
const vendoredMaterialPath = join(
  "packages",
  "material3",
  "src",
  "vendor",
  "material-color-utilities",
);
const failures: string[] = [];

for (const root of checkedRoots) {
  checkDirectory(root);
}

if (failures.length > 0) {
  throw new Error(`Expected kebab-case filenames:\n${failures.join("\n")}`);
}

function checkDirectory(directory: string): void {
  if (directory === vendoredMaterialPath) {
    return;
  }

  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) {
      if (entry === "node_modules") {
        continue;
      }
      checkDirectory(path);
      continue;
    }

    const name = basename(path);
    if (conventionalNames.has(name) || kebabCaseFileName.test(name)) {
      continue;
    }

    failures.push(path);
  }
}
