const express = require("express");
const { loadServices, publicServices } = require("../services");
const { checkAll } = require("../status");

const router = express.Router();

router.get("/services", (req, res) => {
  res.json(publicServices());
});

router.get("/status", async (req, res) => {
  const services = await checkAll(loadServices());
  res.json({ timestamp: new Date().toISOString(), services });
});

router.get("/health", (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

module.exports = router;
