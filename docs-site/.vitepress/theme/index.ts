import DefaultTheme from "vitepress/theme";
import TwoslashFloatingVue from "@shikijs/vitepress-twoslash/client";
import "@shikijs/vitepress-twoslash/style.css";
import "./style.css";

export default {
  extends: DefaultTheme,
  enhanceApp(context) {
    DefaultTheme.enhanceApp?.(context);
    context.app.use(TwoslashFloatingVue);
  },
} satisfies typeof DefaultTheme;
