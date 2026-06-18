import type { ColorSchemeTokenGraph, Result } from "./graph";
import type { TokenKey } from "./keys";
import type { TokenGraphProblem } from "./validateGraph";

export interface SchemeRoleDefinition {
  readonly key: TokenKey;
  readonly sourceRole: string;
  readonly required: boolean;
}

export interface SchemeRoleSet {
  readonly sourceId: string;
  readonly roles: readonly SchemeRoleDefinition[];
}

export interface SchemeSourceProblem {
  readonly kind: string;
  readonly message: string;
  readonly sourceId?: string;
  readonly key?: string;
  readonly mode?: string;
  readonly role?: string;
  readonly path?: string;
}

export interface SchemeSource<Problem extends SchemeSourceProblem = SchemeSourceProblem> {
  readonly id: string;
  readonly roleSet: SchemeRoleSet;
  createGraph(): Result<ColorSchemeTokenGraph, Problem>;
}

export type GraphBuildProblem<Problem extends SchemeSourceProblem = SchemeSourceProblem> =
  | Problem
  | TokenGraphProblem;

export type GraphBuildResult<Problem extends SchemeSourceProblem = SchemeSourceProblem> = Result<
  ColorSchemeTokenGraph,
  GraphBuildProblem<Problem>
>;
