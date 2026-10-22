import { h } from "../lib/dom.js";

/** Badge globale: "Tutti i sistemi online (3/3)". */
export function StatusBadge() {
  const text = h("span", {}, "Verifica sistemi...");
  const root = h("div", { class: "status-badge checking", role: "status" }, [
    h("span", { class: "dot" }),
    text,
  ]);

  function update(online, total) {
    root.classList.remove("online", "warning", "offline", "checking");
    if (total > 0 && online === total) {
      root.classList.add("online");
      text.textContent = `Tutti i sistemi online (${online}/${total})`;
    } else if (online === 0) {
      root.classList.add("offline");
      text.textContent = `Sistemi offline (0/${total})`;
    } else {
      root.classList.add("warning");
      text.textContent = `Parzialmente online (${online}/${total})`;
    }
  }

  return { el: root, update };
}
