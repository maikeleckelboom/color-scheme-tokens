import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  tsconfig: "tsconfig.lib.json",
  sourcemap: true,
  clean: true,
  treeshake: true,
});
