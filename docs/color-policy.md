# Color Policy

Core color values are concrete authored color data, not computed colors. Manual colors are a primary root-package
use case.

## Supported Core Spaces

- `srgb`
- `srgb-linear`
- `display-p3`
- `a98-rgb`
- `prophoto-rgb`
- `rec2020`
- `xyz-d65`
- `xyz-d50`
- `hsl`
- `hwb`
- `lab`
- `lch`
- `oklab`
- `oklch`

The parser accepts supported CSS strings and plain JSON-safe color objects. Core preserves authored coordinates in the
stored color space and validates these persisted domains:

- RGB-like spaces and XYZ spaces use `0..1` coordinates.
- `hsl` and `hwb` use hue in `[0, 360)` and percentage-like channels in `0..100`.
- `lab` uses lightness in `0..100`; `a` and `b` are finite unbounded numbers.
- `lch` uses lightness in `0..100`, non-negative chroma, and hue in `[0, 360)`.
- `oklab` uses lightness in `0..1`; `a` and `b` are finite unbounded numbers.
- `oklch` uses lightness in `0..1`, non-negative chroma, and hue in `[0, 360)`.

Core does not convert between color spaces and does not gamut-map.

High-gamut color is native token value capability, not a mode strategy. Do not model high gamut as fake modes such as
`light-p3` or `dark-p3`; real theme modes stay `light` and `dark`, and each token value may use any supported core color
space.

## CSS Formatting

`formatCssColor()` preserves the stored color space:

- byte-aligned opaque sRGB can serialize as hex;
- RGB-like and XYZ color spaces serialize with `color(...)`;
- HSL and HWB serialize percent-like components with `%`;
- Lab/LCH and OKLab/OKLCH serialize in their CSS-compatible component domains.

Any conversion, gamut mapping, perceptual difference, contrast repair, or dynamic palette generation belongs in a future
adapter or optional package. Future Texel behavior belongs in `@scheme-tokens/texel`, using the upstream
engine package `@texel/color` inside that adapter package only. Core must remain free of `@texel/color`, and gamut
mapping must never be silent.
