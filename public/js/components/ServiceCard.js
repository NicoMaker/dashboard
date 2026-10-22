import { h } from "../lib/dom.js";

const LABELS = { checking: "verifica", online: "online", offline: "offline" };

export function ServiceCard(service, index) {
  const links = service.links || [];
  const multi = links.length > 1;

  const dot = h("span", { class: "status-dot checking" }, LABELS.checking);
  const latency = h("span", { class: "card__latency" });

  // Un singolo accesso: tutta la card è cliccabile (link "stirato").
  // Più accessi (es. porte 3002/3003): un pulsante per ciascuno, col proprio stato.
  const linkEls = links.map((l) => {
    const pill = h("span", { class: "link-dot" });
    const a = h(
      "a",
      {
        class: multi ? "card__btn" : "card__link card__link--stretch",
        href: l.url,
        target: "_blank",
        rel: "noopener",
      },
      multi ? [pill, l.label] : "Apri servizio →",
    );
    return { a, pill, url: l.url };
  });

  const el = h(
    "article",
    {
      class: "card" + (multi ? " card--multi" : ""),
      style: {
        "--accent": service.color || "#6366f1",
        "animation-delay": `${index * 0.08}s`,
      },
    },
    [
      h("div", { class: "card__header" }, [
        h("span", { class: "card__icon" }, service.icon || "•"),
        dot,
      ]),
      h("span", { class: "card__category" }, service.category),
      h("h2", {}, service.name),
      h("p", {}, service.description || ""),
      multi
        ? h("div", { class: "card__actions" }, [
            h(
              "div",
              { class: "card__btns" },
              linkEls.map((l) => l.a),
            ),
            latency,
          ])
        : h("div", { class: "card__footer" }, [linkEls[0]?.a, latency]),
    ],
  );

  function setStatus({ online, latency: ms, links: linkStatus = [] }) {
    const state = online ? "online" : "offline";
    dot.className = `status-dot ${state}`;
    dot.textContent = LABELS[state];
    latency.textContent = online && ms != null ? `${ms} ms` : "";
    el.dataset.state = state;

    const byUrl = new Map(linkStatus.map((s) => [s.url, s]));
    linkEls.forEach((l) => {
      const s = byUrl.get(l.url);
      if (!s) return;
      l.pill.className = `link-dot ${s.online ? "online" : "offline"}`;
      l.a.title = s.online ? `Online (${s.latency} ms)` : "Non raggiungibile";
    });
  }

  return { el, id: service.id, service, setStatus };
}
