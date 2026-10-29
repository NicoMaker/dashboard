const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");

function readServer() {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, "server.json"), "utf-8"),
    );
  } catch {
    return {};
  }
}
const server = readServer();

// Compatibilità: se esiste ancora il vecchio services.json nella root e non
// ce n'è uno in data/, viene usato quello.
const dataServices = path.join(DATA_DIR, "services.json");
const legacyServices = path.join(ROOT, "services.json");

module.exports = {
  PORT: Number(process.env.PORT) || server.port || 8080,
  DATA_DIR,
  SERVICES_FILE:
    !fs.existsSync(dataServices) && fs.existsSync(legacyServices)
      ? legacyServices
      : dataServices,
  PUBLIC_DIR: path.join(ROOT, "public"),
  CHECK_TIMEOUT_MS: server.checkTimeoutMs || 3000,
};
