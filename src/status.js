const http = require("http");
const https = require("https");
const { CHECK_TIMEOUT_MS } = require("./config");

/** Verifica se un URL risponde; misura anche la latenza. */
function checkUrl(targetUrl, timeout = CHECK_TIMEOUT_MS) {
  return new Promise((resolve) => {
    let url;
    try {
      url = new URL(targetUrl);
    } catch {
      return resolve({ online: false, status: "invalid", latency: null });
    }

    const started = Date.now();
    const client = url.protocol === "https:" ? https : http;
    const req = client.request(
      {
        hostname: url.hostname,
        port: url.port || (url.protocol === "https:" ? 443 : 80),
        path: (url.pathname || "/") + url.search,
        method: "GET",
        timeout,
      },
      (resp) => {
        resp.resume();
        resolve({
          online: resp.statusCode >= 200 && resp.statusCode < 500,
          status: resp.statusCode,
          latency: Date.now() - started,
        });
      },
    );
    req.on("timeout", () => {
      req.destroy();
      resolve({ online: false, status: "timeout", latency: null });
    });
    req.on("error", () => {
      resolve({ online: false, status: "error", latency: null });
    });
    req.end();
  });
}

/**
 * Controlla tutti gli accessi di ogni servizio.
 * Il servizio è online se almeno un accesso risponde.
 */
async function checkAll(services) {
  return Promise.all(
    services.map(async (s) => {
      const links = await Promise.all(
        s.links.map(async (l) => ({ url: l.url, ...(await checkUrl(l.url)) })),
      );
      const up = links.filter((l) => l.online);
      const best = up.length ? Math.min(...up.map((l) => l.latency)) : null;
      return {
        id: s.id,
        online: up.length > 0,
        status: up.length ? up[0].status : (links[0]?.status ?? "invalid"),
        latency: best,
        links,
      };
    }),
  );
}

module.exports = { checkUrl, checkAll };
