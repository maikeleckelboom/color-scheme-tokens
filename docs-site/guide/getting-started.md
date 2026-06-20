# Getting Started

This page builds one useful artifact: CSS variables from direct color tokens.

## Install

```bash
pnpm add scheme-tokens
```

## Define, Compile, Export

```ts
import { writeFile } from "node:fs/promises";
import { compileTokenGraph, defineTokens, exportCssVars } from "scheme-tokens";

const graph = defineTokens({
  background: "#ffffff",
  foreground: "#111111",
  primary: "oklch(0.54 0.16 285)",
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

await writeFile("src/styles/tokens.css", exported.value.css);

const primaryVariable = exported.value.variableByToken.primary;
export { primaryVariable };
```

`defineTokens()` is the smallest authoring helper. With no mode options it creates one mode named `base`.

`compileTokenGraph()` validates token keys, colors, references, modes, and the selected tokens. The default selection
is public tokens.

`exportCssVars()` returns:

- `css`: the stylesheet artifact;
- `blocks`: ordered structured declaration blocks;
- `variableByToken`: a token-key to CSS custom-property map.

## Return CSS From a Build Function

```ts
import { compileTokenGraph, defineTokens, exportCssVars } from "scheme-tokens";

export function buildTokenCss(): string {
  const graph = defineTokens({
    background: "#ffffff",
    foreground: "#111111",
    accent: "color(display-p3 0.42 0.32 0.74)",
  });

  const compiled = compileTokenGraph(graph);
  if (!compiled.ok) {
    throw new Error(JSON.stringify(compiled.issues, null, 2));
  }

  const exported = exportCssVars(compiled.value);
  if (!exported.ok) {
    throw new Error(JSON.stringify(exported.issues, null, 2));
  }

  return exported.value.css;
}
```

Direct colors can use supported CSS color strings such as hex, `rgb()`, `hsl()`, OKLCH, and `color(display-p3 ...)`.
Public product roles can stay direct like this, or move into `semanticTokens` later when they need to reference
implementation tokens.
