async function getJSON(url) {
  const resp = await fetch(url, { cache: "no-store" });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json();
}

export const fetchServices = () => getJSON("/api/services");
export const fetchStatus = () => getJSON("/api/status");
