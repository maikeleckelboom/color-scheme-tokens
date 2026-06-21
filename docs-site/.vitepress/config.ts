import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
import { createFileSystemTypesCache } from "@shikijs/vitepress-twoslash/cache-fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitepress";

const configDirectory = dirname(fileURLToPath(import.meta.url));
const twoslashCacheDirectory = join(configDirectory, "cache", "twoslash");

export default defineConfig({
  title: "scheme-tokens",
  description:
    "Own color token names, compile selected schemes, and export deterministic CSS variables.",
  lang: "en-US",
  cleanUrls: true,
  lastUpdated: false,
  markdown: {
    codeTransformers: [
      transformerTwoslash({
        explicitTrigger: true,
        throws: true,
        typesCache: createFileSystemTypesCache({
          dir: twoslashCacheDirectory,
        }),
      }),
    ],
  },
  head: [
    [
      "meta",
      {
        name: "theme-color",
        content: "#101820",
      },
    ],
    [
      "meta",
      {
        property: "og:type",
        content: "website",
      },
    ],
    [
      "meta",
      {
        property: "og:title",
        content: "scheme-tokens",
      },
    ],
    [
      "meta",
      {
        property: "og:description",
        content:
          "Stable color token contracts, selected scheme compilation, and deterministic CSS variable export.",
      },
    ],
  ],
  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Recipes", link: "/recipes/" },
      { text: "API", link: "/reference/api" },
      { text: "Schemas", link: "/reference/schemas" },
    ],
    sidebar: [
      {
        text: "Start",
        items: [
          { text: "Overview", link: "/" },
          { text: "Getting Started", link: "/guide/getting-started" },
          { text: "Light and Dark", link: "/guide/light-dark" },
        ],
      },
      {
        text: "Guides",
        items: [
          { text: "Material 3", link: "/guide/material-3" },
          { text: "Tailwind", link: "/guide/tailwind" },
          { text: "Persisted Artifacts", link: "/guide/persisted-artifacts" },
          { text: "Errors", link: "/guide/errors" },
        ],
      },
      {
        text: "Recipes",
        items: [{ text: "Recipe Index", link: "/recipes/" }],
      },
      {
        text: "Reference",
        items: [
          { text: "API", link: "/reference/api" },
          { text: "Schemas", link: "/reference/schemas" },
        ],
      },
      {
        text: "Concepts",
        items: [
          { text: "Model", link: "/concepts/model" },
          { text: "Adapters", link: "/concepts/adapters" },
        ],
      },
    ],
    search: {
      provider: "local",
    },
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/maikeleckelboom/scheme-tokens",
      },
    ],
    footer: {
      message: "Released under the MIT license.",
      copyright: "Copyright Maikel Eckelboom",
    },
  },
});
