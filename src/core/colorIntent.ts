import type { ColorValue } from "./colorValue";
import { validateColorValue, type ColorValueProblem } from "./colorValue";

export interface SolidColorIntent {
  readonly kind: "solid";
  readonly value: ColorValue;
}

export type ColorIntent = SolidColorIntent;

export interface ColorIntentProblem {
  readonly kind: "invalid-color-intent" | ColorValueProblem["kind"];
  readonly message: string;
  readonly path?: string;
}

export function solidColorIntent(value: ColorValue): SolidColorIntent {
  return { kind: "solid", value };
}

export function resolveColorIntent(intent: ColorIntent): ColorValue {
  return intent.value;
}

export function validateColorIntent(
  intent: ColorIntent,
  path?: string,
): readonly ColorIntentProblem[] {
  if (intent.kind !== "solid") {
    return [
      {
        kind: "invalid-color-intent",
        message: `${path ?? "colorIntent"}.kind must be solid.`,
        ...(path === undefined ? {} : { path: `${path}.kind` }),
      },
    ];
  }

  return validateColorValue(intent.value, `${path ?? "colorIntent"}.value`);
}
