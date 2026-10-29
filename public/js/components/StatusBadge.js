import { h } from "../lib/dom.js";
import { t } from "../lib/settings.js";

export function StatusBadge() {
  const text = h("span", {}, t("status.badge.checking"));
  const root = h("div", { class: "status-badge checking", role: "status" }, [
    h("span", { class: "dot" }),
    text,
  ]);

  function update(online, total) {
    root.classList.remove("online", "warning", "offline", "checking");
    const vars = { online, total };
    if (total > 0 && online === total) {
      root.classList.add("online");
      text.textContent = t("status.badge.allOnline", vars);
    } else if (online === 0) {
      root.classList.add("offline");
      text.textContent = t("status.badge.allOffline", vars);
    } else {
      root.classList.add("warning");
      text.textContent = t("status.badge.partial", vars);
    }
  }

  return { el: root, update };
}
