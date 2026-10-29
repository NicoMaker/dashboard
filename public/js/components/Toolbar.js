import { h, clear } from "../lib/dom.js";
import { t, icon } from "../lib/settings.js";

/**
 * Barra con ricerca testuale e filtri per categoria.
 * onChange({ query, category })
 */
function searchIcon() {
  const el = h("span", { class: "search__icon" });
  el.innerHTML = icon("search");
  return el;
}

export function Toolbar({ onChange }) {
  const state = { query: "", category: t("toolbar.allCategories") };
  const chips = h("div", { class: "chips", role: "tablist" });

  const search = h("input", {
    class: "search__input",
    type: "search",
    placeholder: t("toolbar.searchPlaceholder"),
    "aria-label": t("toolbar.searchLabel"),
    onInput: (e) => {
      state.query = e.target.value;
      onChange({ ...state });
    },
  });

  function setCategories(categories) {
    clear(chips);
    [t("toolbar.allCategories"), ...categories].forEach((cat) => {
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
    h("label", { class: "search" }, [searchIcon(), search]),
    chips,
  ]);

  return { el, setCategories };
}
