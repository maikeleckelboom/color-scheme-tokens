import type { SchemeRoleDefinition, SchemeRoleSet } from "../../core/schemeSource";
import { tokenKey } from "../../core/keys";

const REQUIRED_MATERIAL3_ROLE_NAMES = [
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

const OPTIONAL_MATERIAL3_ROLE_NAMES = [
  "primaryDim",
  "secondaryDim",
  "tertiaryDim",
  "errorDim",
] as const;

export const material3RoleSet: SchemeRoleSet = {
  sourceId: "material3",
  roles: [
    ...REQUIRED_MATERIAL3_ROLE_NAMES.map((role) => material3Role(role, true)),
    ...OPTIONAL_MATERIAL3_ROLE_NAMES.map((role) => material3Role(role, false)),
  ],
};

function material3Role(role: string, required: boolean): SchemeRoleDefinition {
  return {
    key: tokenKey(`m3.${role}`),
    sourceRole: role,
    required,
  };
}
