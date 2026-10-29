import { h } from "../lib/dom.js";
import { t } from "../lib/settings.js";

export function Footer() {
  const updated = h("span", {}, "-");
  const el = h("footer", { class: "app-footer" }, [
    h("p", {}, t("footer.copyright", { year: new Date().getFullYear() })),
    h("p", { class: "app-footer__update" }, [t("footer.lastCheck"), updated]),
  ]);

  function setUpdated(iso) {
    updated.textContent = new Date(iso).toLocaleString("it-IT");
  }

  return { el, setUpdated };
}
