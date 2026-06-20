import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

interface PackageManifest {
  readonly dependencies?: Readonly<Record<string, string>>;
  readonly devDependencies?: Readonly<Record<string, string>>;
  readonly peerDependencies?: Readonly<Record<string, string>>;
  readonly files: readonly string[];
  readonly license?: string;
  readonly private?: boolean;
  readonly publishConfig?: Readonly<Record<string, string>>;
  readonly scripts?: Readonly<Record<string, string>>;
  readonly version: string;
}

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const workspace = mkdtempSync(join(tmpdir(), "scheme-tokens-material3-tarball-"));
const packDirectory = join(workspace, "pack");
mkdirSync(packDirectory, { recursive: true });

const output = runPnpm(["pack", "--pack-destination", packDirectory], packageRoot)
  .trim()
  .split(/\r?\n/)
  .at(-1);
if (output === undefined) {
  throw new Error("Unable to determine packed adapter tarball name");
}

const tarball = join(packDirectory, basename(output));
const files = execFileSync("tar", ["-tf", tarball], { encoding: "utf8" }).trim().split(/\r?\n/);
const denied = [
  /^package\/src\//,
  /^package\/tests\//,
  /^package\/scripts\//,
  /^package\/\.\.\/\.\.\//,
  /SOURCE-CONVERSATION/i,
];

for (const file of files) {
  if (denied.some((pattern) => pattern.test(file))) {
    throw new Error(`Unexpected file in adapter tarball: ${file}`);
  }
  if (
    !(
      file === "package/package.json" ||
      file === "package/README.md" ||
      file === "package/NOTICE.md" ||
      file === "package/LICENSE" ||
      file === "package/LICENSE-APACHE-2.0" ||
      file.startsWith("package/dist/")
    )
  ) {
    throw new Error(`File is not in the adapter tarball allowlist: ${file}`);
  }
}

const manifest = JSON.parse(
  readFileSync(join(packageRoot, "package.json"), "utf8"),
) as PackageManifest;
if (manifest.version !== "0.1.0") {
  throw new Error("adapter package version must be 0.1.0 for the first public release candidate");
}
if (manifest.private !== undefined) {
  throw new Error("adapter package must not be private when checking the public tarball");
}
if (manifest.publishConfig?.access !== "public") {
  throw new Error("scoped adapter package must publish with public access");
}
if (!manifest.files.includes("dist")) {
  throw new Error("adapter package files must include dist");
}
if (!manifest.files.includes("NOTICE.md")) {
  throw new Error("adapter package files must include third-party notices for bundled engine code");
}
if (!manifest.files.includes("LICENSE-APACHE-2.0")) {
  throw new Error(
    "adapter package files must include Apache-2.0 license text for bundled engine code",
  );
}
if (manifest.license !== "MIT AND Apache-2.0") {
  throw new Error(
    "adapter package license must disclose owned MIT code plus bundled Apache-2.0 code",
  );
}
const noticeText = readFileSync(join(packageRoot, "NOTICE.md"), "utf8");
if (
  !noticeText.includes("material-foundation/material-color-utilities") ||
  !noticeText.includes("6fd88eb3e95ba1d457842e2a2bf847d06b3a018a") ||
  !noticeText.includes("Apache License, Version 2.0") ||
  !noticeText.includes("Google LLC")
) {
  throw new Error("adapter third-party notice must cover the vendored Material engine");
}
const apacheLicenseText = readFileSync(join(packageRoot, "LICENSE-APACHE-2.0"), "utf8");
if (
  !apacheLicenseText.includes("Apache License") ||
  !apacheLicenseText.includes("Version 2.0, January 2004") ||
  !apacheLicenseText.includes("TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION")
) {
  throw new Error("adapter Apache license file must contain the full Apache-2.0 license text");
}
if (manifest.dependencies?.["@material/material-color-utilities"] !== undefined) {
  throw new Error("adapter package must not depend on the lagging npm Material engine");
}
if (manifest.devDependencies?.["@material/material-color-utilities"] !== undefined) {
  throw new Error("adapter package must not duplicate the Material engine in devDependencies");
}
if (manifest.peerDependencies?.["scheme-tokens"] !== "^0.1.0") {
  throw new Error("adapter package must peer-depend on scheme-tokens");
}
if (manifest.devDependencies?.["scheme-tokens"] !== "workspace:*") {
  throw new Error("adapter package must use scheme-tokens as a workspace dev dependency");
}
for (const scriptName of ["lint", "format", "format:fix"]) {
  if (!manifest.scripts?.[scriptName]?.includes("src/vendor/material-color-utilities/**")) {
    throw new Error(
      `adapter ${scriptName} script must intentionally exclude vendored Material source`,
    );
  }
}
if (
  JSON.stringify(manifest.dependencies ?? {}).includes("workspace:") ||
  JSON.stringify(manifest.peerDependencies ?? {}).includes("workspace:")
) {
  throw new Error("adapter runtime dependency fields must not leak workspace protocols");
}

const bundleText = readFileSync(join(packageRoot, "dist", "index.js"), "utf8");
const sourceMapText = readFileSync(join(packageRoot, "dist", "index.js.map"), "utf8");
const declarationText = readFileSync(join(packageRoot, "dist", "index.d.ts"), "utf8");
if (!bundleText.includes("src/vendor/material-color-utilities")) {
  throw new Error("adapter bundle must inline the vendored Material engine");
}
if (!sourceMapText.includes("../src/vendor/material-color-utilities")) {
  throw new Error("adapter source map must preserve vendored Material engine provenance");
}
if (declarationText.includes("vendor/material-color-utilities")) {
  throw new Error("adapter public declarations must not expose vendored Material internals");
}

function runPnpm(args: readonly string[], cwd: string): string {
  const npmExecPath = process.env.npm_execpath;
  return npmExecPath === undefined
    ? execFileSync("pnpm", args, { cwd, encoding: "utf8" })
    : execFileSync(process.execPath, [npmExecPath, ...args], { cwd, encoding: "utf8" });
}
