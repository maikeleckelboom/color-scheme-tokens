import type { TokenNode, TokenNodeInput } from "../core/graph";

export interface ColorSchemeTokenLayerInput {
  readonly name?: string;
  readonly tokens: readonly TokenNodeInput[];
}

export interface ValidatedColorSchemeTokenLayer {
  readonly name?: string;
  readonly tokens: readonly TokenNode[];
}

export type ColorSchemeTokenLayer = ColorSchemeTokenLayerInput;
