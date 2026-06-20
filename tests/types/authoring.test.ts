import {
  defineTokenFragment,
  defineTokenGraph,
  type ExportCssVariablesOptions,
  type TokenGraphInput,
} from "../../src";

const simpleGraph = defineTokenGraph({
  tokens: {
    "app.background": "#ffffff",
    "app.foreground": { ref: "app.background" },
  },
});

const typedSimpleGraph = simpleGraph satisfies TokenGraphInput<"base">;
typedSimpleGraph.defaultMode.toUpperCase();

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
