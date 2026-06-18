import type { SrgbColor } from "../../core/colorValue";
import { createTokenGraph } from "../../core/createSchemeGraph";
import type { Result } from "../../core/graph";
import type { SchemeSource } from "../../core/schemeSource";
import {
  createDynamicSchemeValues,
  type DynamicSchemeValueProblem,
} from "./createDynamicSchemeValues";
import { dynamicColorRoleSet } from "./dynamicColorRoleSet";

export type DynamicSchemeVariant = "tonal" | "vibrant" | "expressive" | "neutral";
export type DynamicSchemeSpecVersion = "2021" | "2025";
export type DynamicSchemePlatform = "phone" | "watch";

export interface DynamicSchemeSourceOptions {
  readonly sourceColor: SrgbColor;
  readonly variant?: DynamicSchemeVariant;
  readonly contrastLevel?: number;
}

export interface DynamicSchemeResolvedOptions {
  readonly variant: DynamicSchemeVariant;
  readonly contrastLevel: number;
  readonly specVersion: DynamicSchemeSpecVersion;
  readonly platform: DynamicSchemePlatform;
}

export interface DynamicSchemeOptionProblem {
  readonly kind: "unsupported-variant" | "invalid-contrast-level";
  readonly message: string;
  readonly sourceId?: string;
  readonly path?: string;
}

export type DynamicSchemeSourceProblem = DynamicSchemeValueProblem | DynamicSchemeOptionProblem;

export function dynamicSchemeSource(
  options: DynamicSchemeSourceOptions,
): SchemeSource<DynamicSchemeSourceProblem> {
  const resolved = resolveOptions(options);

  return {
    id: "dynamic-scheme",
    roleSet: dynamicColorRoleSet,
    createGraph() {
      if (!resolved.ok) return resolved;
      const values = createDynamicSchemeValues({
        sourceColor: options.sourceColor,
        resolvedOptions: resolved.value,
      });

      if (!values.ok) return values;

      return {
        ok: true,
        value: createTokenGraph({
          tokens: values.value,
        }),
      };
    },
  };
}

const dynamicSchemeSourceDefaults: DynamicSchemeResolvedOptions = {
  specVersion: "2021",
  platform: "phone",
  contrastLevel: 0,
  variant: "tonal",
};

function resolveOptions(
  options: DynamicSchemeSourceOptions,
): Result<DynamicSchemeResolvedOptions, DynamicSchemeOptionProblem> {
  const problems: DynamicSchemeOptionProblem[] = [];
  const variant = options.variant ?? dynamicSchemeSourceDefaults.variant;
  const specVersion = dynamicSchemeSourceDefaults.specVersion;
  const platform = dynamicSchemeSourceDefaults.platform;
  const contrastLevel = options.contrastLevel ?? dynamicSchemeSourceDefaults.contrastLevel;

  if (!["tonal", "vibrant", "expressive", "neutral"].includes(variant)) {
    problems.push({
      kind: "unsupported-variant",
      message: `Unsupported dynamic scheme variant: ${String(variant)}.`,
      sourceId: dynamicColorRoleSet.sourceId,
      path: "variant",
    });
  }

  if (!Number.isFinite(contrastLevel) || contrastLevel < -1 || contrastLevel > 1) {
    problems.push({
      kind: "invalid-contrast-level",
      message: "contrastLevel must be a finite number between -1 and 1.",
      sourceId: dynamicColorRoleSet.sourceId,
      path: "contrastLevel",
    });
  }

  if (problems.length > 0) return { ok: false, problems };

  return {
    ok: true,
    value: {
      variant,
      specVersion,
      platform,
      contrastLevel,
    },
  };
}
