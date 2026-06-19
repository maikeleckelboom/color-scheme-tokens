import type { Result } from "./graph";

declare const tokenKeyBrand: unique symbol;

export type TokenKey<Name extends string = string> = Name & {
  readonly [tokenKeyBrand]: true;
};

export type TokenKeyInput<Name extends string = string> = Name;

export interface KeyParseProblem {
  readonly code: "invalid-token-key";
  readonly message: string;
  readonly input: string;
}

export type TokenKeyProblem = KeyParseProblem;

export type TokenKeyResult<Name extends string = string> = Result<TokenKey<Name>, TokenKeyProblem>;

const TOKEN_SEGMENT_PATTERN = /^[a-z][A-Za-z0-9]*$/;

export function parseTokenKey<const Name extends string>(input: Name): TokenKeyResult<Name> {
  if (isValidTokenKeyInput(input)) {
    return { ok: true, value: input as TokenKey<Name> };
  }

  return {
    ok: false,
    problems: [
      {
        code: "invalid-token-key",
        input,
        message: "Token keys must contain at least two dot-separated non-empty segments.",
      },
    ],
  };
}

export function isTokenKey(input: string): input is TokenKey {
  return isValidTokenKeyInput(input);
}

function isValidTokenKeyInput(input: string): boolean {
  const segments = input.split(".");
  return (
    input.length > 0 &&
    segments.length >= 2 &&
    segments.every((segment) => TOKEN_SEGMENT_PATTERN.test(segment))
  );
}

/**
 * Low-level assertion helper for trusted literals. User-authored graph data
 * should pass plain strings to validateGraph/compileGraph instead.
 */
export function tokenKey(input: string): TokenKey {
  const result = parseTokenKey(input);
  if (result.ok) return result.value;
  throw new Error(result.problems[0]?.message ?? "Invalid token key.");
}
