import { fetchServices, fetchStatus } from "./lib/api.js";
import { applyTheme, getTheme } from "./lib/theme.js";
import { loadSettings, t } from "./lib/settings.js";
import { Header } from "./components/Header.js";
import { Toolbar } from "./components/Toolbar.js";
import { ServiceGrid } from "./components/ServiceGrid.js";
import { Footer } from "./components/Footer.js";

await loadSettings();

const STATUS_REFRESH_MS = t("status.refreshMs") || 15000;

applyTheme(getTheme());

const header = Header({
  onThemeToggle: () =>
    applyTheme(
      document.documentElement.dataset.theme === "dark" ? "light" : "dark",
    ),
});
const grid = ServiceGrid();
const toolbar = Toolbar({ onChange: (f) => grid.applyFilter(f) });
const footer = Footer();

document
  .getElementById("app")
  .append(header.el, toolbar.el, grid.el, footer.el);

/** Ricarica la pagina a mezzanotte del 1° gennaio per aggiornare l'anno nel footer. */
function scheduleYearRefresh() {
  // NB: setTimeout accetta al massimo 2^31-1 ms (~24,8 giorni). Con un ritardo
  // maggiore scatta SUBITO -> reload in loop (la pagina "lampeggia" e non
  // mostra mai i dati). Per questo si controlla l'anno ogni minuto.
  const loadedYear = new Date().getFullYear();
  setInterval(() => {
    if (new Date().getFullYear() !== loadedYear) location.reload();
  }, 60_000);
}
scheduleYearRefresh();

async function refreshStatus() {
  try {
    const data = await fetchStatus();
    grid.setStatuses(data.services);
    const online = data.services.filter((s) => s.online).length;
    header.badge.update(online, data.services.length);
  } catch (err) {
    console.error("Errore check status:", err);
  }
}

async function init() {
  try {
    const services = await fetchServices();
    const categories = [...new Set(services.map((s) => s.category))].sort();
    toolbar.setCategories(categories);
    grid.setServices(services);
    refreshStatus();
  } catch (err) {
    grid.setError(t("grid.error", { message: err.message }));
  }
}

init();
setInterval(refreshStatus, STATUS_REFRESH_MS);
