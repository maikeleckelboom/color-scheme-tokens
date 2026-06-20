# API Reference

The root API is small. Guides show the full workflows; this page is a terse map.

## Authoring

| API                | Use                               | Example                                                             | Input                                     | Output                                       | Gotcha                                         |
| ------------------ | --------------------------------- | ------------------------------------------------------------------- | ----------------------------------------- | -------------------------------------------- | ---------------------------------------------- |
| `defineTokens`     | Define a simple token record.     | `defineTokens({ background: "#fff" })`                              | Token record plus optional graph options. | Strict graph input.                          | Bare strings are colors, not references.       |
| `defineTokenGraph` | Define full graph-shaped input.   | `defineTokenGraph({ tokens: { primary: "#6750a4" } })`              | Graph object with `tokens`.               | Strict graph input.                          | Flat top-level token records are not accepted. |
| `defineTokenLayer` | Define an ordered overlay layer.  | `defineTokenLayer({ id: "brand", tokens: { primary: "#6750a4" } })` | Layer object.                             | Strict layer input.                          | Layers do not own graph modes.                 |
| `defineAliases`    | Create alias token definitions.   | `defineAliases({ primary: "brand.primary" })`                       | Alias map.                                | Token definitions with `{ value: { ref } }`. | Targets must already be valid token keys.      |
| `tokenRef`         | Reference one token from another. | `tokenRef("brand.primary")`                                         | Token key string.                         | `{ ref: "brand.primary" }`.                  | Invalid keys throw at authoring time.          |

## Compile and Build

| API                   | Use                             | Example                                         | Input                                   | Output                         | Gotcha                                              |
| --------------------- | ------------------------------- | ----------------------------------------------- | --------------------------------------- | ------------------------------ | --------------------------------------------------- |
| `compileTokenGraph`   | Validate and resolve a graph.   | `compileTokenGraph(graph)`                      | Graph input plus optional selection.    | `Result<CompiledColorScheme>`. | Defaults to public tokens.                          |
| `buildScheme`         | Run source adapters and layers. | `buildScheme(material3("#6750a4"), { layers })` | Base source, layers, or options object. | `Result<CompiledColorScheme>`. | At least one base or layer is required.             |
| `createSchemeBuilder` | Reuse the same build options.   | `createSchemeBuilder({ layers }).build(source)` | Build config without `base`.            | Immutable builder.             | Runtime Material options stay inside `material3()`. |

## Export and Serialize

| API                       | Use                                    | Example                                   | Input                             | Output                                            | Gotcha                                                  |
| ------------------------- | -------------------------------------- | ----------------------------------------- | --------------------------------- | ------------------------------------------------- | ------------------------------------------------------- |
| `exportCssVars`           | Export CSS custom properties.          | `exportCssVars(compiled.value)`           | Compiled scheme plus CSS options. | `Result` with `css`, `blocks`, `variableByToken`. | Custom names must be unique.                            |
| `serializeCompiledScheme` | Write deterministic compiled JSON.     | `serializeCompiledScheme(compiled.value)` | Compiled scheme.                  | JSON string.                                      | Serializes resolved output, not helper input.           |
| `serializeTokenGraph`     | Write deterministic strict graph JSON. | `serializeTokenGraph(graph)`              | Strict graph input.               | JSON string.                                      | Helper shorthand is already normalized.                 |
| `serializeTokenLayer`     | Write deterministic strict layer JSON. | `serializeTokenLayer(layer)`              | Strict layer input.               | JSON string.                                      | Layers are graph contributions, not standalone schemes. |

## Parse

| API                   | Use                            | Example                                 | Input                             | Output                          | Gotcha                                        |
| --------------------- | ------------------------------ | --------------------------------------- | --------------------------------- | ------------------------------- | --------------------------------------------- |
| `parseCompiledScheme` | Validate loaded compiled JSON. | `parseCompiledScheme(JSON.parse(text))` | Unknown value.                    | `Result<CompiledColorScheme>`.  | Use before exporting CSS from external data.  |
| `parseTokenGraph`     | Validate loaded graph JSON.    | `parseTokenGraph(value)`                | Unknown value.                    | `Result<ColorTokenGraph>`.      | Strict colors only.                           |
| `parseTokenLayer`     | Validate loaded layer JSON.    | `parseTokenLayer(value)`                | Unknown value.                    | `Result<ColorTokenLayerInput>`. | Requires layer `kind` and `id`.               |
| `parseColor`          | Parse one supported color.     | `parseColor("oklch(0.7 0.12 265)")`     | Color string or structured color. | `Result<ColorValue>`.           | CSS named colors are not supported.           |
| `formatCssColor`      | Format a parsed color as CSS.  | `formatCssColor(color)`                 | `ColorValue`.                     | CSS color string.               | It formats; it does not convert color spaces. |

## Checked Example

```ts
import {
  compileTokenGraph,
  defineAliases,
  defineTokenGraph,
  defineTokenLayer,
  defineTokens,
  exportCssVars,
  formatCssColor,
  parseColor,
  parseCompiledScheme,
  parseTokenGraph,
  parseTokenLayer,
  serializeCompiledScheme,
  serializeTokenGraph,
  serializeTokenLayer,
  tokenRef,
} from "scheme-tokens";

const graph = defineTokens({
  "brand.primary": "#6750a4",
  primary: tokenRef("brand.primary"),
  ...defineAliases({
    "primary-foreground": "brand.primary",
  }),
});

const explicitGraph = defineTokenGraph({
  tokens: {
    background: "#ffffff",
  },
});

const layer = defineTokenLayer({
  id: "brand",
  tokens: {
    primary: "#6750a4",
  },
});

const compiled = compileTokenGraph(graph, { selection: "all" });
if (!compiled.ok) {
  throw new Error(JSON.stringify(compiled.issues, null, 2));
}

const exported = exportCssVars(compiled.value);
if (!exported.ok) {
  throw new Error(JSON.stringify(exported.issues, null, 2));
}

const color = parseColor("#6750a4");
if (!color.ok) {
  throw new Error(JSON.stringify(color.issues, null, 2));
}

const cssColor = formatCssColor(color.value);
const compiledJson = serializeCompiledScheme(compiled.value);
const graphJson = serializeTokenGraph(explicitGraph);
const layerJson = serializeTokenLayer(layer);
const parsedCompiled = parseCompiledScheme(JSON.parse(compiledJson));
const parsedGraph = parseTokenGraph(JSON.parse(graphJson));
const parsedLayer = parseTokenLayer(JSON.parse(layerJson));

export { cssColor, exported, parsedCompiled, parsedGraph, parsedLayer };
```
