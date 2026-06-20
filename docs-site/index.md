# scheme-tokens

Define color tokens, compile the selected scheme, and export deterministic CSS variables.

`scheme-tokens` is for applications that own their token names and need stable CSS artifacts. Start with manual colors:
Material 3, Tailwind, persisted JSON, and adapter architecture can wait until the first stylesheet is working.

## Install

```bash
pnpm add scheme-tokens
```

## First Path

```ts
import { compileTokenGraph, defineTokens, exportCssVars } from "scheme-tokens";

const graph = defineTokens({
  background: "#ffffff",
  foreground: "#111111",
  primary: "#6750a4",
  "primary-foreground": "#ffffff",
});

const compiled = compileTokenGraph(graph);
if (!compiled.ok) {
  throw new Error(JSON.stringify(compiled.issues, null, 2));
}

const exported = exportCssVars(compiled.value);
if (!exported.ok) {
  throw new Error(JSON.stringify(exported.issues, null, 2));
}

const stylesheet = exported.value.css;
const primaryVariable = exported.value.variableByToken.primary;

export { primaryVariable, stylesheet };
```

Use the stylesheet artifact in a build step, SSR response, or app CSS import:

```css
@import "./tokens.css";

.button {
  background: var(--primary);
  color: var(--primary-foreground);
}
```

The default export uses authored runtime variable names:

```css
:root {
  --background: #ffffff;
  --foreground: #111111;
  --primary: #6750a4;
  --primary-foreground: #ffffff;
}
```

## Go Next

- [Getting Started](./guide/getting-started.md) keeps the direct-token path short.
- [Light and Dark](./guide/light-dark.md) adds modes and selector control.
- [Material 3](./guide/material-3.md) uses the optional adapter without making it the default path.
- [Tailwind](./guide/tailwind.md) maps runtime variables into Tailwind's `@theme` contract.
- [Recipes](./recipes/index.md) gives compact copy-paste snippets.
- [API Reference](./reference/api.md) lists the root exports.
- [Schema Reference](./reference/schemas.md) covers strict persisted artifacts.

## What It Owns

The root package owns color token graphs, parsing, compilation, deterministic serialization, and CSS variable export. It
does not load Material 3, Texel, browser canvas, image extraction, or conversion engines. Optional capabilities live in
adapter packages such as `@scheme-tokens/material3`.
