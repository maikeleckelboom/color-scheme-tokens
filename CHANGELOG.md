# Changelog

## 0.1.0

- Release the dependency-light `color-scheme-tokens` core package with explicit token graph contracts, strict graph
  parsing, token compilation, deterministic serialization, and `Result` / `Issue` diagnostics.
- Publish strict JSON Schema artifacts for persisted token graphs, token fragments, and serialized compiled token sets.
- Support CSS variable export through `exportCssVariables(..., { prefix })`; the removed `variablePrefix` option is not
  accepted.
- Keep authoring helpers ergonomic with JSON-safe manual token graphs while preserving strict persisted input behavior.
- Release `@color-scheme-tokens/source-material3` as a separate Material 3 source adapter package that owns all Material
  behavior, uses `sourceColor`, supports `extendedColors`, and depends on the real Material color utility engine.
- Preserve the package boundary: the root package has no Material dependency, Material exports, Material subpaths, or
  Material schema branches.
