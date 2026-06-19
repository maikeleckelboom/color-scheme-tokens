import { DynamicScheme, Hct, TonalPalette, Variant } from "@material/material-color-utilities";
import type { Material3KeyColorArgbs } from "../createMaterial3Values";
import type {
  Material3AlgorithmVariant,
  Material3Platform,
  Material3SpecVersion,
} from "../material3Source";

interface DynamicSchemeLike {
  readonly colors: object;
  getArgb(dynamicColor: unknown): number;
}

const material3Variants: Record<Material3AlgorithmVariant, Variant> = {
  tonalSpot: Variant.TONAL_SPOT,
  vibrant: Variant.VIBRANT,
  expressive: Variant.EXPRESSIVE,
  neutral: Variant.NEUTRAL,
};

export function createMaterialBackedScheme(options: {
  readonly sourceColorArgb: number;
  readonly keyColorArgbs?: Material3KeyColorArgbs;
  readonly isDark: boolean;
  readonly contrastLevel: number;
  readonly specVersion: Material3SpecVersion;
  readonly platform: Material3Platform;
  readonly variant: Material3AlgorithmVariant;
}): DynamicSchemeLike {
  return new DynamicScheme({
    sourceColorHct: Hct.fromInt(options.sourceColorArgb),
    variant: material3Variants[options.variant],
    contrastLevel: options.contrastLevel,
    isDark: options.isDark,
    specVersion: options.specVersion,
    platform: options.platform,
    ...createPaletteOverrides(options.keyColorArgbs),
  });
}

export function readSchemeRoleArgb(
  material3DynamicScheme: DynamicSchemeLike,
  role: string,
): number | undefined {
  const colors = material3DynamicScheme.colors as Record<string, () => unknown>;
  const colorFactory = colors[role];
  if (typeof colorFactory !== "function") return undefined;

  const dynamicColor = colorFactory.call(colors);
  if (dynamicColor === undefined) return undefined;

  return material3DynamicScheme.getArgb(dynamicColor);
}

function createPaletteOverrides(keyColorArgbs: Material3KeyColorArgbs | undefined): {
  readonly primaryPalette?: TonalPalette;
  readonly secondaryPalette?: TonalPalette;
  readonly tertiaryPalette?: TonalPalette;
  readonly neutralPalette?: TonalPalette;
  readonly neutralVariantPalette?: TonalPalette;
} {
  return {
    ...(keyColorArgbs?.primary === undefined
      ? {}
      : { primaryPalette: TonalPalette.fromInt(keyColorArgbs.primary) }),
    ...(keyColorArgbs?.secondary === undefined
      ? {}
      : { secondaryPalette: TonalPalette.fromInt(keyColorArgbs.secondary) }),
    ...(keyColorArgbs?.tertiary === undefined
      ? {}
      : { tertiaryPalette: TonalPalette.fromInt(keyColorArgbs.tertiary) }),
    ...(keyColorArgbs?.neutral === undefined
      ? {}
      : { neutralPalette: TonalPalette.fromInt(keyColorArgbs.neutral) }),
    ...(keyColorArgbs?.neutralVariant === undefined
      ? {}
      : { neutralVariantPalette: TonalPalette.fromInt(keyColorArgbs.neutralVariant) }),
  };
}
