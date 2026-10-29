import { h } from "../lib/dom.js";
import { t } from "../lib/settings.js";

export function Footer() {
  const el = h("footer", { class: "app-footer" }, [
    h("p", {}, t("footer.copyright", { year: new Date().getFullYear() })),
  ]);

  return { el };
}