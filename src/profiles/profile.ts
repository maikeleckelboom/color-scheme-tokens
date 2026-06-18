import type { ColorIntent } from "../core/colorIntent";
import type { ModeValues } from "../core/graph";
import type { TokenKey } from "../core/keys";
import type { TokenProvenance } from "../core/provenance";

export interface ProfileAliasToken {
  readonly kind: "alias";
  readonly key: TokenKey;
  readonly target: TokenKey | ModeValues<TokenKey>;
  readonly provenance?: TokenProvenance;
}

export interface ProfileColorToken {
  readonly kind: "color";
  readonly key: TokenKey;
  readonly values: ModeValues<ColorIntent>;
  readonly provenance?: TokenProvenance;
}

export type ProfileToken = ProfileAliasToken | ProfileColorToken;

export interface ColorSchemeProfile {
  readonly name: string;
  readonly tokens: readonly ProfileToken[];
}
