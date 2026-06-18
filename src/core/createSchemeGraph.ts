import type { ColorSchemeTokenGraph, TokenNode } from "./graph";
import type { ModeKey } from "./modes";
import { darkMode, lightMode } from "./modes";
import type { GraphBuildResult, SchemeSource, SchemeSourceProblem } from "./schemeSource";
import { validateGraph } from "./validateGraph";

export const GRAPH_SCHEMA_VERSION = "color-scheme-token-graph/v0";

export interface CreateSchemeGraphOptions {
  readonly modes?: readonly ModeKey[];
  readonly tokens?: readonly TokenNode[];
}

export function createSchemeGraph<Problem extends SchemeSourceProblem>(
  source: SchemeSource<Problem>,
): GraphBuildResult<Problem>;
export function createSchemeGraph(options?: CreateSchemeGraphOptions): ColorSchemeTokenGraph;
export function createSchemeGraph<Problem extends SchemeSourceProblem>(
  input: SchemeSource<Problem> | CreateSchemeGraphOptions = {},
): ColorSchemeTokenGraph | GraphBuildResult<Problem> {
  if (isSchemeSource(input)) {
    const graph = input.createGraph();
    if (!graph.ok) return graph;

    const validation = validateGraph(graph.value);
    return validation.ok ? { ok: true, value: graph.value } : validation;
  }

  return createTokenGraph(input);
}

export function createTokenGraph(options: CreateSchemeGraphOptions = {}): ColorSchemeTokenGraph {
  return {
    schemaVersion: GRAPH_SCHEMA_VERSION,
    modes: [...(options.modes ?? [lightMode, darkMode])],
    tokens: [...(options.tokens ?? [])],
  };
}

function isSchemeSource<Problem extends SchemeSourceProblem>(
  input: SchemeSource<Problem> | CreateSchemeGraphOptions,
): input is SchemeSource<Problem> {
  return "createGraph" in input && typeof input.createGraph === "function";
}
