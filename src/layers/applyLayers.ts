import type { ColorSchemeTokenGraphInput, TokenNodeInput } from "../core/graph";
import type { ColorSchemeTokenLayerInput } from "./layer";

export function applyLayers(
  graph: ColorSchemeTokenGraphInput,
  layers: readonly ColorSchemeTokenLayerInput[],
): ColorSchemeTokenGraphInput {
  const layerTokens: TokenNodeInput[] = layers.flatMap((layer) =>
    layer.tokens.map((token) =>
      token.kind === "alias"
        ? {
            kind: "alias",
            key: token.key,
            target: token.target,
            ...(token.provenance === undefined ? {} : { provenance: token.provenance }),
          }
        : {
            kind: "color",
            key: token.key,
            values: token.values,
            ...(token.provenance === undefined ? {} : { provenance: token.provenance }),
          },
    ),
  );

  return {
    ...graph,
    tokens: [...graph.tokens, ...layerTokens],
  };
}
