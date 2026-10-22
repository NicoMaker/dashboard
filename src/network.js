const os = require("os");
const http = require("http");

function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) return net.address;
    }
  }
  return "127.0.0.1";
}

function getPublicIP() {
  return new Promise((resolve) => {
    const req = http.get("http://api.ipify.org", { timeout: 3000 }, (resp) => {
      let data = "";
      resp.on("data", (chunk) => (data += chunk));
      resp.on("end", () => resolve(data.trim() || "N/D"));
    });
    req.on("error", () => resolve("N/D"));
    req.on("timeout", () => {
      req.destroy();
      resolve("N/D");
    });
  });
}

module.exports = { getLocalIP, getPublicIP };
