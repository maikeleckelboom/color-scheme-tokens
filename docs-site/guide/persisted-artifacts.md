# Persisted Artifacts

Authoring helpers are friendly. Persisted artifacts are strict.

Use `defineTokens()` and `defineTokenGraph()` when code owns the authoring input. Use parsers and schemas when data is
loaded from disk, user input, a registry, or another tool.

## Helper Input

```ts
import { defineTokens } from "scheme-tokens";

const graph = defineTokens({
  background: "#ffffff",
  foreground: "oklch(0.2 0.02 285)",
});

export { graph };
```

The helper accepts color strings and returns strict graph input.

## Strict Graph Artifact

Persisted graph colors are structured values, not raw strings.

```ts
import { parseTokenGraph } from "scheme-tokens";

const artifact = {
  kind: "scheme-tokens/color-token-graph",
  formatVersion: 1,
  modes: ["base"],
  defaultMode: "base",
  defaultVisibility: "public",
  tokens: {
    background: {
      value: {
        colorSpace: "srgb",
        components: [1, 1, 1],
        alpha: 1,
        hex: "#ffffff",
      },
    },
  },
} as const;

const parsed = parseTokenGraph(artifact);
if (!parsed.ok) {
  throw new Error(JSON.stringify(parsed.issues, null, 2));
}

export { parsed };
```

The graph artifact kind is `scheme-tokens/color-token-graph`.

## Serialize and Parse a Compiled Scheme

```ts
import {
  compileTokenGraph,
  defineTokens,
  parseCompiledScheme,
  serializeCompiledScheme,
} from "scheme-tokens";

const graph = defineTokens({
  background: "#ffffff",
  foreground: "#111111",
});

const compiled = compileTokenGraph(graph);
if (!compiled.ok) {
  throw new Error(JSON.stringify(compiled.issues, null, 2));
}

const json = serializeCompiledScheme(compiled.value);
const parsed = parseCompiledScheme(JSON.parse(json));
if (!parsed.ok) {
  throw new Error(JSON.stringify(parsed.issues, null, 2));
}

const artifactKind = parsed.value.kind;
export { artifactKind, json };
```

The compiled artifact kind is `scheme-tokens/compiled-color-scheme`.

Schemas are structural preflight contracts. Parsers are semantic validation boundaries for mode coverage, references,
cycles, selection readiness, and cross-field rules.
