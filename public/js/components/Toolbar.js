import { h, clear } from "../lib/dom.js";

/**
 * Barra con ricerca testuale e filtri per categoria.
 * onChange({ query, category })
 */
export function Toolbar({ onChange }) {
  const state = { query: "", category: "Tutti" };
  const chips = h("div", { class: "chips", role: "tablist" });

  const search = h("input", {
    class: "search__input",
    type: "search",
    placeholder: "Cerca un gestionale…",
    "aria-label": "Cerca un gestionale",
    onInput: (e) => {
      state.query = e.target.value;
      onChange({ ...state });
    },
  });

  function setCategories(categories) {
    clear(chips);
    ["Tutti", ...categories].forEach((cat) => {
      chips.append(
        h(
          "button",
          {
            type: "button",
            role: "tab",
            class: "chip" + (cat === state.category ? " is-active" : ""),
            onClick: () => {
              state.category = cat;
              setCategories(categories);
              onChange({ ...state });
            },
          },
          cat,
        ),
      );
    });
  }

  const el = h("div", { class: "toolbar" }, [
    h("label", { class: "search" }, [
      h("span", { class: "search__icon" }, "🔍"),
      search,
    ]),
    chips,
  ]);

  return { el, setCategories };
}
