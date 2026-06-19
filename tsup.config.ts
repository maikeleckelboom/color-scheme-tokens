import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/sources/material3/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  noExternal: ["@material/material-color-utilities"],
});
