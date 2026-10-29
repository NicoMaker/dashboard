import { h, clear } from "../lib/dom.js";
import { ServiceCard } from "./ServiceCard.js";
import { t } from "../lib/settings.js";

export function ServiceGrid() {
  const el = h("main", { class: "grid", id: "servicesGrid" });
  let cards = [];

  function message(text, cls = "") {
    return h("p", { class: `grid__message ${cls}` }, text);
  }

  function setServices(services) {
    cards = services.map((s, i) => ServiceCard(s, i));
    render(() => true);
  }

  function render(predicate) {
    clear(el);
    if (!cards.length) {
      el.append(message(t("grid.empty")));
      return;
    }
    const visible = cards.filter((c) => predicate(c.service));
    if (!visible.length) {
      el.append(message(t("grid.noResults")));
      return;
    }
    visible.forEach((c) => el.append(c.el));
  }

  function applyFilter({ query, category }) {
    const q = query.trim().toLowerCase();
    render((s) => {
      const okCat =
        category === t("toolbar.allCategories") || s.category === category;
      const okText =
        !q ||
        `${s.name} ${s.description} ${s.category}`.toLowerCase().includes(q);
      return okCat && okText;
    });
  }

  function setStatuses(results) {
    const byId = new Map(results.map((r) => [r.id, r]));
    cards.forEach((c) => {
      const r = byId.get(c.id);
      if (r) c.setStatus(r);
    });
  }

  function setError(text) {
    clear(el);
    el.append(message(text, "is-error"));
  }

  return { el, setServices, applyFilter, setStatuses, setError };
}
