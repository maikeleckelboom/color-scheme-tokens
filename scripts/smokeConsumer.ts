import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const packageJson = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8"));
const packageName = packageJson.name;
const pnpmExecPath = process.env.npm_execpath;
const workspace = mkdtempSync(join(tmpdir(), "color-scheme-tokens-smoke-"));
const packDirectory = join(workspace, "pack");
const consumerDirectory = join(workspace, "consumer");

mkdirSync(packDirectory, { recursive: true });
mkdirSync(consumerDirectory, { recursive: true });
const tarballName = runPnpm(["pack", "--pack-destination", packDirectory], repoRoot)
  .trim()
  .split(/\r?\n/)
  .at(-1);

if (!tarballName) {
  throw new Error("Unable to determine packed tarball name.");
}

const tarballPath = join(packDirectory, basename(tarballName));

writeFileSync(
  join(workspace, "README.txt"),
  `Temporary packed-consumer smoke workspace for ${packageName}.\n`,
);
writeFileSync(
  join(consumerDirectory, "package.json"),
  JSON.stringify(
    {
      private: true,
      type: "module",
      dependencies: {
        [packageName]: `file:${tarballPath.replaceAll("\\", "/")}`,
      },
    },
    null,
    2,
  ),
);
writeFileSync(
  join(consumerDirectory, "esm.mjs"),
  `
import { appSurfaceProfile, createSchemeTokens, dynamicSchemeSource, hex } from ${JSON.stringify(packageName)};

const result = createSchemeTokens({
  source: dynamicSchemeSource({ sourceColor: hex("#6750A4") }),
  profile: appSurfaceProfile,
  css: { prefix: "theme" },
});

if (!result.ok) throw new Error(JSON.stringify(result.problems));
if (!result.value.cssVariables.includes("--theme-chrome-background:")) {
  throw new Error("Missing profiled CSS variable from ESM import.");
}
`,
);
writeFileSync(
  join(consumerDirectory, "cjs.cjs"),
  `
const { appSurfaceProfile, createSchemeTokens, dynamicSchemeSource, hex } = require(${JSON.stringify(packageName)});

const result = createSchemeTokens({
  source: dynamicSchemeSource({ sourceColor: hex("#6750A4") }),
  profile: appSurfaceProfile,
  css: { prefix: "theme" },
});

if (!result.ok) throw new Error(JSON.stringify(result.problems));
if (!result.value.cssVariables.includes("--theme-chrome-background:")) {
  throw new Error("Missing profiled CSS variable from CJS require.");
}
`,
);
writeFileSync(
  join(consumerDirectory, "types.ts"),
  `
import {
  appSurfaceProfile,
  createSchemeTokens,
  dynamicSchemeSource,
  hex,
  type SchemeTokensRecipeResult,
} from ${JSON.stringify(packageName)};

const result = createSchemeTokens({
  source: dynamicSchemeSource({ sourceColor: hex("#6750A4") }),
  profile: appSurfaceProfile,
  css: { prefix: "theme" },
});

if (result.ok) {
  const value: SchemeTokensRecipeResult = result.value;
  value.cssVariables.includes("--theme-chrome-background:");
}
`,
);
writeFileSync(
  join(consumerDirectory, "tsconfig.json"),
  JSON.stringify(
    {
      compilerOptions: {
        strict: true,
        skipLibCheck: false,
        module: "NodeNext",
        moduleResolution: "NodeNext",
        target: "ES2022",
        noEmit: true,
        types: [],
      },
      include: ["types.ts"],
    },
    null,
    2,
  ),
);

runPnpm(["install", "--ignore-scripts"], consumerDirectory);
run("node", ["esm.mjs"], consumerDirectory);
run("node", ["cjs.cjs"], consumerDirectory);
run(
  "node",
  [join(repoRoot, "node_modules", "typescript", "bin", "tsc"), "-p", "tsconfig.json"],
  consumerDirectory,
);

function runPnpm(args, cwd) {
  if (pnpmExecPath === undefined) return run("pnpm", args, cwd);
  return run(process.execPath, [pnpmExecPath, ...args], cwd);
}

function run(command, args, cwd) {
  return execFileSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  });
}
