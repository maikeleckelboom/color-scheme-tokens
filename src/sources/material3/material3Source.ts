import type { SrgbColor } from "../../core/colorValue";
import { createTokenGraph } from "../../core/createSourceGraph";
import type { Result } from "../../core/graph";
import type { SchemeSource } from "../../core/schemeSource";
import { createMaterial3Values, type Material3ValueProblem } from "./createMaterial3Values";
import { material3RoleSet } from "./material3RoleSet";

export type Material3AlgorithmVariant = "tonalSpot" | "vibrant" | "expressive" | "neutral";
export type Material3SpecVersion = "2021" | "2025";
export type Material3Platform = "phone" | "watch";

export interface Material3KeyColors {
  readonly primary?: SrgbColor;
  readonly secondary?: SrgbColor;
  readonly tertiary?: SrgbColor;
  readonly neutral?: SrgbColor;
  readonly neutralVariant?: SrgbColor;
}

export interface Material3AlgorithmOptions {
  readonly variant?: Material3AlgorithmVariant;
  readonly contrastLevel?: number;
  readonly specVersion?: Material3SpecVersion;
  readonly platform?: Material3Platform;
}

export interface Material3SourceOptions {
  readonly sourceColor: SrgbColor;
  readonly keyColors?: Material3KeyColors;
  readonly algorithm?: Material3AlgorithmOptions;
}

export interface Material3ResolvedAlgorithmOptions {
  readonly variant: Material3AlgorithmVariant;
  readonly contrastLevel: number;
  readonly specVersion: Material3SpecVersion;
  readonly platform: Material3Platform;
}

export interface Material3OptionProblem {
  readonly kind:
    | "unsupported-variant"
    | "invalid-contrast-level"
    | "unsupported-spec-version"
    | "unsupported-platform";
  readonly message: string;
  readonly sourceId?: string;
  readonly path?: string;
}

export type Material3SourceProblem = Material3ValueProblem | Material3OptionProblem;

export function material3Source(
  options: Material3SourceOptions,
): SchemeSource<Material3SourceProblem> {
  const resolvedAlgorithm = resolveAlgorithmOptions(options.algorithm);

  return {
    id: material3RoleSet.sourceId,
    roleSet: material3RoleSet,
    createGraph() {
      if (!resolvedAlgorithm.ok) return resolvedAlgorithm;
      const values = createMaterial3Values({
        sourceColor: options.sourceColor,
        algorithm: resolvedAlgorithm.value,
        ...(options.keyColors === undefined ? {} : { keyColors: options.keyColors }),
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

const material3AlgorithmDefaults: Material3ResolvedAlgorithmOptions = {
  specVersion: "2021",
  platform: "phone",
  contrastLevel: 0,
  variant: "tonalSpot",
};

function resolveAlgorithmOptions(
  options: Material3AlgorithmOptions = {},
): Result<Material3ResolvedAlgorithmOptions, Material3OptionProblem> {
  const problems: Material3OptionProblem[] = [];
  const variant = options.variant ?? material3AlgorithmDefaults.variant;
  const specVersion = options.specVersion ?? material3AlgorithmDefaults.specVersion;
  const platform = options.platform ?? material3AlgorithmDefaults.platform;
  const contrastLevel = options.contrastLevel ?? material3AlgorithmDefaults.contrastLevel;

  if (!["tonalSpot", "vibrant", "expressive", "neutral"].includes(variant)) {
    problems.push({
      kind: "unsupported-variant",
      message: `Unsupported Material 3 algorithm variant: ${String(variant)}.`,
      sourceId: material3RoleSet.sourceId,
      path: "algorithm.variant",
    });
  }

  if (!Number.isFinite(contrastLevel) || contrastLevel < -1 || contrastLevel > 1) {
    problems.push({
      kind: "invalid-contrast-level",
      message: "contrastLevel must be a finite number between -1 and 1.",
      sourceId: material3RoleSet.sourceId,
      path: "algorithm.contrastLevel",
    });
  }

  if (!["2021", "2025"].includes(specVersion)) {
    problems.push({
      kind: "unsupported-spec-version",
      message: `Unsupported Material 3 spec version: ${String(specVersion)}.`,
      sourceId: material3RoleSet.sourceId,
      path: "algorithm.specVersion",
    });
  }

  if (!["phone", "watch"].includes(platform)) {
    problems.push({
      kind: "unsupported-platform",
      message: `Unsupported Material 3 platform: ${String(platform)}.`,
      sourceId: material3RoleSet.sourceId,
      path: "algorithm.platform",
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
