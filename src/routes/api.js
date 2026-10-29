const express = require("express");
const { loadServices, publicServices } = require("../services");
const { checkAll } = require("../status");
const { readData } = require("../data");

const router = express.Router();

router.get("/services", (req, res) => {
  res.json(publicServices());
});

router.get("/ui", (req, res) => {
  res.json({
    ui: readData("ui.json"),
    icons: readData("icons.json"),
    theme: readData("theme.json"),
  });
});

router.get("/status", async (req, res) => {
  const services = await checkAll(loadServices());
  res.json({ timestamp: new Date().toISOString(), services });
});

router.get("/health", (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

module.exports = router;
