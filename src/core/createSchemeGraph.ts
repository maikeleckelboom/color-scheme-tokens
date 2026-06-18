import type { ColorSchemeTokenGraph, TokenNode } from "./graph";
import type { ModeKey } from "./modes";
import { darkMode, lightMode } from "./modes";
import type { GraphBuildResult, SchemeSource, SchemeSourceProblem } from "./schemeSource";
import { validateGraph } from "./validateGraph";

export const GRAPH_SCHEMA_VERSION = "color-scheme-token-graph/v0";

export interface CreateTokenGraphOptions {
  readonly modes?: readonly ModeKey[];
  readonly tokens?: readonly TokenNode[];
}

export interface CreateSchemeGraphFromSourceOptions<
  Problem extends SchemeSourceProblem = SchemeSourceProblem,
> {
  readonly source: SchemeSource<Problem>;
}

export type CreateSchemeGraphOptions<Problem extends SchemeSourceProblem = SchemeSourceProblem> =
  CreateSchemeGraphFromSourceOptions<Problem>;

export function createSchemeGraph<Problem extends SchemeSourceProblem>(
  options: CreateSchemeGraphOptions<Problem>,
): GraphBuildResult<Problem>;
export function createSchemeGraph<Problem extends SchemeSourceProblem>(
  options: CreateSchemeGraphOptions<Problem>,
): GraphBuildResult<Problem> {
  const graph = options.source.createGraph();
  if (!graph.ok) return graph;

  const validation = validateGraph(graph.value);
  return validation.ok ? { ok: true, value: graph.value } : validation;
}

export function createTokenGraph(options: CreateTokenGraphOptions = {}): ColorSchemeTokenGraph {
  return {
    schemaVersion: GRAPH_SCHEMA_VERSION,
    modes: [...(options.modes ?? [lightMode, darkMode])],
    tokens: [...(options.tokens ?? [])],
  };
}
