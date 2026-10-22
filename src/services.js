const fs = require("fs");
const { SERVICES_FILE } = require("./config");

let cache = null;
let cachedMtime = 0;

/**
 * Ogni servizio può avere:
 *  - "url": "http://..."                      (un solo accesso)
 *  - "urls": [{ "label": "...", "url": "..." }] (più accessi, es. porte diverse)
 * Normalizza tutto in service.links = [{ label, url }].
 */
function normalize(service) {
  let links = [];
  if (Array.isArray(service.urls) && service.urls.length) {
    links = service.urls
      .map((u) => (typeof u === "string" ? { url: u } : u))
      .filter((u) => u && u.url)
      .map((u, i) => ({ label: u.label || `Accesso ${i + 1}`, url: u.url }));
  } else if (service.url) {
    links = [{ label: "Apri", url: service.url }];
  }
  return { ...service, links };
}

/**
 * Carica services.json con cache basata su mtime (hot-reload:
 * modificando il file non serve riavviare il server).
 */
function loadServices() {
  try {
    const stat = fs.statSync(SERVICES_FILE);
    if (cache && stat.mtimeMs === cachedMtime) return cache;

    const parsed = JSON.parse(fs.readFileSync(SERVICES_FILE, "utf-8"));
    if (!Array.isArray(parsed)) {
      throw new Error("services.json deve contenere un array");
    }
    cache = parsed.map(normalize);
    cachedMtime = stat.mtimeMs;
    console.log(`📥 services.json caricato (${cache.length} servizi)`);
    return cache;
  } catch (err) {
    console.error(`❌ Errore lettura services.json: ${err.message}`);
    return cache || [];
  }
}

/** Solo i campi che il frontend deve conoscere. */
function publicServices() {
  return loadServices().map(
    ({ id, name, links, icon, color, description, category }) => ({
      id,
      name,
      links,
      icon,
      color,
      description,
      category: category || "Altro",
    }),
  );
}

module.exports = { loadServices, publicServices };
