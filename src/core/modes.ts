import type { Result } from "./graph";

declare const modeKeyBrand: unique symbol;

export type ModeKey<Name extends string = string> = Name & {
  readonly [modeKeyBrand]: true;
};

export type ModeKeyInput<Name extends string = string> = Name;

export interface ModeParseProblem {
  readonly code: "invalid-mode-key";
  readonly message: string;
  readonly input: string;
}

export type ModeKeyProblem = ModeParseProblem;

export type ModeKeyResult<Name extends string = string> = Result<ModeKey<Name>, ModeKeyProblem>;

const MODE_KEY_PATTERN = /^[a-z][A-Za-z0-9]*$/;

export function parseModeKey<const Name extends string>(input: Name): ModeKeyResult<Name> {
  if (isValidModeKeyInput(input)) {
    return { ok: true, value: input as ModeKey<Name> };
  }

  return {
    ok: false,
    problems: [
      {
        code: "invalid-mode-key",
        input,
        message: "Mode keys must be non-empty identifiers.",
      },
    ],
  };
}

export function isModeKey(input: string): input is ModeKey {
  return isValidModeKeyInput(input);
}

function isValidModeKeyInput(input: string): boolean {
  return MODE_KEY_PATTERN.test(input);
}

/**
 * Low-level assertion helper for trusted literals. User-authored graph data
 * should pass plain strings to validateGraph/compileGraph instead.
 */
export function modeKey(input: string): ModeKey {
  const result = parseModeKey(input);
  if (result.ok) return result.value;
  throw new Error(result.problems[0]?.message ?? "Invalid mode key.");
}

export const lightMode = "light";
export const darkMode = "dark";
