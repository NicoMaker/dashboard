import { t } from "./settings.js";

const key = () => t("theme.storageKey") || "cc-theme";

export function getTheme() {
  try {
    const saved = localStorage.getItem(key());
    if (saved === "light" || saved === "dark") return saved;
  } catch {}
  return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(key(), theme);
  } catch {}
}
