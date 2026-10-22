import { fetchServices, fetchStatus } from "./lib/api.js";
import { applyTheme, getTheme } from "./lib/theme.js";
import { Header } from "./components/Header.js";
import { Toolbar } from "./components/Toolbar.js";
import { ServiceGrid } from "./components/ServiceGrid.js";
import { Footer } from "./components/Footer.js";

const STATUS_REFRESH_MS = 15000;

applyTheme(getTheme());

const header = Header({
  onThemeToggle: () =>
    applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"),
});
const grid = ServiceGrid();
const toolbar = Toolbar({ onChange: (f) => grid.applyFilter(f) });
const footer = Footer();

document.getElementById("app").append(header.el, toolbar.el, grid.el, footer.el);

async function refreshStatus() {
  try {
    const data = await fetchStatus();
    grid.setStatuses(data.services);
    const online = data.services.filter((s) => s.online).length;
    header.badge.update(online, data.services.length);
    footer.setUpdated(data.timestamp);
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
    grid.setError(`Errore caricamento servizi: ${err.message}`);
  }
}

init();
setInterval(refreshStatus, STATUS_REFRESH_MS);
