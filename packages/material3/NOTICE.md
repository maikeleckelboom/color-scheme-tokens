# Third-Party Notices

`@scheme-tokens/material3` vendors a minimal TypeScript snapshot from the official Material Color Utilities repository
and bundles that code into its generated runtime artifact. This keeps the adapter aligned with upstream Material 3
dynamic scheme behavior that is present on main but not yet available in the published npm package.

## material-foundation/material-color-utilities

- Repository: https://github.com/material-foundation/material-color-utilities
- Upstream commit: `6fd88eb3e95ba1d457842e2a2bf847d06b3a018a`
- Copied surface: TypeScript HCT, tonal palettes, harmonization, contrast, dynamic color, dynamic scheme variants
  including CMF, spec delegates, platform support, and string/color utilities required by `@scheme-tokens/material3`.
- License: Apache License, Version 2.0
- Copyright: Google LLC, as stated in the copied file headers.

Apache-2.0 license headers are preserved in each copied file under
`src/vendor/material-color-utilities`. The vendored internals are not exported from `@scheme-tokens/material3`.
