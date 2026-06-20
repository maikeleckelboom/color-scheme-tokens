# Material Color Utilities Vendor Snapshot

This directory contains a copied TypeScript snapshot from the official Material Color Utilities repository.

- Upstream repository: https://github.com/material-foundation/material-color-utilities
- Upstream commit: `6fd88eb3e95ba1d457842e2a2bf847d06b3a018a`
- Copied surface: HCT, tonal palettes, harmonization, contrast, dynamic color, dynamic scheme variants including CMF, spec
  delegates, platform support, and string/color utilities used by `@scheme-tokens/material3`.
- Reason for vendoring: the published npm package does not yet expose the official main-branch Material 3 surface needed
  by this adapter, including official multi-source generation, the 2026 spec, CMF variant, and CMF scheme.

Do not edit vendored files by hand. Keep upstream Apache-2.0 license headers intact.

To refresh the snapshot:

1. Choose and record the upstream commit.
2. Replace only the copied surface needed by `@scheme-tokens/material3`.
3. Preserve upstream file headers and Apache-2.0 provenance.
4. Update `MATERIAL3_ENGINE_VERSION` in `packages/material3/src/material3-engine.ts`.
5. Update `packages/material3/NOTICE.md` and this README with the new commit and copied surface.
6. Re-run formatting only outside this vendor directory.
7. Run `pnpm install --frozen-lockfile`, `pnpm validate`, `pnpm release:check`,
   `pnpm -C packages/material3 release:check`, and `git diff --check`.

Vendored internals must remain private implementation details. Do not export this directory or its types from
`@scheme-tokens/material3`.
