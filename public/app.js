// ============ CONFIG ============
const STATUS_REFRESH_MS = 15000;

// ============ UTILS ============
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k === 'style') node.setAttribute('style', v);
    else node.setAttribute(k, v);
  });
  (Array.isArray(children) ? children : [children]).forEach(c => {
    if (typeof c === 'string') node.appendChild(document.createTextNode(c));
    else if (c) node.appendChild(c);
  });
  return node;
}

// ============ RENDER CARD ============
function renderCard(service, index) {
  const statusDot = el('span', {
    class: 'status-dot checking',
    id: `status-${service.id}`
  }, 'check');

  const header = el('div', { class: 'card-header' }, [
    el('span', { class: 'icon' }, service.icon),
    statusDot
  ]);

  return el('a', {
    href: service.url,
    target: '_blank',
    rel: 'noopener',
    class: 'card',
    style: `--accent:${service.color}; animation-delay: ${index * 0.1}s`
  }, [
    header,
    el('h2', {}, service.name),
    el('p', {}, service.description),
    el('span', { class: 'link' }, 'Apri servizio →')
  ]);
}

// ============ CARICA SERVIZI ============
async function loadServices() {
  const grid = document.getElementById('servicesGrid');
  try {
    const resp = await fetch('/api/services');
    const services = await resp.json();
    grid.innerHTML = '';
    services.forEach((s, i) => grid.appendChild(renderCard(s, i)));
    checkAllStatuses();
  } catch (err) {
    grid.innerHTML = `<p style="color:#f44336;text-align:center;grid-column:1/-1">Errore caricamento servizi: ${err.message}</p>`;
  }
}

// ============ CHECK STATUS ============
async function checkAllStatuses() {
  try {
    const resp = await fetch('/api/status');
    const data = await resp.json();

    let onlineCount = 0;
    data.services.forEach(svc => {
      const badge = document.getElementById(`status-${svc.id}`);
      if (!badge) return;
      if (svc.online) {
        badge.className = 'status-dot online';
        badge.textContent = 'online';
        onlineCount++;
      } else {
        badge.className = 'status-dot offline';
        badge.textContent = 'offline';
      }
    });

    const global = document.getElementById('globalStatus');
    const text = document.getElementById('globalStatusText');
    const total = data.services.length;

    global.classList.remove('online', 'warning', 'offline');
    if (onlineCount === total) {
      global.classList.add('online');
      text.textContent = `Tutti i sistemi online (${onlineCount}/${total})`;
    } else if (onlineCount === 0) {
      global.classList.add('offline');
      text.textContent = `Sistemi offline (0/${total})`;
    } else {
      global.classList.add('warning');
      text.textContent = `Parzialmente online (${onlineCount}/${total})`;
    }

    document.getElementById('lastUpdate').textContent =
      new Date(data.timestamp).toLocaleString('it-IT');
  } catch (err) {
    console.error('Errore check status:', err);
  }
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  loadServices();
  setInterval(checkAllStatuses, STATUS_REFRESH_MS);
});