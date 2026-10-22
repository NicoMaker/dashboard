const path = require("path");

const ROOT = path.join(__dirname, "..");

module.exports = {
  PORT: Number(process.env.PORT) || 8080,
  SERVICES_FILE: path.join(ROOT, "services.json"),
  PUBLIC_DIR: path.join(ROOT, "public"),
  CHECK_TIMEOUT_MS: 3000,
};
