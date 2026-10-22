const app = require("./src/app");
const { PORT, SERVICES_FILE } = require("./src/config");
const { loadServices } = require("./src/services");
const { getLocalIP, getPublicIP } = require("./src/network");

// Carica subito all'avvio (per validare il file)
loadServices();

const server = app.listen(PORT, "0.0.0.0", async () => {
  const localIP = getLocalIP();
  const publicIP = await getPublicIP();
  const services = loadServices();

  console.log(`\n🚀 Server avviato con successo!`);
  console.log(`🌐 IP Pubblico: http://${publicIP}:${PORT}`);
  console.log(`🏠 IP Locale:   http://${localIP}:${PORT}`);
  console.log(`📍 Localhost:   http://localhost:${PORT}`);
  console.log(`\n--------------------------------------`);
  console.log(`📋 Servizi configurati (${services.length}):`);
  services.forEach((s) =>
    console.log(`   ${s.icon || "•"} ${s.name} → ${s.url}`),
  );
  console.log(`📄 Config: ${SERVICES_FILE}`);
  console.log(`🔥 Hot-reload attivo (modifica services.json senza riavviare)`);
  console.log(`--------------------------------------\n`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n❌ Porta ${PORT} già in uso!`);
    console.error(`💡 Cambia porta: PORT=8090 npm start\n`);
  } else {
    console.error("❌ Errore server:", err);
  }
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("\n\n👋 Server in chiusura...");
  server.close(() => process.exit(0));
});

process.on("uncaughtException", (err) =>
  console.error("💥 Eccezione non gestita:", err),
);
process.on("unhandledRejection", (err) =>
  console.error("💥 Promise non gestita:", err),
);
