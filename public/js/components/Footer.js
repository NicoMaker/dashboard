import { h } from "../lib/dom.js";

export function Footer() {
  const updated = h("span", {}, "-");
  const el = h("footer", { class: "app-footer" }, [
    h(
      "p",
      {},
      `© ${new Date().getFullYear()} Control Center Studio Commercialisti`,
    ),
    h("p", { class: "app-footer__update" }, [
      "Ultimo aggiornamento: ",
      updated,
    ]),
  ]);

  function setUpdated(iso) {
    updated.textContent = new Date(iso).toLocaleString("it-IT");
  }

  return { el, setUpdated };
}
