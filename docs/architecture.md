# Architecture

`color-scheme-tokens` is a dependency-light color-token graph core. The graph is the system of record; source adapters
feed it, validation and compilation resolve it, and exporters project compiled sets.

## Core Ownership

The root package owns:

- token graph contracts;
- JSON-safe public authoring inputs;
- graph parsing and validation;
- token compilation;
- deterministic serialization;
- CSS variable export;
- `Result` and `Issue` contracts;
- adapter interfaces.

The root package does not own Material 3, Texel, image extraction, browser canvas behavior, CSS parser engines,
color-conversion engines, or any other optional capability engine.

## Pipeline

```text
authoring helper or adapter source
  -> strict token graph input
  -> parse and validate
  -> compile selected tokens
  -> serialize or export CSS
```

`defineTokenGraph()` and `defineTokenFragment()` are authoring helpers. They may fill safe defaults and normalize
shorthands, but `parseTokenGraph()` remains the strict boundary for persisted wire-format data.

## Compilation

Compilation validates first, then resolves selected tokens. The default selection is `public`; exact key selection and
`all` selection are explicit options.

Compiled tokens store direct dependencies by mode. Full transitive analysis is intentionally not stored in every compiled
token; it can be added later as an on-demand analyzer without bloating the default compiled artifact.

## Exporters

Exporters consume compiled token sets only. They do not validate graphs, resolve references, load engines, or mutate token
sets.

The CSS exporter is dependency-free and uses a conservative selector validator. It supports the generated root,
data-attribute, class, and simple exact-selector workflows without making a CSS parser part of the core dependency graph.

## Determinism

Object-record diagnostics, compiled token keys, serialized JSON keys, modes after the default mode, and CSS declarations
use code-unit ordering. Public issue codes and JSON Pointer paths are contractual.
