import type { ColorSchemeTokenGraphInput, Result, ValidatedColorSchemeTokenGraph } from "./graph";
import type { TokenKey } from "./keys";
import type { TokenGraphProblem } from "./validateGraph";

export interface ColorSchemeTokenSourceRoleDefinition {
  readonly key: TokenKey;
  readonly sourceRole: string;
  readonly required: boolean;
}

export interface ColorSchemeTokenSourceRoleSet {
  readonly sourceId: string;
  readonly roles: readonly ColorSchemeTokenSourceRoleDefinition[];
}

export interface ColorSchemeTokenSourceProblem {
  readonly kind: string;
  readonly message: string;
  readonly sourceId?: string;
  readonly key?: string;
  readonly mode?: string;
  readonly role?: string;
  readonly path?: string;
}

export interface ColorSchemeTokenSource<
  Problem extends ColorSchemeTokenSourceProblem = ColorSchemeTokenSourceProblem,
> {
  readonly id: string;
  readonly roleSet: ColorSchemeTokenSourceRoleSet;
  createGraph(): Result<ColorSchemeTokenGraphInput, Problem>;
}

export type GraphBuildProblem<
  Problem extends ColorSchemeTokenSourceProblem = ColorSchemeTokenSourceProblem,
> = Problem | TokenGraphProblem;

export type GraphBuildResult<
  Problem extends ColorSchemeTokenSourceProblem = ColorSchemeTokenSourceProblem,
> = Result<ValidatedColorSchemeTokenGraph, GraphBuildProblem<Problem>>;
