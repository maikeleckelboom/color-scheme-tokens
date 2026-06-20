import type { TokenSource } from "scheme-tokens";
import {
  material3,
  material3Platforms,
  material3SpecVersions,
  material3Variants,
  type Material3ExtendedColorInput,
  type Material3Input,
  type Material3IntegrationOptions,
  type Material3Issue,
  type Material3PaletteOverridesInput,
  type Material3Platform,
  type Material3SourceColorsInput,
  type Material3SpecVersion,
  type Material3Variant,
} from "../../src";

const variant: Material3Variant = material3Variants[0];
const specVersion: Material3SpecVersion = material3SpecVersions[0];
const platform: Material3Platform = material3Platforms[0];
const scalarSourceColors: Material3SourceColorsInput = "#6750a4";
const arraySourceColors: Material3SourceColorsInput = ["#6750a4", "#00a88f"];
const palettes: Material3PaletteOverridesInput = {
  primary: "#6750a4",
  neutralVariant: "#605d66",
};
const extendedColor: Material3ExtendedColorInput = {
  name: "success",
  color: "#2e7d32",
  harmonize: true,
  description: "Positive state color",
};

const input: Material3Input = {
  sourceColors: scalarSourceColors,
  variant,
  contrastLevel: 0.5,
  specVersion,
  platform,
  palettes,
  extendedColors: [extendedColor],
  paletteTones: [40, 90],
};
const options: Material3IntegrationOptions = {
  id: "brand-material",
  defaultVisibility: "internal",
};

const source: TokenSource<Material3Issue> = material3(input, options);
source.id.toUpperCase();
material3({ sourceColors: arraySourceColors });
material3({ sourceColors: "#6750a4", paletteTones: true });

// @ts-expect-error sourceColors is required.
material3({});

// @ts-expect-error sourceColors cannot be an empty tuple.
material3({ sourceColors: [] });

// @ts-expect-error id belongs in the second argument.
material3({ sourceColors: "#6750a4", id: "brand-material" });

// @ts-expect-error defaultVisibility belongs in the second argument.
material3({ sourceColors: "#6750a4", defaultVisibility: "internal" });

// @ts-expect-error sourceColor is not an alias for sourceColors.
material3({ sourceColor: "#6750a4" });

// @ts-expect-error color is not a Material 3 source option.
material3({ color: "#6750a4" });

// @ts-expect-error seedColor is not a Material 3 source option.
material3({ seedColor: "#6750a4" });

// @ts-expect-error primary is not a top-level source color fallback.
material3({ primary: "#6750a4" });

// @ts-expect-error style is not an alias for variant.
material3({ sourceColors: "#6750a4", style: "vibrant" });

// @ts-expect-error customColors is not an alias for extendedColors.
material3({ sourceColors: "#6750a4", customColors: [] });

// @ts-expect-error material3Source is not a public option.
material3({ sourceColors: "#6750a4", material3Source: true });

material3({
  sourceColors: "#6750a4",
  extendedColors: [
    {
      name: "success",
      color: "#2e7d32",
      // @ts-expect-error harmonize must be boolean when provided.
      harmonize: "yes",
    },
  ],
});

material3({
  sourceColors: "#6750a4",
  extendedColors: [
    {
      name: "success",
      // @ts-expect-error value is not a public extended color option.
      value: "#2e7d32",
    },
  ],
});

material3({
  sourceColors: "#6750a4",
  extendedColors: [
    {
      name: "success",
      color: "#2e7d32",
      // @ts-expect-error blend is not a public extended color option.
      blend: true,
    },
  ],
});
