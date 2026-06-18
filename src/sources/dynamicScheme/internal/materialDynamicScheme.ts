import {
  Hct,
  SchemeExpressive,
  SchemeNeutral,
  SchemeTonalSpot,
  SchemeVibrant,
} from "@material/material-color-utilities";
import type {
  DynamicSchemePlatform,
  DynamicSchemeSpecVersion,
  DynamicSchemeVariant,
} from "../dynamicSchemeSource";

interface DynamicSchemeLike {
  readonly colors: object;
  getArgb(dynamicColor: unknown): number;
}

type DynamicSchemeConstructor = new (
  sourceColorHct: Hct,
  isDark: boolean,
  contrastLevel: number,
  specVersion?: DynamicSchemeSpecVersion,
  platform?: DynamicSchemePlatform,
) => DynamicSchemeLike;

const variantConstructors: Record<DynamicSchemeVariant, DynamicSchemeConstructor> = {
  tonal: SchemeTonalSpot as unknown as DynamicSchemeConstructor,
  vibrant: SchemeVibrant as unknown as DynamicSchemeConstructor,
  expressive: SchemeExpressive as unknown as DynamicSchemeConstructor,
  neutral: SchemeNeutral as unknown as DynamicSchemeConstructor,
};

export function createMaterialBackedScheme(options: {
  readonly sourceColorArgb: number;
  readonly isDark: boolean;
  readonly contrastLevel: number;
  readonly specVersion: DynamicSchemeSpecVersion;
  readonly platform: DynamicSchemePlatform;
  readonly variant: DynamicSchemeVariant;
}): DynamicSchemeLike {
  const SchemeConstructor = variantConstructors[options.variant];
  return new SchemeConstructor(
    Hct.fromInt(options.sourceColorArgb),
    options.isDark,
    options.contrastLevel,
    options.specVersion,
    options.platform,
  );
}

export function readSchemeRoleArgb(scheme: DynamicSchemeLike, role: string): number | undefined {
  const colors = scheme.colors as Record<string, () => unknown>;
  const colorFactory = colors[role];
  if (typeof colorFactory !== "function") return undefined;

  const dynamicColor = colorFactory.call(colors);
  if (dynamicColor === undefined) return undefined;

  return scheme.getArgb(dynamicColor);
}
