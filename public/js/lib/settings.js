/**
 * Impostazioni caricate da /api/ui (file in data/: ui.json, icons.json, theme.json).
 */
let S = { ui: {}, icons: {}, theme: {} };

export async function loadSettings() {
  const resp = await fetch("/api/ui", { cache: "no-store" });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  S = await resp.json();
  if (S.ui.title) document.title = S.ui.title;
  applyThemeVars(S.theme);
  applyFavicon(S.icons.favicon);
}

/** Testo da ui.json: t("card.open"), t("grid.error", { message }) */
export function t(path, vars = {}) {
  const raw = path.split(".").reduce((o, k) => o?.[k], S.ui) ?? "";
  return String(raw).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

export const icon = (name) => S.icons[name] ?? "";

function applyThemeVars(theme = {}) {
  const css = Object.entries(theme)
    .map(([mode, vars]) => {
      const sel =
        mode === "dark"
          ? ':root,:root[data-theme="dark"]'
          : `:root[data-theme="${mode}"]`;
      const body = Object.entries(vars)
        .map(([k, v]) => `${k}:${v}`)
        .join(";");
      return `${sel}{${body}}`;
    })
    .join("\n");
  const style = document.createElement("style");
  style.textContent = css;
  document.head.append(style);
}

function applyFavicon(emoji) {
  if (!emoji) return;
  const link = document.querySelector('link[rel="icon"]');
  if (link)
    link.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${emoji}</text></svg>`;
}
