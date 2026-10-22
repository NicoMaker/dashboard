import { h } from "../lib/dom.js";
import { StatusBadge } from "./StatusBadge.js";

export function Header({ onThemeToggle }) {
  const badge = StatusBadge();
  const themeBtn = h(
    "button",
    {
      class: "icon-btn",
      type: "button",
      "aria-label": "Cambia tema",
      title: "Cambia tema chiaro/scuro",
      onClick: onThemeToggle,
    },
    "🌓",
  );

  const el = h("header", { class: "app-header" }, [
    h("div", { class: "app-header__top" }, [
      h("div", { class: "brand" }, [
        h("span", { class: "brand__logo" }, "🏛️"),
        h("div", {}, [
          h("h1", {}, "Control Center"),
          h("p", {}, "Gestionali dello studio commercialista"),
        ]),
      ]),
      themeBtn,
    ]),
    badge.el,
  ]);

  return { el, badge };
}
