import {
  compileGraph,
  type CompileOptions,
  type CompileProblem,
  type CompiledTokenSet,
} from "../core/compileGraph";
import { createSchemeGraph } from "../core/createSchemeGraph";
import type { ColorSchemeTokenGraph, Result } from "../core/graph";
import type { GraphBuildProblem, SchemeSource, SchemeSourceProblem } from "../core/schemeSource";
import { serializeTokenSet } from "../core/serializeTokenSet";
import { exportCssVariables, type CssVariableOptions } from "../exporters/exportCssVariables";
import { applyProfile } from "../profiles/applyProfile";
import type { ColorSchemeProfile } from "../profiles/profile";

export interface SchemeTokensRecipeOptions {
  readonly source: SchemeSource;
  readonly profile?: ColorSchemeProfile;
  readonly compile?: CompileOptions;
  readonly css?: CssVariableOptions;
}

export interface SchemeTokensRecipeResult {
  readonly graph: ColorSchemeTokenGraph;
  readonly tokenSet: CompiledTokenSet;
  readonly cssVariables: string;
  readonly snapshot: string;
}

export type SchemeTokensRecipeProblem = GraphBuildProblem<SchemeSourceProblem> | CompileProblem;

export function createSchemeTokens(
  options: SchemeTokensRecipeOptions,
): Result<SchemeTokensRecipeResult, SchemeTokensRecipeProblem> {
  const graphResult = createSchemeGraph({ source: options.source });
  if (!graphResult.ok) return graphResult;

  const graph =
    options.profile === undefined
      ? graphResult.value
      : applyProfile(graphResult.value, options.profile);
  const compiled = compileGraph(graph, options.compile);
  if (!compiled.ok) return compiled;

  return {
    ok: true,
    value: {
      graph,
      tokenSet: compiled.value,
      cssVariables: exportCssVariables(compiled.value, options.css),
      snapshot: serializeTokenSet(compiled.value),
    },
  };
}
