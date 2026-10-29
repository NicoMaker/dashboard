import { h } from "../lib/dom.js";
import { t, icon } from "../lib/settings.js";
import { StatusBadge } from "./StatusBadge.js";

export function Header({ onThemeToggle }) {
  const badge = StatusBadge();
  const themeBtn = h("button", {
    class: "icon-btn",
    type: "button",
    "aria-label": t("theme.label"),
    title: t("theme.tooltip"),
    onClick: onThemeToggle,
  });
  themeBtn.innerHTML = icon("themeSun") + icon("themeMoon");

  const el = h("header", { class: "app-header" }, [
    h("div", { class: "app-header__top" }, [
      h("div", { class: "brand" }, [
        h("span", { class: "brand__logo" }, icon("logo")),
        h("div", {}, [
          h("h1", {}, t("brand.name")),
          h("p", {}, t("brand.tagline")),
        ]),
      ]),
      themeBtn,
    ]),
    badge.el,
  ]);

  return { el, badge };
}
