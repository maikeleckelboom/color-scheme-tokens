import type { ColorSchemeTokenGraph, TokenNode } from "../core/graph";
import type { ColorSchemeProfile } from "./profile";

export function applyProfile(
  graph: ColorSchemeTokenGraph,
  profile: ColorSchemeProfile,
): ColorSchemeTokenGraph {
  const profileTokens: TokenNode[] = profile.tokens.map((token) =>
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
  );

  return {
    ...graph,
    tokens: [...graph.tokens, ...profileTokens],
  };
}
