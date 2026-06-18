import type { SchemeRoleDefinition, SchemeRoleSet } from "../../core/schemeSource";
import { tokenKey } from "../../core/keys";

const REQUIRED_DYNAMIC_ROLE_NAMES = [
  "primaryPaletteKeyColor",
  "secondaryPaletteKeyColor",
  "tertiaryPaletteKeyColor",
  "neutralPaletteKeyColor",
  "neutralVariantPaletteKeyColor",
  "errorPaletteKeyColor",
  "background",
  "onBackground",
  "surface",
  "surfaceDim",
  "surfaceBright",
  "surfaceContainerLowest",
  "surfaceContainerLow",
  "surfaceContainer",
  "surfaceContainerHigh",
  "surfaceContainerHighest",
  "onSurface",
  "surfaceVariant",
  "onSurfaceVariant",
  "inverseSurface",
  "inverseOnSurface",
  "outline",
  "outlineVariant",
  "shadow",
  "scrim",
  "surfaceTint",
  "primary",
  "onPrimary",
  "primaryContainer",
  "onPrimaryContainer",
  "inversePrimary",
  "secondary",
  "onSecondary",
  "secondaryContainer",
  "onSecondaryContainer",
  "tertiary",
  "onTertiary",
  "tertiaryContainer",
  "onTertiaryContainer",
  "error",
  "onError",
  "errorContainer",
  "onErrorContainer",
  "primaryFixed",
  "primaryFixedDim",
  "onPrimaryFixed",
  "onPrimaryFixedVariant",
  "secondaryFixed",
  "secondaryFixedDim",
  "onSecondaryFixed",
  "onSecondaryFixedVariant",
  "tertiaryFixed",
  "tertiaryFixedDim",
  "onTertiaryFixed",
  "onTertiaryFixedVariant",
] as const;

const OPTIONAL_DYNAMIC_ROLE_NAMES = [
  "primaryDim",
  "secondaryDim",
  "tertiaryDim",
  "errorDim",
] as const;

export const dynamicColorRoleSet: SchemeRoleSet = {
  sourceId: "dynamic-scheme",
  roles: [
    ...REQUIRED_DYNAMIC_ROLE_NAMES.map((role) => dynamicRole(role, true)),
    ...OPTIONAL_DYNAMIC_ROLE_NAMES.map((role) => dynamicRole(role, false)),
  ],
};

function dynamicRole(role: string, required: boolean): SchemeRoleDefinition {
  return {
    key: tokenKey(`scheme.${role}`),
    sourceRole: role,
    required,
  };
}
