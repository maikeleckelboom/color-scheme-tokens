# Development

Use the repository validation gates before release work or package-boundary changes:

```bash
pnpm install --frozen-lockfile
pnpm validate
pnpm release:check
git diff --check
```

`pnpm validate` runs the aggregate type, lint, test, build, filename, API, and formatting checks across the workspace.

`pnpm release:check` adds package-oriented checks: strict package validation, README example type-checking, packed
consumer smoke tests, adapter package release checks, adapter consumer smoke tests, and tarball content checks.

Publishing, tagging, and GitHub release creation are manual maintainer actions outside these validation scripts.
