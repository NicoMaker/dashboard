const express = require("express");
const path = require("path");
const { PUBLIC_DIR } = require("./config");
const apiRoutes = require("./routes/api");

const app = express();

app.use(express.json());
app.use("/api", apiRoutes);
app.use(express.static(PUBLIC_DIR));

// Fallback SPA (solo per richieste non-API)
app.get("*", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

module.exports = app;
