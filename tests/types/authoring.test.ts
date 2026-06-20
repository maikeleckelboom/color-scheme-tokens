import {
  buildTokenSet,
  defineTokenFragment,
  defineTokenGraph,
  type ExportCssVariablesOptions,
  type Issue,
  type Result,
  type TokenGraphInput,
  type TokenSource,
} from "../../src";

const simpleGraph = defineTokenGraph({
  tokens: {
    "app.background": "#ffffff",
    "app.foreground": { ref: "app.background" },
  },
});

const typedSimpleGraph = simpleGraph satisfies TokenGraphInput<"base">;
typedSimpleGraph.defaultMode.toUpperCase();

const source: TokenSource = {
  id: "brand",
  build(): Result<TokenGraphInput, Issue> {
    return { ok: true, value: simpleGraph };
  },
};

buildTokenSet({ sources: [source] });

// @ts-expect-error source is not a buildTokenSet option.
buildTokenSet({ source });

// @ts-expect-error sources is required.
buildTokenSet({});

// @ts-expect-error sources must be a non-empty array.
buildTokenSet({ sources: [] });

const graph = defineTokenGraph({
  modes: ["light", "dark"],
  defaultMode: "light",
  tokens: {
    "app.background": {
      light: "#ffffff",
      dark: "#111111",
    },
  },
});

const typedGraph = graph satisfies TokenGraphInput<"light" | "dark">;
typedGraph.defaultMode.toUpperCase();

defineTokenFragment({
  id: "brand",
  tokens: {
    "brand.primary": "#6750a4",
  },
});

const cssOptions: ExportCssVariablesOptions = { prefix: "theme" };
cssOptions.prefix?.toUpperCase();

const legacyCssOptions: ExportCssVariablesOptions = {
  // @ts-expect-error variablePrefix is not part of the public CSS export options.
  variablePrefix: "theme",
};
legacyCssOptions.prefix?.toUpperCase();

defineTokenGraph({
  modes: ["light", "dark"],
  // @ts-expect-error defaultMode must be one of the declared modes.
  defaultMode: "sepia",
  defaultVisibility: "public",
  tokens: {},
});

defineTokenGraph({
  modes: ["light", "dark"],
  defaultMode: "light",
  defaultVisibility: "public",
  tokens: {
    // @ts-expect-error dark mode is required.
    "app.background": {
      valueByMode: {
        light: "#ffffff",
      },
    },
  },
});
