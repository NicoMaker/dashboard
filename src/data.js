const fs = require("fs");
const path = require("path");
const { DATA_DIR } = require("./config");

const cache = new Map();

/** Legge data/<name> con cache su mtime (hot-reload: nessun riavvio). */
function readData(name, fallback = {}) {
  const file = path.join(DATA_DIR, name);
  try {
    const { mtimeMs } = fs.statSync(file);
    const hit = cache.get(file);
    if (hit && hit.mtimeMs === mtimeMs) return hit.value;
    const value = JSON.parse(fs.readFileSync(file, "utf-8"));
    cache.set(file, { mtimeMs, value });
    return value;
  } catch (err) {
    console.error(`❌ Errore lettura data/${name}: ${err.message}`);
    return fallback;
  }
}

module.exports = { readData };
