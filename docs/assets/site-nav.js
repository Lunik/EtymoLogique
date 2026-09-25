// Navigation commune à toutes les pages du dossier de direction (une seule source de vérité).
(() => {
  const GROUPS = [
    {
      label: "Identité",
      pages: [
        { file: "identite.html", title: "Identité visuelle", desc: "Une couleur, un seul sens : palette, règles, formes et états." },
        { file: "design-system.html", title: "Design système", desc: "Jetons, composants, motifs, écrans et accessibilité." },
        { file: "typographie.html", title: "Typographie", desc: "Serif pour les mots, sans pour l’interface, mono pour les métadonnées." },
        { file: "mouvement.html", title: "Mouvement", desc: "Confirmer, refuser doucement, révéler par étapes." },
      ],
    },
    {
      label: "Jeu",
      pages: [
        { file: "jeu.html", title: "Table de fusion", desc: "Fusionner des briques rationnées pour découvrir des mots." },
        { file: "plis.html", title: "Plis", desc: "Le rituel d’ouverture, les chances, la réserve et l’encre." },
        { file: "codex.html", title: "Codex", desc: "Cartes à collectionner, vue globale et filiation des mots." },
      ],
    },
    {
      label: "Décisions",
      pages: [
        { file: "adr.html", title: "ADR", desc: "Les décisions d’architecture et de produit, avec leur contexte." },
        { file: "boussole.html", title: "Boussole", desc: "Ce qu’il faut cultiver et ce qu’il faut éviter." },
      ],
    },
  ];
  const PAGES = GROUPS.flatMap((g) => g.pages.map((p) => ({ ...p, group: g.label })));
  window.ETYMO_SITE = { GROUPS, PAGES };

  const here = location.pathname.split("/").pop() || "index.html";
  const current = PAGES.find((p) => p.file === here);
  const el = (tag, attrs = {}, ...children) => {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => { if (v != null) node.setAttribute(k, v); });
    node.append(...children);
    return node;
  };

  const header = document.querySelector(".site-nav");
  if (header) {
    const brand = el("a", { class: "sn-brand", href: "index.html", "aria-current": here === "index.html" ? "page" : null },
      el("span", { class: "sn-seal", "aria-hidden": "true" }, "ÉL"), "ÉtymoLogique");
    const groups = el("nav", { class: "sn-groups", "aria-label": "Pages du dossier" });
    GROUPS.forEach((g) => {
      const isCurrent = current && current.group === g.label;
      const menu = el("ul", { class: "sn-menu" });
      g.pages.forEach((p) => {
        menu.append(el("li", {}, el("a", { href: p.file, "aria-current": p.file === here ? "page" : null },
          el("b", {}, p.title), el("small", {}, p.desc))));
      });
      groups.append(el("div", { class: `sn-group${isCurrent ? " is-current" : ""}` },
        el("a", { class: "sn-tab", href: g.pages[0].file }, g.label), menu));
    });
    header.replaceChildren(el("div", { class: "sn-bar" }, brand, groups));
    if (header.dataset.theme !== "off") {
      header.firstChild.append(el("button", { class: "theme-btn sn-theme", type: "button", "aria-pressed": "false", "aria-label": "Activer le mode nocturne" }, "◐"));
    }
    if (current) {
      const group = GROUPS.find((g) => g.label === current.group);
      const sub = el("nav", { class: "sn-sub", "aria-label": `Pages : ${group.label}` },
        el("span", { class: "sn-sub-label" }, group.label));
      group.pages.forEach((p) => sub.append(el("a", { href: p.file, "aria-current": p.file === here ? "page" : null }, p.title)));
      header.append(sub);
    }
  }

  const pager = document.querySelector(".site-pager");
  if (pager && current) {
    const i = PAGES.indexOf(current);
    const link = (p, dir) => el("a", { class: `sp-link sp-${dir}`, href: p.file },
      el("small", {}, `${dir === "prev" ? "← Précédent" : "Suivant →"} · ${p.group}`), el("b", {}, p.title));
    pager.replaceChildren(
      i > 0 ? link(PAGES[i - 1], "prev") : el("a", { class: "sp-link sp-prev", href: "index.html" }, el("small", {}, "← Accueil"), el("b", {}, "Sommaire")),
      i < PAGES.length - 1 ? link(PAGES[i + 1], "next") : el("a", { class: "sp-link sp-next", href: "index.html" }, el("small", {}, "Retour →"), el("b", {}, "Sommaire")),
    );
  }

  const hub = document.querySelector("[data-site-hub]");
  if (hub) {
    GROUPS.forEach((g, gi) => {
      const list = el("div", { class: "hub-pages" });
      g.pages.forEach((p, pi) => {
        const card = el("a", { class: "hub-card", href: p.file, "data-page": p.file.replace(".html", "") },
          el("span", { class: "hub-num" }, `${String(gi + 1).padStart(2, "0")}.${pi + 1}`),
          el("b", {}, p.title), el("span", { class: "hub-desc" }, p.desc), el("span", { class: "hub-go", "aria-hidden": "true" }, "→"));
        const art = hub.querySelector(`template[data-art="${p.file}"]`);
        if (art) card.prepend(art.content.cloneNode(true));
        list.append(card);
      });
      hub.append(el("section", { class: "hub-group", "aria-labelledby": `hub-${gi}` },
        el("h2", { id: `hub-${gi}` }, el("span", {}, String(gi + 1).padStart(2, "0")), g.label), list));
    });
  }
})();
