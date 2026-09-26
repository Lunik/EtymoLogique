
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(pointer: fine)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Progression et thème (persistant entre les pages) ---------- */
  const progress = $(".progress");
  if (progress) {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
  const THEME_KEY = "etymologique.theme";
  const applyTheme = (on) => {
    document.body.classList.toggle("nocturne", on);
    $$(".theme-btn").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(on));
      btn.setAttribute("aria-label", on ? "Activer le mode atelier" : "Activer le mode nocturne");
    });
  };
  const readTheme = () => { try { return localStorage.getItem(THEME_KEY) === "nocturne"; } catch { return false; } };
  applyTheme(readTheme());
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".theme-btn")) return;
    const on = !document.body.classList.contains("nocturne");
    applyTheme(on);
    try { localStorage.setItem(THEME_KEY, on ? "nocturne" : "atelier"); } catch { /* stockage indisponible */ }
  });

  /* ---------- Apparitions ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  $$("[data-reveal]").forEach((el) => revealObserver.observe(el));

  /* ---------- Titre lettre par lettre ---------- */
  let charIndex = 0;
  $$(".t-line").forEach((line) => {
    const text = line.textContent.trim();
    line.textContent = "";
    [...text].forEach((ch) => {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = ch;
      span.style.setProperty("--i", charIndex++);
      line.append(span);
    });
  });

  /* ---------- Brouillage de texte ---------- */
  const POOL = "abcdefghijklmnopqrstuvwxyzαβγδεζηθικλμνξοπρστυφχψω";
  function scramble(el, to) {
    if (reduce) { el.textContent = to; return; }
    const from = el.textContent;
    const len = Math.max(from.length, to.length);
    const queue = Array.from({ length: len }, (_, i) => {
      const start = Math.floor(Math.random() * 12);
      return { from: from[i] || "", to: to[i] || "", start, end: start + 6 + Math.floor(Math.random() * 14), ch: "" };
    });
    let frame = 0;
    cancelAnimationFrame(el._raf);
    const tick = () => {
      el.replaceChildren();
      let done = 0;
      queue.forEach((q) => {
        if (frame >= q.end) { done++; el.append(q.to); }
        else if (frame >= q.start) {
          if (!q.ch || Math.random() < 0.28) q.ch = POOL[Math.floor(Math.random() * POOL.length)];
          const g = document.createElement("span");
          g.className = "glitch";
          g.textContent = q.ch;
          el.append(g);
        } else el.append(q.from);
      });
      if (done < queue.length) { frame++; el._raf = requestAnimationFrame(tick); }
    };
    tick();
  }

  if ($("#morph")) {
    const hero = $(".hero");
    const morph = $("#morph");
    const morphLang = $("#morphLang");
    const chainItems = $$(".chain li");
    const steps = [
      { text: "étymologique", label: "Français", key: "fr" },
      { text: "etymologicus", label: "Latin", key: "la" },
      { text: "ἐτυμολογικός", label: "Grec ancien", key: "grc" },
    ];
    let step = 0;
    const showStep = () => {
      const s = steps[step];
      morph.setAttribute("lang", s.key);
      scramble(morph, s.text);
      morphLang.textContent = s.label;
      morphLang.dataset.lang = s.key;
      chainItems.forEach((li, i) => li.classList.toggle("on", i === step));
    };
    showStep();
    setInterval(() => { step = (step + 1) % steps.length; showStep(); }, 2800);

    /* ---------- Hero : parallaxe et lueur ---------- */
    const glow = $(".hero-glow");
    const floats = $$(".float");
    if (fine && !reduce) {
      let raf = 0;
      hero.addEventListener("pointermove", (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const r = hero.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width;
          const y = (e.clientY - r.top) / r.height;
          glow.style.setProperty("--gx", `${x * 100}%`);
          glow.style.setProperty("--gy", `${y * 100}%`);
          floats.forEach((f) => {
            const d = Number(f.dataset.depth) || 0;
            f.style.translate = `${(x - 0.5) * d}px ${(y - 0.5) * d}px`;
          });
        });
      });
      hero.addEventListener("pointerleave", () => floats.forEach((f) => { f.style.translate = ""; }));
    }

  }

  /* ---------- Inclinaison 3D ---------- */
  if (fine && !reduce) {
    $$(".tilt").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 12}deg) rotateY(${(x - 0.5) * 14}deg) translateY(-6px)`;
        el.style.setProperty("--px", `${x * 100}%`);
        el.style.setProperty("--py", `${y * 100}%`);
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- Palette ---------- */
  const toast = $(".toast");
  let toastTimer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("visible"), 1600);
  };
  $$("button[data-color]").forEach((sw) => sw.addEventListener("click", async () => {
    const color = sw.dataset.color;
    try { await navigator.clipboard.writeText(color); showToast(`${color} copié`); }
    catch { showToast(color); }
  }));

  /* ---------- Glyphe ---------- */
  if ($("#glyph")) {
    const glyph = $("#glyph");
    const glyphLabel = $("#glyphLabel");
    const glyphs = [["A", "a", "Latin de base"], ["Γ", "γ", "Grec"], ["É", "é", "Diacritiques"], ["Λ", "λ", "Grec"], ["Æ", "æ", "Ligature"], ["Ω", "ω", "Grec"], ["Ψ", "ψ", "Grec"]];
    let gi = 0;
    setInterval(() => {
      gi = (gi + 1) % glyphs.length;
      const [up, low, label] = glyphs[gi];
      const apply = () => {
        const em = document.createElement("em");
        em.textContent = low;
        glyph.replaceChildren(up, em);
        glyphLabel.textContent = label;
        glyph.classList.remove("swap");
      };
      if (reduce) { apply(); return; }
      glyph.classList.add("swap");
      setTimeout(apply, 350);
    }, 2000);

  }

  /* ---------- Graphe : longueur des traits ---------- */
  $$(".edge").forEach((p) => p.style.setProperty("--len", Math.ceil(p.getTotalLength())));

  /* ---------- Démo jouable ---------- */
  const BRICKS = {
    bio: { label: "bio-", gloss: "vie", kind: "préfixe", rarity: "commune" },
    geo: { label: "géo-", gloss: "terre", kind: "préfixe", rarity: "commune" },
    logie: { label: "-logie", gloss: "étude", kind: "suffixe", rarity: "commune" },
    graphie: { label: "-graphie", gloss: "écriture", kind: "suffixe", rarity: "peu" },
    philo: { label: "philo-", gloss: "ami", kind: "préfixe", rarity: "peu" },
    astro: { label: "astro-", gloss: "astre", kind: "préfixe", rarity: "peu" },
    sophie: { label: "-sophie", gloss: "sagesse", kind: "suffixe", rarity: "rare" },
    nomie: { label: "-nomie", gloss: "loi", kind: "suffixe", rarity: "rare" },
    etymo: { label: "étymo-", gloss: "vrai", kind: "préfixe", rarity: "legendaire" },
  };
  // Raretés : poids de tirage ; gouttes d'encre d'un doublon, sous le plafond (dupInk) et réserve pleine (ink) (ADR 0019).
  const RARITY = {
    commune: { label: "Commune", shape: "triangle", weight: 62, dupInk: 1, ink: 2 },
    peu: { label: "Peu commune", shape: "carré", weight: 26, dupInk: 2, ink: 4 },
    rare: { label: "Rare", shape: "pentagone", weight: 10, dupInk: 4, ink: 8 },
    legendaire: { label: "Légendaire", shape: "diamant", weight: 2, dupInk: 10, ink: 20 },
  };
  // Les suffixes sortent un peu plus souvent que les préfixes.
  const TYPE_WEIGHT = { "préfixe": 1, suffixe: 1.25 };
  const RECIPES = {
    "bio+logie": { word: "biologie", lit: "étude de la vie", def: "Science qui étudie les êtres vivants et les phénomènes de la vie.", note: "Grec ancien bíos « vie » + -logía « étude, discours ».", tr: "" },
    "geo+logie": { word: "géologie", lit: "étude de la terre", def: "Science qui étudie la Terre : ses roches, sa structure et son histoire.", note: "Grec ancien gê « terre » + -logía « étude ».", tr: { brick: "geo", text: "forme de composition de gê." } },
    "bio+graphie": { word: "biographie", lit: "écriture d’une vie", def: "Récit écrit de la vie d’une personne.", note: "Grec ancien bíos « vie » + -graphía « écriture ».", tr: "" },
    "geo+graphie": { word: "géographie", lit: "description de la terre", def: "Science qui décrit la surface de la Terre, ses paysages et ses populations.", note: "Grec ancien gê « terre » + -graphía « description ».", tr: { brick: "geo", text: "forme de composition de gê." } },
    "philo+sophie": { word: "philosophie", lit: "amour de la sagesse", def: "Réflexion critique sur le savoir, l’existence, la morale et le sens des choses.", note: "Grec ancien phílos « ami » + sophía « sagesse ».", tr: "Composé déjà formé en grec : philosophía." },
    "philo+logie": { word: "philologie", lit: "amour des mots", def: "Étude des langues à travers leurs textes, en particulier les textes anciens.", note: "Grec ancien phílos « ami » + -logía « parole, discours ».", tr: "" },
    "astro+logie": { word: "astrologie", lit: "discours sur les astres", def: "Pratique divinatoire qui prétend lire l’influence des astres sur les vies humaines.", note: "Grec ancien ástron « astre » + -logía « discours ».", tr: { brick: "astro", text: "forme de composition de ástron." } },
    "etymo+logie": { word: "étymologie", lit: "étude du sens vrai", def: "Étude de l’origine et de l’histoire des mots.", note: "Grec ancien étumon « sens vrai » + -logía « étude ».", tr: { brick: "etymo", text: "forme de composition de étumon." } },
    "astro+nomie": { word: "astronomie", lit: "loi des astres", def: "Science qui étudie les astres et l’Univers.", note: "Grec ancien ástron « astre » + -nomía « loi, règle ».", tr: { brick: "astro", text: "forme de composition de ástron." } },
  };
  const RECIPE_KEYS = Object.keys(RECIPES);

  /* ---------- Réserve partagée entre les pages (démo, stockage local) ---------- */
  // Briques rationnées : réserve de départ, puis seuls les plis donnent des exemplaires.
  const STARTER = { bio: 2, geo: 2, logie: 2, graphie: 2 };
  const CAP = 5;
  const STORE_KEY = "etymologique.demo.v1";
  const freshStore = () => ({ owned: Object.keys(STARTER), copies: { ...STARTER }, found: [], ink: 0, packCount: 0, byFasc: {}, nextPackAt: 0, energy: 2, history: [], hint: null, sand: 3, sandLog: [] });
  function loadStore() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY));
      if (saved && Array.isArray(saved.owned)) return { ...freshStore(), ...saved };
    } catch { /* stockage indisponible ou corrompu */ }
    return freshStore();
  }
  const store = loadStore();
  const saveStore = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch { /* stockage indisponible */ } };
  const owned = store.owned;
  const copies = store.copies;
  const found = {
    has: (key) => store.found.includes(key),
    add: (key) => { if (!store.found.includes(key)) store.found.push(key); },
    get size() { return store.found.length; },
  };
  const demoStatus = $("#demoStatus");
  if (demoStatus) {
    const total = Object.values(store.copies).reduce((sum, n) => sum + n, 0);
    const fill = (label, value) => { const item = document.createElement("span"); item.append(`${label} `, Object.assign(document.createElement("b"), { textContent: value })); return item; };
    demoStatus.replaceChildren(fill("Démo · réserve", `${total} exemplaires`), fill("Découvertes", `${store.found.length} / ${RECIPE_KEYS.length}`), fill("Plis ouverts", String(store.packCount)));
  }
  // Action irréversible : un premier appui arme le bouton (fond Danger), un second confirme.
  $$("[data-reset-demo]").forEach((btn) => {
    const label = $("span", btn);
    const idle = label.textContent;
    let timer = 0;
    const disarm = () => { btn.classList.remove("is-armed"); label.textContent = idle; };
    btn.addEventListener("click", () => {
      if (!btn.classList.contains("is-armed")) {
        btn.classList.add("is-armed");
        label.textContent = "Confirmer : tout effacer";
        clearTimeout(timer);
        timer = setTimeout(disarm, 4000);
        return;
      }
      try { localStorage.removeItem(STORE_KEY); } catch { /* stockage indisponible */ }
      location.reload();
    });
    btn.addEventListener("blur", () => { clearTimeout(timer); disarm(); });
  });

  function brickEl(tag, label, kind, gloss) {
    const el = document.createElement(tag);
    el.className = "brick";
    el.dataset.kind = kind;
    const labelEl = document.createElement("span");
    labelEl.className = "b-label";
    labelEl.textContent = label;
    const meta = document.createElement("span");
    meta.className = "b-meta";
    const kindEl = document.createElement("span");
    kindEl.className = "b-kind";
    kindEl.textContent = `${kind} · `;
    meta.append(kindEl, `«\u00a0${gloss}\u00a0»`);
    el.append(labelEl, meta);
    return el;
  }

  function makeBrick(id, tag) {
    const data = BRICKS[id];
    return brickEl(tag, data.label, data.kind, data.gloss);
  }

  // Petite brique en ligne : les briques élémentaires ne sont jamais affichées en texte brut.
  const kindOf = (label) => (label.startsWith("-") ? "suffixe" : label.endsWith("-") ? "préfixe" : "mot");
  function chipEl(label, kind = kindOf(label), missing = false) {
    const chip = document.createElement("span");
    chip.className = missing ? "bchip missing" : "bchip";
    chip.dataset.kind = kind;
    chip.textContent = label;
    return chip;
  }
  // Transforme les formes à trait d'union d'un texte en petites briques.
  function richText(text) {
    const pattern = /(^|[\s(«])(-[\p{L}]{2,}|[\p{L}]{2,}-)(?=$|[\s),.»:])/gu;
    const nodes = [];
    let last = 0;
    for (const match of text.matchAll(pattern)) {
      const start = match.index + match[1].length;
      nodes.push(text.slice(last, start), chipEl(match[2]));
      last = start + match[2].length;
    }
    nodes.push(text.slice(last));
    return nodes.filter((n) => n !== "");
  }

  function formulaEl(parts) {
    const formula = document.createElement("span");
    formula.className = "bformula";
    parts.forEach((p, i) => {
      if (i) {
        const plus = document.createElement("span");
        plus.className = "bplus";
        plus.textContent = "+";
        formula.append(plus);
      }
      formula.append(chipEl(p.label, p.kind, p.missing));
    });
    return formula;
  }

  const nbsp = (text) => String(text).replace(/« /g, "«\u00a0").replace(/ »/g, "\u00a0»");

  const SEG_COLORS = { "préfixe": "var(--c-prefix)", suffixe: "var(--c-suffix)", mot: "var(--paper-2)" };

  // Colore chaque morceau du mot avec la couleur de sa brique, si le mot est bien leur simple juxtaposition.
  function paintWord(el, word, parts) {
    const segs = parts.map((p) => p.label.replace(/^-|-$/g, ""));
    if (segs.join("") !== word) { el.textContent = word; return; }
    el.replaceChildren();
    segs.forEach((text, i) => {
      const seg = document.createElement("span");
      seg.className = "seg";
      seg.style.setProperty("--c", SEG_COLORS[parts[i].kind] || "var(--c-prefix)");
      seg.style.animationDelay = `${0.75 + i * 0.18}s`;
      seg.textContent = text;
      el.append(seg);
    });
  }

  function buildEquation(parts, lit) {
    const eq = document.createElement("div");
    eq.className = "r-eq";
    const row = document.createElement("div");
    row.className = "r-eq-row";
    parts.forEach((p, i) => {
      if (i) {
        const op = document.createElement("span");
        op.className = "r-op";
        op.setAttribute("aria-hidden", "true");
        op.textContent = "+";
        op.style.animationDelay = `${0.2 + i * 0.15}s`;
        row.append(op);
      }
      const b = brickEl("span", p.label, p.kind, p.gloss);
      b.style.animationDelay = `${0.12 + i * 0.18}s`;
      row.append(b);
    });
    eq.append(row);
    if (lit) {
      const litEl = document.createElement("p");
      litEl.className = "r-lit";
      const tag = document.createElement("span");
      tag.textContent = "Sens littéral";
      litEl.append(tag, `«\u00a0${lit}\u00a0»`);
      eq.append(litEl);
    }
    return eq;
  }

  const SVG_NS = "http://www.w3.org/2000/svg";
  // Forme de rareté. withName : nom accessible quand le libellé n'est pas écrit à côté.
  function rarityEl(rarity, withName) {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "rar");
    svg.dataset.rarity = rarity;
    const use = document.createElementNS(SVG_NS, "use");
    use.setAttribute("href", `#rar-${rarity}`);
    svg.append(use);
    if (withName) {
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", `Rareté : ${RARITY[rarity].label}`);
      const title = document.createElementNS(SVG_NS, "title");
      title.textContent = `${RARITY[rarity].label} · ${RARITY[rarity].shape}`;
      svg.prepend(title);
    } else svg.setAttribute("aria-hidden", "true");
    return svg;
  }

  /* ---------- Données du codex ---------- */
  const mk = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = nbsp(text);
    return node;
  };
  const pad = (n) => String(n).padStart(3, "0");
  const LANGS = {
    fr: { name: "Français", c: "var(--c-lang)" },
    la: { name: "Latin", c: "var(--c-lang)" },
    grc: { name: "Grec ancien", c: "var(--c-lang)" },
  };
  const TYPES = {
    mot: { label: "Mot", plural: "Mots", c: "#0f1f19" },
    prefixe: { label: "Préfixe", plural: "Préfixes", c: "var(--c-prefix)" },
    suffixe: { label: "Suffixe", plural: "Suffixes", c: "var(--c-suffix)" },
    langue: { label: "Langue", plural: "Langues", c: "var(--c-lang)" },
  };
  const TYPE_ORDER = ["mot", "prefixe", "suffixe", "langue"];
  const KIND_FR = { prefixe: "préfixe", suffixe: "suffixe" };
  const fm = (lang, form, isFound = true, tr = "") => ({ lang, form, found: isFound, tr });
  const CODEX = [
    { id: "etymologique", n: 1, fasc: 1, type: "mot", lang: "fr", word: "étymologique", def: "Qui concerne l’origine et l’histoire des mots.", lit: "qui relève de l’étymologie", parts: [{ label: "étymologie", kind: "mot", gloss: "étude du sens vrai" }, { label: "-ique", kind: "suffixe", gloss: "relatif à" }], conf: "Établie",
      forms: [fm("fr", "étymologique"), fm("la", "etymologicus"), fm("grc", "ἐτυμολογικός", true, "etumologikós")],
      links: { label: "Composants", items: [["étymologie", true], ["-ique", false]] } },
    { id: "francais", n: 2, fasc: 1, type: "langue", key: "fr", word: "Français", glyph: "É", conf: "Établie",
      def: "Langue romane issue du latin parlé ; elle a emprunté de nombreux mots savants au latin et au grec." },
    { id: "latin", n: 3, fasc: 1, type: "langue", key: "la", word: "Latin", glyph: "Æ", conf: "Établie",
      def: "Langue de la Rome antique ; elle a transmis au français l’essentiel de son vocabulaire." },
    { id: "grec", n: 4, fasc: 1, type: "langue", key: "grc", word: "Grec ancien", glyph: "Ω", conf: "Établie",
      def: "Langue de la Grèce antique, écrite en alphabet grec ; source de nombreux mots savants." },
    { id: "etymologie", n: 5, fasc: 1, type: "mot", lang: "fr", word: "étymologie", def: "Étude de l’origine et de l’histoire des mots.", lit: "étude du sens vrai", parts: [{ label: "étymo-", kind: "préfixe", gloss: "vrai" }, { label: "-logie", kind: "suffixe", gloss: "étude" }], conf: "Établie",
      forms: [fm("fr", "étymologie"), fm("la", "etymologia"), fm("grc", "ἐτυμολογία", true, "etumología")],
      links: { label: "Composants", items: [["étymo-", true], ["-logie", true]] } },
    { id: "logie", n: 6, fasc: 1, rar: "commune", type: "suffixe", lang: "fr", word: "-logie", gloss: "étude", def: "Suffixe des sciences et des discours : « étude de… ».", lit: "« parole, discours, étude »", conf: "Établie",
      forms: [fm("fr", "-logie"), fm("la", "-logia"), fm("grc", "-λογία", true, "-logía")],
      links: { label: "Mots formés", items: [["étymologie", true], ["biologie", true], ["géologie", true], ["philologie", true], ["astrologie", false]] } },
    { id: "bio", n: 7, fasc: 1, rar: "commune", type: "prefixe", lang: "fr", word: "bio-", gloss: "vie", def: "Élément savant qui signifie « vie ».", conf: "Établie",
      forms: [fm("fr", "bio-"), fm("grc", "βίος", true, "bíos")],
      links: { label: "Mots formés", items: [["biologie", true], ["biographie", false]] } },
    { id: "biologie", n: 8, fasc: 1, type: "mot", lang: "fr", word: "biologie", def: "Science qui étudie les êtres vivants.", lit: "étude de la vie", parts: [{ label: "bio-", kind: "préfixe", gloss: "vie" }, { label: "-logie", kind: "suffixe", gloss: "étude" }], note: "Composé savant formé vers 1800 à partir d’éléments grecs.", conf: "Établie",
      forms: [fm("fr", "biologie")],
      links: { label: "Composants", items: [["bio-", true], ["-logie", true]] } },
    { id: "philo", n: 9, fasc: 2, rar: "peu", type: "prefixe", lang: "fr", word: "philo-", gloss: "qui aime", def: "Élément savant qui signifie « qui aime ».", conf: "Établie",
      forms: [fm("fr", "philo-"), fm("grc", "φιλο-", true, "philo-")],
      links: { label: "Mots formés", items: [["philosophie", true], ["philologie", true]] } },
    { id: "philosophie", n: 10, fasc: 2, fresh: true, type: "mot", lang: "fr", word: "philosophie", def: "Réflexion critique sur le savoir, l’existence et les valeurs.", lit: "amour de la sagesse", parts: [{ label: "philo-", kind: "préfixe", gloss: "qui aime" }, { label: "-sophie", kind: "suffixe", gloss: "sagesse" }], conf: "Établie",
      forms: [fm("fr", "philosophie"), fm("la", "philosophia"), fm("grc", "φιλοσοφία", false, "philosophía")],
      links: { label: "Composants", items: [["philo-", true], ["-sophie", true]] } },
    { id: "sophie", n: 11, fasc: 2, rar: "rare", type: "suffixe", lang: "fr", word: "-sophie", gloss: "sagesse", def: "Élément savant qui signifie « sagesse, savoir ».", conf: "Établie",
      forms: [fm("fr", "-sophie"), fm("grc", "σοφία", false, "sophía")],
      links: { label: "Mots formés", items: [["philosophie", true], ["théosophie", false]] } },
    { id: "geo", n: 12, fasc: 1, rar: "commune", type: "prefixe", lang: "fr", word: "géo-", gloss: "terre", def: "Élément savant qui signifie « terre ».", note: "Forme de composition du grec gê « terre ».", conf: "Établie",
      forms: [fm("fr", "géo-"), fm("grc", "γεω-", true, "geō-")],
      links: { label: "Mots formés", items: [["géographie", true], ["géologie", true]] } },
    { id: "geographie", n: 13, fasc: 2, type: "mot", lang: "fr", word: "géographie", def: "Science qui décrit la surface de la Terre, ses paysages et ses populations.", lit: "description de la terre", parts: [{ label: "géo-", kind: "préfixe", gloss: "terre" }, { label: "-graphie", kind: "suffixe", gloss: "description" }], conf: "Établie",
      forms: [fm("fr", "géographie"), fm("la", "geographia", false), fm("grc", "γεωγραφία", false, "geōgraphía")],
      links: { label: "Composants", items: [["géo-", true], ["-graphie", true]] } },
    { id: "graphie", n: 14, fasc: 2, rar: "peu", type: "suffixe", lang: "fr", word: "-graphie", gloss: "écriture", def: "Élément savant qui signifie « écriture, description ».", conf: "Établie",
      forms: [fm("fr", "-graphie"), fm("la", "-graphia", false), fm("grc", "-γραφία", false, "-graphía")],
      links: { label: "Mots formés", items: [["géographie", true], ["biographie", false]] } },
    { id: "geologie", n: 15, fasc: 1, type: "mot", lang: "fr", word: "géologie", def: "Science qui étudie la Terre : ses roches, sa structure et son histoire.", lit: "étude de la terre", parts: [{ label: "géo-", kind: "préfixe", gloss: "terre" }, { label: "-logie", kind: "suffixe", gloss: "étude" }], conf: "Établie",
      forms: [fm("fr", "géologie"), fm("la", "geologia", false)],
      links: { label: "Composants", items: [["géo-", true], ["-logie", true]] } },
    { id: "philologie", n: 16, fasc: 2, type: "mot", lang: "fr", word: "philologie", def: "Étude des langues à travers leurs textes, en particulier les textes anciens.", lit: "amour des mots", parts: [{ label: "philo-", kind: "préfixe", gloss: "qui aime" }, { label: "-logie", kind: "suffixe", gloss: "parole" }], conf: "Établie",
      forms: [fm("fr", "philologie"), fm("la", "philologia"), fm("grc", "φιλολογία", false, "philología")],
      links: { label: "Composants", items: [["philo-", true], ["-logie", true]] } },
    { id: "etymo", n: 17, fasc: 1, rar: "legendaire", type: "prefixe", lang: "fr", word: "étymo-", gloss: "vrai", def: "Élément savant qui signifie « vrai, authentique ».", note: "Forme de composition du grec étumon « le sens vrai ».", conf: "Établie",
      forms: [fm("fr", "étymo-"), fm("grc", "ἐτυμο-", true, "etumo-")],
      links: { label: "Mots formés", items: [["étymologie", true]] } },
    { id: "x-ique", n: 18, fasc: 1, rar: "commune", type: "suffixe", locked: true, hint: "« relatif à »" },
    { id: "x-mot", n: 19, fasc: 2, type: "mot", locked: true, hint: "« loi des astres »" },
    { id: "x-suffixe", n: 20, fasc: 2, rar: "rare", type: "suffixe", locked: true, hint: "« loi, règle »" },
    { id: "x-astro", n: 21, fasc: 2, rar: "peu", type: "prefixe", locked: true, hint: "« astre »" },
    { id: "x-astrologie", n: 22, fasc: 2, type: "mot", locked: true, hint: "« discours sur les astres »" },
    { id: "x-biographie", n: 23, fasc: 2, type: "mot", locked: true, hint: "« récit d’une vie »" },
    // Légendaire encore inconnue : ni carte, ni silhouette, ni compteur, pour garder le suspense (ADR 0015).
    { id: "x-legendaire", n: 24, fasc: 2, rar: "legendaire", type: "prefixe", locked: true },
    { id: "x-legendaire-mot", n: 25, fasc: 2, type: "mot", locked: true, needs: ["x-legendaire"] },
  ];
  const byId = new Map(CODEX.map((e) => [e.id, e]));
  // Chaque fascicule a sa jaquette et son catalogue de plis : ses briques nouvelles et celles qu'il reprend.
  const FASCICULES = [
    { n: 1, label: "Fascicule n° 01", when: "Jour 1", jacket: "rosette", pool: ["bio", "geo", "logie", "etymo"] },
    { n: 2, label: "Fascicule n° 02", when: "Jour 30", jacket: "argile", pool: ["philo", "sophie", "graphie", "astro", "nomie", "logie", "geo", "bio"] },
  ];
  const NEXT_FASCICULE = { n: 3, label: "Fascicule n° 03", when: "Jour 60" };
  const isLegend = (e) => e.rar === "legendaire";
  // Une légendaire inconnue, ou un mot qui en dépend, reste secret : aucune trace dans le codex.
  const isSecret = (e) => e.locked && (isLegend(e) || (e.needs || []).some((id) => { const dep = byId.get(id); return dep && dep.locked && isLegend(dep); }));
  const isCounted = (e) => !isLegend(e) && !isSecret(e);
  const byWord = new Map(CODEX.filter((e) => !e.locked).map((e) => [e.word, e.id]));
  const langCard = (key) => CODEX.find((e) => e.type === "langue" && e.key === key)?.id;

  /* ---------- Table de fusion ---------- */
  function initGame() {
    let slots = [null, null];
    let busy = false;
    const onTable = (id) => slots.filter((s) => s === id).length;
    const available = (id) => (copies[id] || 0) - onTable(id);

    const tray = $("#tray");
    const table = $("#table");
    const slotsBox = $("#slots");
    const slotEls = $$(".slot", table);
    const statusEl = $("#status");
    const feedbackEl = $("#feedback");
    const result = $("#result");
    const toPacks = $("#toPacks");
    function renderTray(highlight, used = []) {
      tray.replaceChildren();
      owned.forEach((id) => {
        const { label, gloss } = BRICKS[id];
        const left = available(id);
        const spent = !copies[id];
        const b = makeBrick(id, "button");
        b.type = "button";
        b.draggable = left > 0;
        b.classList.toggle("is-spent", spent);
        b.classList.toggle("is-out", !spent && left <= 0);
        b.setAttribute("aria-disabled", String(left <= 0));
        b.setAttribute("aria-label", spent
          ? `${label} (${gloss}) : épuisée. Revient dans les plis`
          : left <= 0 ? `${label} (${gloss}) : tous vos exemplaires sont sur la table`
          : `Poser ${label} (${gloss}) sur la table. ${left} exemplaire${left > 1 ? "s" : ""} disponible${left > 1 ? "s" : ""}`);
        if (id === highlight) b.classList.add("new");
        const count = document.createElement("span");
        count.className = spent ? "b-count zero" : "b-count";
        count.textContent = spent ? "épuisée" : `×${left}`;
        b.append(count);
        if (used.includes(id) && !reduce) {
          const minus = document.createElement("span");
          minus.className = "b-minus";
          minus.setAttribute("aria-hidden", "true");
          minus.textContent = "−1";
          b.append(minus);
        }
        b.addEventListener("click", () => place(id));
        b.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", id);
          e.dataTransfer.effectAllowed = "copy";
          b.classList.add("dragging");
        });
        b.addEventListener("dragend", () => b.classList.remove("dragging"));
        tray.append(b);
      });
      $("#ownedCount").textContent = String(owned.reduce((sum, id) => sum + Math.max(0, available(id)), 0));
      const anySpent = owned.some((id) => !copies[id]);
      const link = toPacks;
      link.classList.toggle("is-urgent", anySpent);
      link.textContent = anySpent ? "Brique épuisée : ouvrir un pli →" : "Plus d’exemplaires ? Ouvrir un pli →";
    }

    function renderSlots() {
      slotEls.forEach((slot, i) => {
        slot.replaceChildren();
        const id = slots[i];
        slot.classList.toggle("filled", Boolean(id));
        if (id) {
          slot.append(makeBrick(id, "span"));
          slot.setAttribute("aria-label", `Emplacement ${i + 1} : ${BRICKS[id].label}. Retirer`);
        } else {
          const n = document.createElement("span");
          n.className = "slot-num";
          n.textContent = String(i + 1);
          slot.append(n);
          slot.setAttribute("aria-label", `Emplacement ${i + 1} vide`);
        }
      });
      const full = slots.every(Boolean);
      table.classList.toggle("ready", full);
      statusEl.textContent = full ? "Hypothèse prête" : slots.some(Boolean) ? "Une brique posée" : "En attente";
    }

    function say(content, tone = "") {
      feedbackEl.replaceChildren(...[].concat(content));
      feedbackEl.dataset.tone = tone;
      feedbackEl.classList.remove("bump");
      void feedbackEl.offsetWidth;
      feedbackEl.classList.add("bump");
    }

    function place(id, index) {
      if (busy) return;
      const target = index ?? (slots[0] === null ? 0 : 1);
      const freed = slots[target] === id ? 1 : 0;
      if (available(id) + freed <= 0) {
        const chip = chipEl(BRICKS[id].label, BRICKS[id].kind);
        say(copies[id] ? ["Tous vos exemplaires de ", chip, " sont déjà sur la table."] : ["Plus aucun exemplaire de ", chip, ". Ouvrez un pli pour en retrouver."], "hint");
        return;
      }
      hideResult();
      slots[target] = id;
      renderSlots();
      renderTray();
    }

    slotEls.forEach((slot, i) => {
      slot.addEventListener("click", () => {
        if (!slots[i] || busy) return;
        slots[i] = null;
        renderSlots();
        renderTray();
      });
      slot.addEventListener("dragover", (e) => { e.preventDefault(); slot.classList.add("over"); });
      slot.addEventListener("dragleave", () => slot.classList.remove("over"));
      slot.addEventListener("drop", (e) => {
        e.preventDefault();
        slot.classList.remove("over");
        const id = e.dataTransfer.getData("text/plain");
        if (BRICKS[id] && owned.includes(id)) place(id, i);
      });
    });

    function shake() {
      slotsBox.classList.remove("shake");
      void slotsBox.offsetWidth;
      slotsBox.classList.add("shake");
    }

    function confetti() {
      if (reduce) return;
      const colors = ["var(--c-prefix)", "var(--c-action)", "var(--c-suffix)", "#fffbf3"];
      for (let i = 0; i < 22; i++) {
        const c = document.createElement("span");
        c.className = "confetti";
        const angle = Math.random() * Math.PI * 2;
        const dist = 90 + Math.random() * 150;
        c.style.setProperty("--c", colors[i % colors.length]);
        c.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
        c.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
        c.style.setProperty("--r", `${Math.random() * 720 - 360}deg`);
        slotsBox.append(c);
        setTimeout(() => c.remove(), 1100);
      }
    }

    function showResult(key, known) {
      const r = RECIPES[key];
      const [a, b] = key.split("+");
      const parts = [a, b].map((id) => BRICKS[id]);
      $("#rKicker").textContent = known ? "Déjà dans le codex" : `Découverte ${found.size} / ${RECIPE_KEYS.length}`;
      const codexLink = $("#rCodex");
      const cardId = byWord.get(r.word);
      codexLink.hidden = !cardId;
      if (cardId) codexLink.href = `codex.html#carte-${cardId}`;
      const cost = $("#rCost");
      cost.hidden = known;
      if (!known) {
        const tag = document.createElement("span");
        tag.textContent = "Exemplaires utilisés";
        const items = [a, b].map((id) => {
          const item = document.createElement("span");
          const rest = document.createElement("small");
          rest.textContent = copies[id] ? `−1 · reste ×${copies[id]}` : "−1 · épuisée";
          item.append(chipEl(BRICKS[id].label, BRICKS[id].kind), " ", rest);
          return item;
        });
        cost.replaceChildren(tag, ...items);
      }
      paintWord($("#rWord"), r.word, parts);
      $("#rDef").textContent = nbsp(r.def);
      $("#rEq").replaceWith(Object.assign(buildEquation(parts, r.lit), { id: "rEq" }));
      $("#rNote").replaceChildren(...richText(nbsp(`Origine : ${r.note}`)));
      const trEl = $("#rTr");
      if (r.tr && r.tr.brick) trEl.replaceChildren(chipEl(BRICKS[r.tr.brick].label, BRICKS[r.tr.brick].kind), ` ${r.tr.text}`);
      else trEl.textContent = nbsp(r.tr);
      result.hidden = false;
      table.classList.add("showing");
      result.style.animation = "none";
      void result.offsetWidth;
      result.style.animation = "";
    }
    function hideResult() {
      result.hidden = true;
      table.classList.remove("showing");
    }
    $("#rClose").addEventListener("click", hideResult);

    function renderDiscoveries(justFound) {
      const grid = $("#discGrid");
      grid.replaceChildren();
      RECIPE_KEYS.forEach((key) => {
        const r = RECIPES[key];
        const [a, b] = key.split("+");
        const isFound = found.has(key);
        const tile = document.createElement(isFound ? "button" : "div");
        tile.className = `disc${isFound ? " found" : ""}${key === justFound ? " just" : ""}`;
        const word = document.createElement("span");
        word.className = "d-word";
        word.textContent = isFound ? r.word : "•".repeat(r.word.length);
        const formula = document.createElement("span");
        formula.className = "d-formula";
        if (isFound) formula.append(formulaEl([BRICKS[a], BRICKS[b]]));
        else formula.textContent = `${r.word.length} lettres`;
        if (isFound) {
          tile.type = "button";
          tile.setAttribute("aria-label", `${r.word} : ${r.def} Revoir la fiche`);
          const def = document.createElement("span");
          def.className = "d-def";
          def.textContent = r.def;
          tile.append(word, def, formula);
          tile.addEventListener("click", () => {
            if (busy) return;
            showResult(key, true);
            result.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
          });
        } else {
          tile.append(word, formula);
        }
        grid.append(tile);
      });
      $("#discCount").textContent = `${found.size} / ${RECIPE_KEYS.length}`;
      $("#discBar").style.width = `${(found.size / RECIPE_KEYS.length) * 100}%`;
    }

    function fuse() {
      if (busy) return;
      if (!slots.every(Boolean)) { say("Posez deux briques sur la table.", "hint"); shake(); return; }
      const key = slots.join("+");
      const reversed = [...slots].reverse().join("+");
      if (RECIPES[key]) {
        if (found.has(key)) { say(`${RECIPES[key].word} est déjà dans votre codex. Aucun exemplaire utilisé.`, "known"); showResult(key, true); return; }
        const used = [...slots];
        busy = true;
        table.classList.add("fusing");
        setTimeout(confetti, reduce ? 0 : 320);
        setTimeout(() => {
          found.add(key);
          used.forEach((id) => { copies[id] -= 1; });
          table.classList.remove("fusing");
          slots = [null, null];
          renderSlots();
          renderTray(undefined, used);
          if (store.hint && store.hint.join("+") === key) store.hint = null;
          saveStore();
          renderDiscoveries(key);
          showResult(key, false);
          const complete = found.size === RECIPE_KEYS.length;
          say(complete ? "Codex de démo complet. Bravo !" : `Nouvelle découverte : ${RECIPES[key].word} !`, "win");
          busy = false;
        }, reduce ? 0 : 700);
      } else if (RECIPES[reversed]) {
        say("Bonnes briques… mais l’ordre compte. Inversez-les.", "hint");
        shake();
      } else {
        say("Aucune recette connue. Rien n’est perdu : vos exemplaires restent dans la réserve.", "fail");
        shake();
      }
    }

    $("#fuse").addEventListener("click", fuse);
    $("#clear").addEventListener("click", () => {
      if (busy) return;
      slots = [null, null];
      hideResult();
      renderSlots();
      renderTray();
      say("Table vidée. Les briques retournent dans votre réserve.");
    });

    renderTray();
    renderSlots();
    renderDiscoveries();
    if (store.hint && !found.has(store.hint.join("+"))) {
      const [a, b] = store.hint;
      say(["Indice : essayez ", chipEl(BRICKS[a].label, BRICKS[a].kind), " avec ", chipEl(BRICKS[b].label, BRICKS[b].kind), "."], "hint");
    }
  }

  /* ---------- Jaquettes de pli : neutres et Ambre uniquement, jamais liées au contenu ---------- */
  const JK = { ink: "#0f1f19", amber: "#f4b740", tint: "#fcecc6", deep: "#8f6200", cream: "#fffbf3", sand: "#e8dfcc" };
  const SERIF = "font-family=\"Iowan Old Style, Palatino Linotype, Palatino, Georgia, serif\"";
  const MONO = "font-family=\"ui-monospace, SFMono-Regular, Menlo, monospace\"";
  const svgArt = (bg, inner) => `<svg viewBox="0 0 182 254" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><rect width="182" height="254" fill="${bg}"/>${inner}</svg>`;
  const seeded = (seed) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const range = (from, to, step) => { const out = []; for (let v = from; v <= to; v += step) out.push(v); return out; };
  const JACKETS = [
    { id: "rosette", name: "Rosette", era: "Égypte · 196 av. J.-C.", idea: "Trois écritures pour un même texte : hiéroglyphes, démotique et grec.", art: () => {
      const glyphs = [
        (x, y) => `<circle cx="${x + 5}" cy="${y + 4}" r="3.2"/><path d="M${x + 5} ${y + 7}v7M${x + 1.5} ${y + 10}h7"/>`,
        (x, y) => `<path d="M${x} ${y + 6}q2.5-4 5 0t5 0M${x} ${y + 11}q2.5-4 5 0t5 0"/>`,
        (x, y) => `<path d="M${x} ${y + 7}q5-6 10 0q-5 6-10 0z"/><circle cx="${x + 5}" cy="${y + 7}" r="1.3" fill="${JK.ink}"/>`,
        (x, y) => `<path d="M${x + 5} ${y}v14M${x + 5} ${y + 2}q4 2 4 6"/>`,
      ];
      let i = 0;
      const hiero = [28, 50, 72].map((y) => range(24, 150, 21).map((x) => glyphs[(i++) % glyphs.length](x, y)).join("")).join("");
      const demotic = [104, 124, 144, 160].map((y) => range(22, 150, 26).map((x) => `<path d="M${x} ${y}c4-6 8 6 12 0s8-6 10 2"/>`).join("")).join("");
      const greek = ["ΒΑΣΙΛΕΥΟΝΤΟΣ ΤΟΥ", "ΝΕΟΥ ΚΑΙ ΠΑΡΑ", "ΛΑΒΟΝΤΟΣ ΤΗΝ"].map((t, k) => `<text x="24" y="${190 + k * 16}" ${SERIF} font-size="11.5" letter-spacing="1.2" fill="${JK.ink}">${t}</text>`).join("");
      return svgArt(JK.sand, `<path d="M12 14H146L170 40V242H12Z" fill="${JK.tint}" stroke="${JK.ink}" stroke-width="1.5"/><path d="M12 94H170M12 170H170" stroke="${JK.ink}" stroke-width="1.2"/><g fill="none" stroke="${JK.ink}" stroke-width="1.3" stroke-linecap="round">${hiero}</g><g fill="none" stroke="${JK.deep}" stroke-width="1.4" stroke-linecap="round">${demotic}</g>${greek}`);
    } },
    { id: "argile", name: "Argile", era: "Mésopotamie · vers −3000", idea: "Les premiers signes, pressés au calame dans une tablette d’argile.", art: () => {
      const rnd = seeded(7);
      const rows = range(30, 222, 16).map((y) => {
        let x = 24, out = "";
        while (x < 150) {
          out += rnd() < 0.7 ? `<path d="M${x} ${y}l7 3.5-7 3.5zM${x + 7} ${y + 3.5}h8"/>` : `<path d="M${x} ${y}l3.5 7 3.5-7zM${x + 3.5} ${y + 7}v5"/>`;
          x += 12 + Math.round(rnd() * 10);
        }
        return out + `<path d="M22 ${y + 12.5}H160" stroke="${JK.deep}" stroke-width=".8" fill="none"/>`;
      }).join("");
      return svgArt(JK.tint, `<rect x="14" y="14" width="154" height="226" rx="26" fill="${JK.amber}" stroke="${JK.ink}" stroke-width="1.5"/><g fill="${JK.ink}" stroke="${JK.ink}" stroke-width="1.1" stroke-linejoin="round">${rows}</g>`);
    } },
    { id: "aleph", name: "Aleph", era: "Phénicie · vers −1000", idea: "Une tête de bœuf devient une lettre, puis alpha, puis A.", art: () => svgArt(JK.amber, `
      <g fill="none" stroke="${JK.ink}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M32 36h24l-4 24q-8 9-16 0z"/><path d="M32 36c-6-11-14-13-20-7M56 36c6-11 14-13 20-7"/><path d="M39 45h.01M49 45h.01" stroke-width="4"/>
        <path d="M112 30l38 18M112 66l38-18M126 26v44"/>
      </g>
      <path d="M86 48h14M96 42l6 6-6 6" fill="none" stroke="${JK.ink}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="22" y="92" ${MONO} font-size="7.5" letter-spacing="1" fill="${JK.ink}">BŒUF</text>
      <text x="116" y="92" ${MONO} font-size="7.5" letter-spacing="1" fill="${JK.ink}">ALEPH</text>
      <text x="16" y="236" ${SERIF} font-size="84" font-weight="700" fill="${JK.ink}">Α</text>
      <path d="M86 206h14M96 200l6 6-6 6" fill="none" stroke="${JK.ink}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="108" y="236" ${SERIF} font-size="84" font-weight="700" fill="none" stroke="${JK.ink}" stroke-width="2">A</text>`) },
    { id: "boustrophedon", name: "Boustrophédon", era: "Grèce archaïque", idea: "Écrire comme le bœuf laboure : une ligne à l’endroit, la suivante à l’envers.", art: () => {
      const lines = range(34, 222, 22).map((y, k) => {
        const text = `<text x="26" y="${y + 4}" ${SERIF} font-size="12" textLength="130" lengthAdjust="spacingAndGlyphs" fill="${JK.ink}">ΕΤΥΜΟΝ ΛΟΓΟΣ ΓΡΑΦΗ</text>`;
        const turn = k % 2 === 0 ? `<path d="M160 ${y}a11 11 0 0 1 0 22" />` : `<path d="M22 ${y}a11 11 0 0 0 0 22" />`;
        return (k % 2 ? `<g transform="translate(182 0) scale(-1 1)">${text}</g>` : text) + turn;
      }).join("");
      return svgArt(JK.cream, `<g fill="none" stroke="${JK.deep}" stroke-width="2" stroke-linecap="round">${lines.replace(/<text[^]*?<\/text>/g, "")}</g>${lines.replace(/<path[^>]*\/>/g, "")}`);
    } },
    { id: "routes", name: "Routes des mots", era: "Méditerranée antique", idea: "Le voyage d’un mot, d’Athènes à Rome, puis jusqu’à Lutèce.", art: () => svgArt(JK.tint, `
      <g fill="${JK.cream}" stroke="${JK.ink}" stroke-width="1.3" stroke-linejoin="round">
        <path d="M-6 18C30 6 70 16 82 48C88 70 64 88 42 86C16 84-4 60-6 18Z"/>
        <path d="M86 74C100 86 110 108 120 130C126 144 134 152 126 160C116 152 106 138 98 122C90 106 82 90 86 74Z"/>
        <path d="M128 168C146 160 164 176 160 198C156 214 140 222 132 208C124 196 120 178 128 168Z"/>
        <path d="M160 132C174 126 190 138 190 150V178C176 176 164 164 160 132Z"/>
      </g>
      <path d="M146 192C136 160 116 132 106 112C92 86 70 70 44 50" fill="none" stroke="${JK.deep}" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="1 6"/>
      <g fill="${JK.amber}" stroke="${JK.ink}" stroke-width="1.5"><circle cx="146" cy="192" r="5"/><circle cx="106" cy="112" r="5"/><circle cx="44" cy="50" r="5"/></g>
      <g ${MONO} font-size="7" letter-spacing="1" fill="${JK.ink}"><text x="110" y="226">ATHÈNES</text><text x="116" y="104">ROMA</text><text x="54" y="46">LVTETIA</text></g>`) },
    { id: "arbre", name: "Arbre des langues", era: "Indo-européen", idea: "Une racine commune, des branches qui deviennent grec, latin, sanskrit…", art: () => {
      const leaves = [[34, 34, "grec"], [70, 22, "latin"], [112, 22, "gotique"], [150, 36, "sanskrit"], [24, 78, "gaulois"], [158, 80, "persan"]];
      return svgArt(JK.cream, `
        <g fill="none" stroke="${JK.ink}" stroke-linecap="round">
          <path d="M91 250V150" stroke-width="4"/>
          <path d="M91 150C91 110 60 90 34 34M91 150C90 100 76 60 70 22M91 150C92 100 108 60 112 22M91 150C92 110 124 90 150 36M91 150C80 120 50 100 24 78M91 150C102 120 132 104 158 80" stroke-width="2"/>
          <path d="M91 214C70 222 56 236 40 250M91 214C112 222 126 236 142 250M91 228C84 236 80 244 78 254M91 228C98 236 102 244 104 254" stroke-width="1.5"/>
        </g>
        <g fill="${JK.amber}" stroke="${JK.ink}" stroke-width="1.4">${leaves.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5"/>`).join("")}</g>
        <g ${SERIF} font-style="italic" font-size="9" fill="${JK.ink}">${leaves.map(([x, y, t]) => `<text x="${x}" y="${y + 16}" text-anchor="middle">${t}</text>`).join("")}</g>
        <text x="91" y="206" ${MONO} font-size="7.5" letter-spacing="1" text-anchor="middle" fill="${JK.deep}">*RACINE COMMUNE</text>`);
    } },
    { id: "lapidaire", name: "Lapidaire", era: "Rome · Ier siècle", idea: "Des capitales gravées dans la pierre : les paroles s’envolent, les écrits restent.", art: () => {
      const line = (t, y, size) => `<text x="92" y="${y + 1}" ${SERIF} font-size="${size}" letter-spacing="2.5" text-anchor="middle" fill="${JK.deep}">${t}</text><text x="91" y="${y}" ${SERIF} font-size="${size}" letter-spacing="2.5" text-anchor="middle" fill="${JK.ink}">${t}</text>`;
      return svgArt(JK.sand, `<rect x="14" y="14" width="154" height="226" fill="${JK.cream}" stroke="${JK.ink}" stroke-width="1.5"/><rect x="22" y="22" width="138" height="210" fill="none" stroke="${JK.deep}"/>${line("VERBA", 58, 17)}${line("·VOLANT·", 80, 13)}${line("SCRIPTA", 196, 17)}${line("·MANENT·", 218, 13)}`);
    } },
    { id: "casse", name: "Casse", era: "Mayence · 1455", idea: "Le casier du typographe, où chaque lettre a sa case.", art: () => {
      const letters = "abcdeéèfghijklmnopqrstuvxyzç&æœαβγλω".split("");
      let k = 0, cells = "";
      range(14, 214, 25).forEach((y) => {
        let x = 12;
        while (x < 164) {
          const w = (k % 7 === 3) ? 50 : 25;
          cells += `<rect x="${x}" y="${y}" width="${Math.min(w, 170 - x)}" height="25" fill="${JK.cream}" stroke="${JK.ink}"/><text x="${x + Math.min(w, 170 - x) / 2}" y="${y + 16}" ${MONO} font-size="10" text-anchor="middle" fill="${JK.ink}">${letters[k % letters.length]}</text>`;
          x += w; k++;
        }
      });
      return svgArt(JK.tint, `<rect x="10" y="12" width="162" height="229" fill="${JK.amber}" stroke="${JK.ink}" stroke-width="1.5"/>${cells}`);
    } },
    { id: "lettrine", name: "Lettrine", era: "Scriptorium · VIIIe siècle", idea: "L’initiale qui ouvre le texte, en version graphique.", art: () => {
      const right = range(30, 104, 10).map((y, i) => `<rect x="106" y="${y}" width="${[58, 52, 58, 44, 58, 50, 56, 38][i % 8]}" height="3" rx="1.5"/>`).join("");
      const below = range(122, 232, 10).map((y, i) => `<rect x="18" y="${y}" width="${[146, 138, 146, 120, 146, 132][i % 6]}" height="3" rx="1.5"/>`).join("");
      return svgArt(JK.cream, `<rect x="18" y="24" width="80" height="86" fill="${JK.amber}" stroke="${JK.ink}" stroke-width="1.5"/><rect x="24" y="30" width="68" height="74" fill="none" stroke="${JK.ink}" stroke-dasharray="1 4" stroke-linecap="round"/><text x="58" y="98" ${SERIF} font-size="62" font-weight="700" text-anchor="middle" fill="${JK.ink}">É</text><g fill="${JK.cream}" stroke="${JK.ink}" stroke-width="1.2"><circle cx="18" cy="24" r="4"/><circle cx="98" cy="24" r="4"/><circle cx="18" cy="110" r="4"/><circle cx="98" cy="110" r="4"/></g><g fill="${JK.ink}">${right}${below}</g>`);
    } },
    { id: "palimpseste", name: "Palimpseste", era: "Manuscrits réemployés", idea: "Un texte neuf écrit sur un texte ancien, gratté mais encore visible.", art: () => {
      const over = ["ETYMOLOGIA", "VERBVM · ORIGO", "SCRIPTA NOVA", "", "", "", "", "VETERA · SVBTER", "LITTERAE", "PALIMPSESTVS"].map((t, i) => t ? `<text x="20" y="${34 + i * 21}" ${SERIF} font-size="12.5" letter-spacing="1.5" fill="${JK.ink}">${t}</text>` : "").join("");
      return svgArt(JK.tint, `<g>${range(10, 180, 17).map((x) => `<text x="0" y="0" ${SERIF} font-size="12" letter-spacing="3" fill="${JK.amber}" transform="translate(${x} 250) rotate(-90)">ΛΟΓΟΣ · ΕΤΥΜΟΝ · ΓΡΑΦΗ · ΛΕΞΙΣ</text>`).join("")}</g><path d="M14 58c30-6 60 6 90 0s50-4 64 2M14 184c28 6 60-6 92 0s48 4 62-2" fill="none" stroke="${JK.deep}" stroke-width="1" stroke-linecap="round"/>${over}`);
    } },
  ];

  /* ---------- Plis ---------- */
  function initPacks() {
    const pkStage = $("#pkStage");
    const pkPack = $("#pkPack");
    const pkReveal = $("#pkReveal");
    const pkScribe = $("#pkScribe");
    const pkTagline = $("#pkTagline");
    const pkStatus = $("#pkStatus");
    const openBtn = $("#openPack");
    const ring = $("#ring");
    const timer = $("#timer");
    const CIRC = 163.36;
    const RECHARGE_MS = reduce ? 1200 : 7000;
    // Brouillons écrits puis barrés avant la forme finale : glyphes inventés, forme grecque, translittération.
    const PACK_DRAFTS = {
      bio: ["βίος", "bios"],
      geo: ["γεω", "geo"],
      logie: ["λογία", "logia"],
      graphie: ["γραφία", "graphia"],
      etymo: ["ἔτυμον", "etumon"],
      philo: ["φιλο", "filo"],
      astro: ["ἄστρον", "astron"],
      sophie: ["σοφία", "sofia"],
      nomie: ["νόμος", "nomia"],
    };
    const PACK_ORIGIN = {
      bio: "du grec ancien βίος « vie »",
      geo: "du grec ancien γῆ « terre »",
      logie: "du grec ancien λόγος « parole, discours »",
      graphie: "du grec ancien γράφειν « écrire »",
      etymo: "du grec ancien ἔτυμον « sens vrai »",
      philo: "du grec ancien φίλος « ami »",
      astro: "du grec ancien ἄστρον « astre »",
      sophie: "du grec ancien σοφία « sagesse »",
      nomie: "du grec ancien νόμος « loi »",
    };
    const INVENT = "ꜳꝏƺȣǂꞷʘƨƾȹꭥꝭꜧƕξψϡϟϠѦ";
    const randomOf = (list) => list[Math.floor(Math.random() * list.length)];
    const noise = (n) => Array.from({ length: n }, () => randomOf(INVENT)).join("");
    let packBusy = false;
    let skipPack = false;
    let packCount = store.packCount;
    let openedAt = 0;
    let ink = store.ink;
    // Garantie et filet se comptent par fascicule : chaque fascicule a son propre catalogue de plis.
    let fascN = null;
    const fasc = () => FASCICULES.find((f) => f.n === fascN);
    const POOL = () => fasc().pool;
    const fstate = (n) => (store.byFasc[n] ||= { sinceNew: 0, blocked: 0 });
    let sinceNew = 0;
    // Deux plis au plus en attente (ADR 0020) : une charge toutes les 12 h, le temps s'arrête à 2 / 2.
    const ENERGY_MAX = 2;
    let energy = store.energy ?? 0;
    function accrue() {
      while (energy < ENERGY_MAX && Date.now() >= store.nextPackAt) {
        energy += 1;
        if (energy < ENERGY_MAX) store.nextPackAt += RECHARGE_MS;
      }
    }
    accrue();
    const persist = () => {
      if (fascN) Object.assign(fstate(fascN), { sinceNew, blocked: blockedPacks });
      Object.assign(store, { packCount, ink, energy });
      saveStore();
    };
    const PITY = 6;
    // Filet : si la réserve ne permet plus aucune découverte, le 5ᵉ pli d'affilée donne une brique utile.
    const NET = 5;
    let blockedPacks = 0;
    const canDiscover = (extra) => RECIPE_KEYS.some((k) => !found.has(k) && k.split("+").every((id) => (copies[id] || 0) + (id === extra ? 1 : 0) >= 1));
    const HINT_COST = 30;
    // Chaque pli rapporte une base d'encre, plus le bonus d'un doublon (ADR 0019, 0020).
    const BASE_INK = 2;
    const drops_ = (n) => `${n} goutte${n > 1 ? "s" : ""}`;
    // Sabliers (ADR 0018, après le MVP) : 1 h de recharge chacun, 12 par 24 h glissantes, 36 détenus au plus.
    const HOUR_MS = RECHARGE_MS / 12;
    const DAY_MS = RECHARGE_MS * 2;
    const SAND_DAILY = 12;
    const SAND_CAP = 36;
    const SAND_INK = 1;
    const sandToday = () => store.sandLog.filter((t) => Date.now() - t < DAY_MS).length;

    const pause = (ms) => (skipPack || reduce ? Promise.resolve() : new Promise((resolve) => setTimeout(resolve, ms)));

    function setPackStatus(text) { pkStatus.textContent = text; }

    function updateEnergy() {
      $("#energyValue").textContent = `${energy} / ${ENERGY_MAX}`;
      const canOpen = energy >= 1 && !packBusy;
      openBtn.disabled = !canOpen;
      pkPack.disabled = !canOpen || pkStage.dataset.state !== "ready";
      paintChooserEnergy();
    }
    function paintChooserEnergy() {
      const box = $("#pkChooserEnergy");
      if (box) box.textContent = energy >= ENERGY_MAX ? `Énergie ${ENERGY_MAX} / ${ENERGY_MAX} : deux plis prêts.` : energy >= 1 ? `Énergie 1 / ${ENERGY_MAX} : un pli prêt · ${timer.textContent}.` : `Énergie 0 / ${ENERGY_MAX} · ${timer.textContent}.`;
      paintSand();
    }
    function paintSand() {
      const useBtn = $("#useSand");
      if (!useBtn) return;
      const used = sandToday();
      const remaining = store.nextPackAt - Date.now();
      const lost = Math.ceil(((HOUR_MS - remaining) / HOUR_MS) * 60);
      $("#sandValue").textContent = String(store.sand);
      useBtn.disabled = store.sand < 1 || energy >= ENERGY_MAX || packBusy || used >= SAND_DAILY;
      useBtn.textContent = store.sand < 1 ? "Aucun sablier"
        : energy >= ENERGY_MAX ? "Énergie pleine : rien à avancer"
        : used >= SAND_DAILY ? "Plafond du jour atteint"
        : energy === ENERGY_MAX - 1 && remaining < HOUR_MS ? `Terminer · ${lost} min perdue${lost > 1 ? "s" : ""}`
        : "Utiliser un sablier · −1 h";
      $("#sandDaily").textContent = used >= SAND_DAILY
        ? "Plafond du jour atteint : 12 h avancées sur 12 h. Le prochain pli arrive à son heure."
        : `Aujourd’hui : ${used} h avancée${used > 1 ? "s" : ""} sur ${SAND_DAILY} h.`;
      const inkBtn = $("#inkSand");
      inkBtn.disabled = ink < SAND_INK || store.sand >= SAND_CAP;
      inkBtn.textContent = store.sand >= SAND_CAP ? "Réserve de sabliers pleine" : `Sablier · ${drops_(SAND_INK)}`;
    }

    // Poids d'une brique : poids de sa rareté × poids de son type, partagé entre les briques de même rareté et de même type.
    function brickWeight(id) {
      const b = BRICKS[id];
      const siblings = POOL().filter((x) => BRICKS[x].rarity === b.rarity && BRICKS[x].kind === b.kind).length;
      return (RARITY[b.rarity].weight * TYPE_WEIGHT[b.kind]) / siblings;
    }
    function odds(ids) {
      const total = ids.reduce((sum, id) => sum + brickWeight(id), 0);
      return Object.fromEntries(ids.map((id) => [id, brickWeight(id) / total]));
    }
    function drawBrick() {
      const guaranteed = sinceNew >= PITY - 1;
      const unknown = POOL().filter((id) => !owned.includes(id));
      let pool = guaranteed && unknown.length ? unknown : POOL();
      if (!canDiscover() && blockedPacks >= NET - 1) {
        const useful = POOL().filter((id) => canDiscover(id));
        const missing = POOL().filter((id) => !copies[id] && RECIPE_KEYS.some((k) => !found.has(k) && k.split("+").includes(id)));
        pool = useful.length ? useful : missing.length ? missing : pool;
      }
      const p = odds(pool);
      let roll = Math.random();
      for (const id of pool) { roll -= p[id]; if (roll <= 0) return id; }
      return pool[pool.length - 1];
    }
    const pct = (x) => `${(x * 100).toFixed(x < 0.1 ? 1 : 0).replace(".", ",")} %`;
    function renderPool() {
      const p = odds(POOL());
      const byRarity = $("#pkRarity");
      byRarity.replaceChildren(...Object.entries(RARITY).map(([key, r]) => {
        const row = document.createElement("div");
        row.className = "pk-odd";
        const stars = rarityEl(key, false);
        const total = POOL().filter((id) => BRICKS[id].rarity === key).reduce((sum, id) => sum + p[id], 0);
        row.append(stars, r.label, Object.assign(document.createElement("b"), { textContent: pct(total) }));
        return row;
      }));
      const byType = $("#pkType");
      byType.replaceChildren(...["préfixe", "suffixe"].map((kind) => {
        const row = document.createElement("div");
        row.className = "pk-odd";
        const total = POOL().filter((id) => BRICKS[id].kind === kind).reduce((sum, id) => sum + p[id], 0);
        row.append(chipEl(kind === "préfixe" ? "Préfixes" : "Suffixes", kind), Object.assign(document.createElement("b"), { textContent: pct(total) }));
        return row;
      }));
      const list = $("#pkPool");
      // Les légendaires inconnues se regroupent en une ligne, sans nombre : le suspense reste entier (ADR 0015).
      const hiddenLegends = POOL().filter((id) => BRICKS[id].rarity === "legendaire" && !owned.includes(id));
      const legendRow = () => {
        const item = document.createElement("div");
        item.className = "pk-brickodd";
        const count = document.createElement("small");
        count.textContent = "légendaires inconnues";
        item.append(chipEl("?", "mot", true), rarityEl("legendaire", true), count, Object.assign(document.createElement("b"), { textContent: pct(hiddenLegends.reduce((sum, id) => sum + p[id], 0)) }));
        return item;
      };
      const rows = POOL().filter((id) => !hiddenLegends.includes(id)).sort((a, b) => p[b] - p[a]).map((id) => {
        const item = document.createElement("div");
        item.className = "pk-brickodd";
        const known = owned.includes(id);
        const chip = known ? chipEl(BRICKS[id].label, BRICKS[id].kind) : chipEl("?", BRICKS[id].kind, true);
        const stars = rarityEl(BRICKS[id].rarity, true);
        const count = document.createElement("small");
        count.textContent = known ? (copies[id] ? `×${copies[id]} / ${CAP}` : "épuisée") : "inconnue";
        item.append(chip, stars, count, Object.assign(document.createElement("b"), { textContent: pct(p[id]) }));
        return item;
      });
      if (hiddenLegends.length) rows.push(legendRow());
      list.replaceChildren(...rows);
      const left = PITY - 1 - sinceNew;
      const unknownLeft = POOL().some((id) => !owned.includes(id));
      $("#pkPity").textContent = unknownLeft
        ? (left <= 0 ? "Le prochain pli contient une brique nouvelle, garanti." : `Brique nouvelle garantie dans ${left + 1} plis au plus.`)
        : "Toutes les briques de ce fascicule sont connues : chaque pli remplit votre réserve.";
      const blocked = !canDiscover() && found.size < RECIPE_KEYS.length;
      const netLeft = Math.max(1, NET - blockedPacks);
      const canHelp = POOL().some((id) => canDiscover(id));
      $("#pkNet").textContent = blocked && !canHelp
        ? "Aucune brique de ce fascicule ne rend une découverte possible : choisissez un autre fascicule."
        : blocked
        ? (netLeft === 1 ? "Votre réserve ne permet plus aucune découverte : le prochain pli contient une brique utile, garanti." : `Votre réserve ne permet plus aucune découverte : brique utile garantie dans ${netLeft} plis au plus.`)
        : `Filet : si votre réserve ne permet plus aucune découverte, une brique utile arrive au plus tard au ${NET}ᵉ pli.`;
      $("#pkPityBar").style.width = `${Math.min(100, (sinceNew / (PITY - 1)) * 100)}%`;
      $("#inkValue").textContent = String(ink);
      const hintBtn = $("#buyHint");
      hintBtn.disabled = ink < HINT_COST;
    }

    // La jaquette est celle du fascicule choisi : elle ne dit rien de la brique tirée à l'ouverture.
    const jacketOf = (f) => JACKETS.find((jk) => jk.id === f.jacket);
    function applyJacket(jk) {
      $$(".pk-art", pkPack).forEach((art) => { art.innerHTML = jk.art(); });
      $$(".pk-bottom", pkPack).forEach((label) => { label.textContent = `${fasc().label} · ${jk.name}`; });
      $$("#jkGrid .jk").forEach((btn) => btn.setAttribute("aria-pressed", String(btn.dataset.jacket === jk.id)));
    }
    const chooser = $("#pkChooser");
    const layout = $("#pkLayout");
    const current = $("#pkCurrent");
    function selectFascicule(n) {
      if (packBusy) return;
      if (fascN) Object.assign(fstate(fascN), { sinceNew, blocked: blockedPacks });
      fascN = n;
      ({ sinceNew, blocked: blockedPacks } = fstate(n));
      chooser.hidden = true;
      layout.hidden = false;
      layout.classList.add("in");
      const jk = jacketOf(fasc());
      $("b", current).textContent = `${fasc().label} · jaquette « ${jk.name} »`;
      current.hidden = false;
      renderPool();
      renderHint();
      showPack(energy >= 1 ? "ready" : "recharging");
      current.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
    function showChooser() {
      if (packBusy) return;
      persist();
      fascN = null;
      layout.hidden = true;
      current.hidden = true;
      renderChooser();
      chooser.hidden = false;
      chooser.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
    $("button", current).addEventListener("click", showChooser);
    function renderChooser() {
      const list = $("#pkFascList");
      list.replaceChildren(...FASCICULES.map((f) => {
        const jk = jacketOf(f);
        // Les légendaires inconnues ne comptent pas : leur nombre reste secret (ADR 0015).
        const counted = f.pool.filter((id) => BRICKS[id].rarity !== "legendaire");
        const known = counted.filter((id) => owned.includes(id)).length;
        const legends = f.pool.filter((id) => BRICKS[id].rarity === "legendaire" && owned.includes(id)).length;
        const reserve = f.pool.reduce((sum, id) => sum + (copies[id] || 0), 0);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pk-fasc";
        const mini = document.createElement("span");
        mini.className = "jk-mini";
        const art = document.createElement("span");
        art.className = "jk-art";
        art.innerHTML = jk.art();
        mini.append(art);
        const info = document.createElement("span");
        info.className = "pk-fasc-info";
        info.append(
          Object.assign(document.createElement("span"), { className: "pk-fasc-k", textContent: `${f.when} · jaquette « ${jk.name} »` }),
          Object.assign(document.createElement("b"), { textContent: f.label }),
          Object.assign(document.createElement("span"), { textContent: `${known} / ${counted.length} briques connues · ${reserve} exemplaires en réserve` }),
        );
        if (legends) {
          const note = document.createElement("span");
          note.className = "cb-legend";
          note.append(rarityEl("legendaire"), `${legends}\u00a0légendaire${legends > 1 ? "s" : ""} trouvée${legends > 1 ? "s" : ""}`);
          info.append(note);
        }
        info.append(Object.assign(document.createElement("span"), { className: "pk-fasc-go", textContent: "Ouvrir un pli de ce fascicule →" }));
        btn.append(mini, info);
        btn.setAttribute("aria-label", `${f.label}, jaquette ${jk.name} : ${known} briques connues sur ${counted.length}. Ouvrir un pli de ce fascicule`);
        btn.addEventListener("click", () => selectFascicule(f.n));
        return btn;
      }), (() => {
        const next = document.createElement("div");
        next.className = "pk-fasc is-next";
        next.append(Object.assign(document.createElement("span"), { className: "jk-mini is-empty" }), Object.assign(document.createElement("span"), { className: "pk-fasc-info" }));
        next.lastChild.append(
          Object.assign(document.createElement("span"), { className: "pk-fasc-k", textContent: `${NEXT_FASCICULE.when} · à paraître` }),
          Object.assign(document.createElement("b"), { textContent: NEXT_FASCICULE.label }),
          Object.assign(document.createElement("span"), { textContent: "Son contenu ne sera révélé qu’à sa parution." }),
        );
        return next;
      })());
    }
    function renderGallery() {
      const grid = $("#jkGrid");
      if (!grid) return;
      grid.replaceChildren(...JACKETS.map((jk, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "jk";
        btn.dataset.jacket = jk.id;
        btn.setAttribute("role", "listitem");
        btn.setAttribute("aria-pressed", "false");
        const mini = document.createElement("span");
        mini.className = "jk-mini";
        const art = document.createElement("span");
        art.className = "jk-art";
        art.innerHTML = jk.art();
        mini.append(art);
        const f = FASCICULES.find((x) => x.jacket === jk.id);
        const num = `Fascicule n° ${String(i + 1).padStart(2, "0")}${f ? "" : " · à paraître"}`;
        if (!f) btn.classList.add("is-future");
        btn.setAttribute("aria-label", f ? `Ouvrir un pli du ${f.label}, jaquette ${jk.name} (${jk.era})` : `Jaquette ${jk.name} (${jk.era}), fascicule à paraître`);
        const info = [["span", "jk-num", num], ["b", "", jk.name], ["span", "jk-era", jk.era], ["span", "jk-idea", jk.idea]].map(([tag, cls, text]) => Object.assign(document.createElement(tag), { className: cls, textContent: text }));
        btn.append(mini, ...info);
        btn.addEventListener("click", () => {
          if (pkStage.dataset.state === "opening") return;
          if (f) selectFascicule(f.n);
          else showToast(`${num.replace(" · à paraître", "")} : à paraître. Sa jaquette sera « ${jk.name} ».`);
        });
        return btn;
      }));
    }

    function renderHint() {
      const box = $("#pkHint");
      if (!store.hint || found.has(store.hint.join("+"))) { box.hidden = true; return; }
      const [a, b] = store.hint;
      const link = Object.assign(document.createElement("a"), { className: "xref", href: "jeu.html#table", textContent: "Essayer sur la table" });
      box.replaceChildren("Indice : ", chipEl(BRICKS[a].label, BRICKS[a].kind), " avec ", chipEl(BRICKS[b].label, BRICKS[b].kind), ". ", link);
      box.hidden = false;
    }

    function formatHours(seconds) {
      const total = Math.max(0, Math.round(seconds));
      const h = String(Math.floor(total / 3600)).padStart(2, "0");
      const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
      const sec = String(total % 60).padStart(2, "0");
      return `${h}:${m}:${sec}`;
    }

    function setPackNumber() {
      $$(".pk-num", pkPack).forEach((n) => { n.textContent = `Pli n° ${String(packCount + 1).padStart(2, "0")}`; });
    }

    function showPack(state) {
      delete pkStage.dataset.rarity;
      applyJacket(jacketOf(fasc()));
      pkStage.classList.add("pk-no-trans");
      pkStage.classList.remove("pk-charging", "pk-writing", "pk-burst", "pk-revealed");
      pkReveal.hidden = true;
      pkTagline.textContent = state === "ready" ? "une racine attend d’être écrite…" : "l’encre sèche…";
      pkScribe.replaceChildren();
      setPackNumber();
      pkStage.dataset.state = state;
      void pkStage.offsetWidth;
      pkStage.classList.remove("pk-no-trans");
      if (!reduce) {
        pkStage.classList.remove("pk-entering");
        void pkStage.offsetWidth;
        pkStage.classList.add("pk-entering");
        setTimeout(() => pkStage.classList.remove("pk-entering"), 850);
      }
      setPackStatus(state === "ready" ? "Touchez le pli pour l’ouvrir" : "Pli en recharge…");
      openBtn.textContent = state === "ready" ? "Ouvrir le pli" : "Recharge en cours…";
      updateEnergy();
    }

    let recharging = false;
    function recharge() {
      if (recharging) return;
      recharging = true;
      const frame = () => {
        const before = energy;
        accrue();
        if (energy !== before) {
          persist();
          if (fascN && pkStage.dataset.state === "recharging") showPack("ready");
          else if (pkStage.dataset.state === "revealed" && !packBusy) openBtn.textContent = "Ouvrir un nouveau pli";
          updateEnergy();
        }
        if (energy >= ENERGY_MAX) {
          recharging = false;
          ring.style.strokeDashoffset = "0";
          timer.textContent = "Deux plis prêts";
          paintChooserEnergy();
          return;
        }
        const p = Math.min(1, 1 - (store.nextPackAt - Date.now()) / RECHARGE_MS);
        ring.style.strokeDashoffset = String(CIRC * (1 - p));
        timer.textContent = `Prochain pli dans ${formatHours((1 - p) * 12 * 3600)}`;
        paintChooserEnergy();
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }

    async function writeLine(text, final, kind) {
      [...pkScribe.children].forEach((line) => line.classList.add("old"));
      while (pkScribe.children.length > 2) pkScribe.firstElementChild.remove();
      const line = document.createElement("span");
      line.className = final ? "sc-line final" : "sc-line";
      if (kind) { line.classList.add("sc-brick"); line.dataset.kind = kind; }
      const caret = document.createElement("span");
      caret.className = "sc-caret";
      line.append(caret);
      pkScribe.append(line);
      for (const ch of [...text]) {
        const glyph = document.createElement("span");
        glyph.className = "sc-ch flick";
        glyph.textContent = randomOf(INVENT);
        line.insertBefore(glyph, caret);
        await pause(10);
        glyph.textContent = randomOf(INVENT);
        await pause(10);
        glyph.textContent = ch;
        glyph.classList.remove("flick");
        await pause(final ? 22 : 4);
      }
      caret.remove();
      return line;
    }

    function glyphBurst() {
      if (reduce) return;
      const colors = ["var(--c-pli)", "var(--c-pli-deep)", "var(--c-action)", "var(--ink)"];
      const letters = `${INVENT}αβγδλμπσωΩΛ`;
      for (let i = 0; i < 26; i++) {
        const g = document.createElement("span");
        g.className = "pk-glyph";
        g.textContent = randomOf([...letters]);
        const angle = Math.random() * Math.PI * 2;
        const dist = 140 + Math.random() * 220;
        g.style.setProperty("--c", colors[i % colors.length]);
        g.style.setProperty("--s", `${16 + Math.random() * 22}px`);
        g.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
        g.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
        g.style.setProperty("--r", `${Math.random() * 540 - 270}deg`);
        pkStage.append(g);
        setTimeout(() => g.remove(), 1300);
      }
    }

    function buildReveal(id, isNew, gained, back, full) {
      const data = BRICKS[id];
      const r = RARITY[data.rarity];
      const kicker = document.createElement("p");
      kicker.className = "pk-kicker";
      kicker.textContent = isNew ? (data.rarity === "legendaire" ? "Légendaire !" : data.rarity === "rare" ? "Rare !" : "Nouvelle brique !")
        : full ? `Réserve pleine · ×${CAP}` : back ? "De retour !" : `+1 exemplaire · ×${copies[id]}`;
      const brick = brickEl("div", data.label, data.kind, data.gloss);
      brick.classList.add("pk-brick");
      if (!isNew) brick.classList.add("is-dup");
      const rarity = document.createElement("p");
      rarity.className = "pk-rarity";
      const stars = rarityEl(data.rarity, false);
      rarity.append(stars, r.label);
      const nodes = [kicker, brick, rarity];
      if (isNew) {
        const origin = document.createElement("p");
        origin.className = "pk-origin";
        origin.textContent = nbsp(PACK_ORIGIN[id]);
        const drops = Object.assign(document.createElement("p"), { className: "pk-ink", textContent: `+${drops_(gained)} d’encre` });
        nodes.push(origin, drops);
      } else {
        const drops = document.createElement("p");
        drops.className = "pk-ink";
        drops.textContent = full ? `+${drops_(gained)} d’encre` : `Réserve : ×${copies[id]} / ${CAP} · +${drops_(gained)}`;
        nodes.push(drops);
      }
      const actions = document.createElement("div");
      actions.className = "pk-actions";
      const toTable = document.createElement("a");
      toTable.className = "btn btn-secondary";
      toTable.href = "jeu.html#table";
      toTable.textContent = "Essayer sur la table →";
      const again = document.createElement("button");
      again.type = "button";
      again.className = "btn btn-secondary";
      again.textContent = "Continuer";
      again.addEventListener("click", (event) => {
        event.stopPropagation();
        showPack(energy >= 1 ? "ready" : "recharging");
      });
      actions.append(toTable);
      const cardId = byWord.get(data.label);
      if (cardId) actions.append(Object.assign(document.createElement("a"), { className: "btn btn-secondary", href: `codex.html#carte-${cardId}`, textContent: "Voir la carte" }));
      actions.append(again);
      nodes.push(actions);
      pkReveal.replaceChildren(...nodes);
    }

    function renderHistory() {
      const history = $("#pkHistory");
      if (!store.history.length) {
        history.replaceChildren(Object.assign(document.createElement("span"), { className: "pk-empty", textContent: "Aucun pli ouvert pour l’instant." }));
        return;
      }
      history.replaceChildren(...store.history.map((h) => {
        const item = document.createElement("div");
        item.className = h.isNew ? "pk-hist-item" : "pk-hist-item dup";
        const n = `n° ${String(h.n).padStart(2, "0")}${h.f ? ` · fasc. ${String(h.f).padStart(2, "0")}` : ""}`;
        const meta = document.createElement("small");
        const full = h.full ?? h.gained > 0;
        const plus = h.gained ? ` · +${drops_(h.gained)}` : "";
        meta.textContent = h.isNew ? `Nouvelle${plus} · ${n}` : full ? `Pleine${plus} · ${n}` : `+1 · ×${h.copies}${plus} · ${n}`;
        item.append(chipEl(BRICKS[h.id].label, BRICKS[h.id].kind), rarityEl(BRICKS[h.id].rarity, true), meta);
        return item;
      }));
    }

    function addHistory(id, isNew, gained, full) {
      store.history.unshift({ id, isNew, gained, full, n: packCount, copies: copies[id], f: fascN });
      store.history.length = Math.min(store.history.length, 6);
      renderHistory();
    }

    async function openPack() {
      if (packBusy || energy < 1 || !fascN) return;
      packBusy = true;
      skipPack = false;
      if (energy >= ENERGY_MAX) store.nextPackAt = Date.now() + RECHARGE_MS;
      energy -= 1;
      if (pkStage.dataset.state !== "ready") showPack("ready");
      const wasBlocked = !canDiscover();
      const id = drawBrick();
      blockedPacks = wasBlocked ? blockedPacks + 1 : 0;
      const isNew = !owned.includes(id);
      const back = !isNew && !copies[id];
      const rarityKey = BRICKS[id].rarity;
      pkStage.dataset.rarity = rarityKey;
      pkStage.dataset.state = "opening";
      openedAt = performance.now();
      openBtn.textContent = "Ouverture…";
      updateEnergy();
      setPackStatus("Touchez pour passer");

      pkStage.classList.add("pk-charging");
      await pause(260);
      pkStage.classList.replace("pk-charging", "pk-writing");
      pkScribe.replaceChildren();
      const drafts = [noise(4), ...PACK_DRAFTS[id]];
      for (const draft of drafts) {
        const line = await writeLine(draft, false);
        await pause(60);
        line.classList.add("struck");
        await pause(110);
      }
      const finalLine = await writeLine(BRICKS[id].label, true, BRICKS[id].kind);
      finalLine.classList.add("inked");
      await pause(130);

      pkStage.classList.replace("pk-writing", "pk-burst");
      glyphBurst();
      await pause(260);
      packCount += 1;
      let gained = BASE_INK;
      let full = false;
      if (isNew) {
        owned.push(id);
        copies[id] = 1;
        sinceNew = 0;
      } else {
        full = copies[id] >= CAP;
        gained += full ? RARITY[rarityKey].ink : RARITY[rarityKey].dupInk;
        if (!full) copies[id] += 1;
        sinceNew += 1;
      }
      ink += gained;
      if (canDiscover()) blockedPacks = 0;
      buildReveal(id, isNew, gained, back, full);
      pkReveal.hidden = false;
      pkStage.classList.add("pk-revealed");
      pkStage.dataset.state = "revealed";
      if (isNew) {
        setPackStatus(`Ajoutée à votre réserve et à votre codex · +${drops_(gained)} d’encre`);
      } else {
        setPackStatus(full ? `Réserve pleine : +${drops_(gained)} d’encre` : `+1 exemplaire : ×${copies[id]} dans votre réserve · +${drops_(gained)} d’encre`);
      }
      addHistory(id, isNew, gained, full);
      persist();
      renderPool();
      packBusy = false;
      openBtn.textContent = energy >= 1 ? "Ouvrir un nouveau pli" : "Recharge en cours…";
      updateEnergy();
      recharge();
    }

    $("#buyHint").addEventListener("click", () => {
      if (ink < HINT_COST) return;
      const next = RECIPE_KEYS.find((k) => !found.has(k) && k.split("+").every((id) => copies[id] > 0));
      if (!next) { showToast("Aucun indice possible avec votre réserve : ouvrez d’autres plis"); return; }
      ink -= HINT_COST;
      store.hint = next.split("+");
      persist();
      renderHint();
      showToast(`Indice envoyé sur la table · −${HINT_COST} gouttes`);
      renderPool();
    });

    $("#useSand").addEventListener("click", () => {
      if (store.sand < 1 || energy >= ENERGY_MAX || packBusy || sandToday() >= SAND_DAILY) return;
      store.sand -= 1;
      store.sandLog = [...store.sandLog.filter((t) => Date.now() - t < DAY_MS), Date.now()];
      store.nextPackAt -= HOUR_MS;
      recharge();
      persist();
      paintSand();
      showToast("Recharge avancée d’une heure · −1 sablier");
    });

    $("#inkSand").addEventListener("click", () => {
      if (ink < SAND_INK || store.sand >= SAND_CAP) return;
      ink -= SAND_INK;
      store.sand += 1;
      persist();
      renderPool();
      paintSand();
      showToast(`+1 sablier · −${SAND_INK} gouttes`);
    });

    pkPack.addEventListener("click", openPack);
    openBtn.addEventListener("click", openPack);
    pkStage.addEventListener("click", () => {
      if (pkStage.dataset.state === "opening" && performance.now() - openedAt > 200) skipPack = true;
    });
    document.addEventListener("keydown", (event) => {
      if (pkStage.dataset.state === "opening" && (event.key === "Escape" || event.key === " ")) { skipPack = true; event.preventDefault(); }
    });
    renderHistory();
    renderGallery();
    renderChooser();
    updateEnergy();
    recharge();
  }

  /* ---------- Textures des cartes (ADR 0023) ----------
     Une silhouette pleine par carte découverte, sur une grille 300 × 400 recadrée par la carte.
     Une seule teinte : currentColor (Encre, ou Papier en nocturne), opacité portée par .card-art.
     Les détails sont évidés dans la couleur du fond de la carte (--art-bg), jamais dans un second ton. */
  const cardArt = (() => {
    const r1 = (n) => Math.round(n * 10) / 10;
    const line = (pts) => "M" + pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join("L");
    const seg = ([a, b], [c, d]) => `M${r1(a)} ${r1(b)}L${r1(c)} ${r1(d)}`;
    const F = 'fill="currentColor"';
    const S = (w) => `fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
    const CUT = (w) => `fill="none" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--art-bg)"`;
    const HOLE = 'style="fill:var(--art-bg)"';
    let uid = 0;
    const ART = {
      // Mots
      biologie() {
        const len = 560, amp = 74, turns = 2.1, a = (-70 * Math.PI) / 180, k = (turns * 2 * Math.PI) / len;
        const P = (u, v) => [235 + u * Math.cos(a) - v * Math.sin(a), 285 + u * Math.sin(a) + v * Math.cos(a)];
        const off = (u) => amp * Math.sin(k * u);
        const us = Array.from({ length: 97 }, (_, i) => -len / 2 + (len * i) / 96);
        const n = Math.round(turns * 8);
        const rungs = Array.from({ length: n }, (_, i) => -len / 2 + (len * (i + 0.5)) / n).map((u) => seg(P(u, off(u) * 0.86), P(u, -off(u) * 0.86))).join("");
        return `<path d="${rungs}" ${S(9)}/><path d="${line(us.map((u) => P(u, off(u))))}${line(us.map((u) => P(u, -off(u))))}" ${S(24)}/>`;
      },
      etymologique() {
        return `<g transform="translate(78 16) rotate(32 150 250)"><circle cx="150" cy="110" r="62" ${F}/><circle cx="150" cy="110" r="24" ${HOLE}/>
          <rect x="134" y="160" width="32" height="232" rx="10" ${F}/><rect x="150" y="318" width="54" height="26" rx="6" ${F}/><rect x="150" y="356" width="40" height="26" rx="6" ${F}/>
          <path d="M150 190L150 300" ${CUT(5)}/></g>`;
      },
      etymologie() {
        return `<g transform="translate(18 0)"><rect x="167" y="70" width="46" height="196" rx="14" ${F}/>
          <path d="M190 240C160 290 110 300 60 350M190 240C200 300 170 360 150 430M190 240C230 290 280 300 330 330M190 240C220 320 250 370 260 430M190 240C150 270 100 260 40 280" ${S(18)}/>
          <path d="M120 322C100 340 90 370 96 400M270 316C290 340 300 380 296 420M80 272C60 300 30 320 0 326" ${S(9)}/>
          <path d="M184 90L184 200M198 120L198 230" ${CUT(4)}/></g>`;
      },
      philosophie() {
        // Buste de penseur grec, de profil : crâne, nez, barbe, himation.
        return `<g transform="translate(-16 -6)">
          <path d="M96 430C104 352 164 318 230 318C300 318 344 360 344 430Z" ${F}/>
          <rect x="206" y="214" width="56" height="112" rx="14" ${F}/>
          <circle cx="228" cy="164" r="64" ${F}/>
          <path d="M170 142L146 188L172 194Z" ${F}/>
          <path d="M168 196C160 244 182 294 216 304C252 300 274 266 276 224C252 238 212 236 168 196Z" ${F}/>
          <path d="M238 118C256 116 272 128 276 146M252 156C266 158 278 170 280 186M226 104C236 94 252 92 264 98" ${CUT(5)}/>
          <path d="M186 164L200 162M186 214C200 226 214 230 232 228M190 244C204 262 222 272 244 270" ${CUT(4)}/>
          <path d="M130 372C170 352 212 360 246 396M190 334C232 344 268 376 290 430M262 332C286 346 316 362 340 368" ${CUT(5)}/></g>`;
      },
      geographie() {
        const id = `ca${++uid}`;
        return `<defs><clipPath id="${id}"><circle cx="220" cy="270" r="116"/></clipPath></defs>
          <circle cx="220" cy="270" r="128" ${S(14)}/>
          <g clip-path="url(#${id})" ${F}>
            <path d="M205 250C235 245 262 262 268 292C272 320 250 345 238 372C230 390 212 386 208 360C204 336 190 318 186 296C182 272 186 254 205 250Z"/>
            <path d="M188 166C214 152 252 160 266 182C254 200 230 206 214 224C196 216 176 196 188 166Z"/>
            <path d="M282 180C310 176 340 196 340 226C322 236 300 226 286 214C278 204 274 190 282 180Z"/>
            <path d="M108 262C130 254 150 274 146 302C142 334 124 360 110 374C100 344 94 298 108 262Z"/>
            <path d="M104 150C136 132 168 144 166 172C158 200 132 216 114 236C98 214 92 178 104 150Z"/>
            <path d="M92 270C120 300 150 340 160 400M300 250C320 280 336 300 350 310" ${CUT(4)}/>
          </g>
          <path d="M220 142C180 190 180 350 220 398M220 142C260 190 260 350 220 398M100 230C160 250 280 250 340 230M100 310C160 290 280 290 340 310" ${CUT(4)}/>`;
      },
      geologie() {
        const wave = (y, d) => `M-10 ${y}C40 ${y - 10} 80 ${y + 8} 130 ${y}C150 ${y - 3} 165 ${y - 4} 178 ${y}M186 ${y + d}C220 ${y + d - 10} 270 ${y + d + 8} 320 ${y + d}`;
        return `<path d="M-10 190C50 170 110 196 170 178C220 164 270 188 320 176L320 420L-10 420Z" ${F}/>
          <path d="${wave(234, 18)}${wave(282, 18)}${wave(328, 18)}${wave(372, 18)}" ${CUT(7)}/>
          <path d="M196 170L168 420" ${CUT(6)}/>
          <circle cx="90" cy="306" r="7" ${HOLE}/><circle cx="118" cy="300" r="4" ${HOLE}/><circle cx="250" cy="352" r="6" ${HOLE}/><circle cx="276" cy="258" r="5" ${HOLE}/>`;
      },
      philologie() {
        const book = (x, y, w, h, rot) => `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" ${F}/>
          <path d="M${x + 24} ${y + 5}L${x + 24} ${y + h - 5}M${x + w - 24} ${y + 5}L${x + w - 24} ${y + h - 5}" ${CUT(6)}/>
          <path d="M${x + 44} ${y + h / 2}L${x + w - 44} ${y + h / 2}" ${CUT(4)}/></g>`;
        return `${book(76, 350, 260, 52, -2)}${book(100, 292, 220, 50, 4)}${book(64, 236, 240, 50, -5)}${book(118, 182, 190, 46, 3)}`;
      },
      biographie() {
        const id = `ca${++uid}`;
        return `<defs><clipPath id="${id}"><ellipse cx="215" cy="272" rx="74" ry="99"/></clipPath></defs>
          <path d="M215 160C200 124 168 118 178 96C188 76 215 100 215 150C215 100 242 76 252 96C262 118 230 124 215 160" ${S(9)}/>
          <ellipse cx="215" cy="272" rx="96" ry="122" ${F}/><ellipse cx="215" cy="272" rx="74" ry="99" ${HOLE}/>
          <ellipse cx="215" cy="272" rx="85" ry="110" ${CUT(4)}/>
          <path clip-path="url(#${id})" d="M236 196C266 196 284 220 284 250C284 268 276 282 266 290L270 322C288 328 300 340 306 380L140 380C146 348 166 330 192 322L198 304C188 302 182 294 182 286L172 282L180 272L174 260C178 226 202 196 236 196Z" ${F}/>`;
      },
      // Préfixes
      bio() {
        return `<g transform="rotate(6 200 300)"><path d="M196 440C190 380 200 300 188 200" ${S(18)}/>
          <path d="M192 300C150 232 92 214 44 222C74 282 132 318 192 300Z" ${F}/>
          <path d="M190 236C222 160 278 128 330 124C318 196 262 244 190 236Z" ${F}/>
          <path d="M187 204C166 164 170 124 196 92C222 128 216 170 187 204Z" ${F}/>
          <path d="M184 292C150 262 110 246 70 236M194 228C232 196 272 164 312 142M188 192C188 164 192 138 196 112" ${CUT(5)}/></g>`;
      },
      philo() {
        return `<g transform="translate(30 30) rotate(-12 200 270)"><path d="M200 380C130 330 70 280 70 214C70 170 104 140 144 140C170 140 190 154 200 176C210 154 230 140 256 140C296 140 330 170 330 214C330 280 270 330 200 380Z" ${F}/>
          <path d="M112 206C112 184 128 170 148 170" ${CUT(5)}/></g>`;
      },
      geo() {
        return `<path d="M-20 430L88 250L134 300L214 168L330 356L330 430Z" ${F}/>
          <path d="M60 296L88 250L112 276M180 222L214 168L246 220L228 214L214 230L198 212Z" ${CUT(5)}/>
          <path d="M40 360C90 344 140 372 200 350C240 336 280 352 320 340" ${CUT(5)}/>`;
      },
      etymo() {
        return `<path d="M212 -10L212 170" ${S(6)}/><rect x="162" y="168" width="100" height="30" rx="8" ${F}/>
          <path d="M150 208L274 208C274 258 244 306 212 372C180 306 150 258 150 208Z" ${F}/>
          <path d="M168 232L256 232" ${CUT(5)}/><path d="M212 250L212 330" ${CUT(4)}/>`;
      },
      // Suffixes
      logie() {
        let lines = "";
        for (let i = 0; i < 5; i++) {
          const y = 268 + i * 24;
          lines += `M58 ${y}C98 ${y - 9} 140 ${y - 8} 170 ${y + 4}M200 ${y + 4}C230 ${y - 8} 272 ${y - 9} 312 ${y}`;
        }
        return `<g transform="rotate(-10 185 320)"><path d="M185 244C146 216 88 212 34 226L34 404C88 390 146 394 185 420C224 394 282 390 336 404L336 226C282 212 224 216 185 244Z" ${F}/>
          <path d="M185 250L185 416" ${CUT(6)}/><path d="${lines}" ${CUT(5)}/></g>`;
      },
      sophie() {
        let v = "";
        for (let row = 0; row < 4; row++) for (let i = 0; i < 4 - (row % 2); i++) {
          const x = 168 + i * 30 + (row % 2) * 15, y = 300 + row * 26;
          v += `M${x - 9} ${y}L${x} ${y + 9}L${x + 9} ${y}`;
        }
        return `<g transform="translate(20 0)"><path d="M130 190L140 130L178 168C196 162 216 162 234 168L272 130L282 190C300 220 306 252 304 290C300 370 256 420 206 420C156 420 112 370 108 290C106 252 112 220 130 190Z" ${F}/>
          <circle cx="170" cy="224" r="30" ${HOLE}/><circle cx="242" cy="224" r="30" ${HOLE}/>
          <circle cx="174" cy="226" r="12" ${F}/><circle cx="238" cy="226" r="12" ${F}/>
          <path d="M206 240L196 262L206 278L216 262Z" ${HOLE}/><path d="${v}" ${CUT(4)}/></g>`;
      },
      graphie() {
        return `<path d="M24 386C64 362 96 398 136 372C160 356 178 360 196 372" ${S(9)}/>
          <g transform="translate(80 -6) rotate(30 150 230)"><rect x="122" y="40" width="56" height="290" rx="10" ${F}/><path d="M122 330L178 330L150 404Z" ${F}/>
          <path d="M126 92L174 92M126 108L174 108" ${CUT(5)}/><path d="M124 330L150 346L176 330" ${CUT(5)}/><path d="M140 384L160 384" ${CUT(5)}/><path d="M150 124L150 314" ${CUT(4)}/></g>`;
      },
      // Langues
      francais() {
        let petals = "", spokes = "";
        for (let i = 0; i < 12; i++) {
          const t = (i / 12) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t);
          petals += `<circle cx="${r1(215 + 76 * c)}" cy="${r1(275 + 76 * s)}" r="17" ${HOLE}/>`;
          spokes += seg([215 + 46 * c, 275 + 46 * s], [215 + 128 * c, 275 + 128 * s]);
        }
        return `<circle cx="215" cy="275" r="138" ${F}/><path d="${spokes}" ${CUT(6)}/>
          <circle cx="215" cy="275" r="104" ${CUT(6)}/><circle cx="215" cy="275" r="46" ${CUT(6)}/>${petals}<circle cx="215" cy="275" r="18" ${HOLE}/>`;
      },
      latin() {
        const arch = (x, w, top, bottom) => `M${x} ${bottom}L${x} ${top + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x + w} ${top + w / 2}L${x + w} ${bottom}Z`;
        let big = "", small = "";
        for (let i = 0; i < 4; i++) big += arch(-40 + i * 100, 64, 300, 430);
        for (let i = 0; i < 8; i++) small += arch(-30 + i * 50, 30, 214, 262);
        return `<rect x="-20" y="188" width="360" height="250" ${F}/><path d="${big}${small}" ${HOLE}/><path d="M-20 280L340 280" ${CUT(6)}/>`;
      },
      grec() {
        let key = "M124 262";
        for (let x = 124; x < 290; x += 24) key += `L${x} 250L${x + 12} 250L${x + 12} 262L${x + 24} 262`;
        return `<g transform="translate(46 0) rotate(8 205 280)"><rect x="173" y="100" width="64" height="18" rx="6" ${F}/>
          <path d="M187 116L223 116C222 150 224 168 232 180C272 195 290 240 288 285C286 340 250 385 228 420L226 452L184 452L182 420C160 385 124 340 122 285C120 240 138 195 178 180C186 168 188 150 187 116Z" ${F}/>
          <path d="M223 136C266 128 278 162 262 198M187 136C144 128 132 162 148 198" ${S(13)}/>
          <path d="M126 232L284 232M126 280L284 280M150 330L260 330" ${CUT(6)}/><path d="${key}" ${CUT(4)}/></g>`;
      },
    };
    return (id) => {
      if (!ART[id]) return null;
      const el = document.createElement("span");
      el.className = "card-art";
      el.setAttribute("aria-hidden", "true");
      el.innerHTML = `<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" focusable="false">${ART[id]()}</svg>`;
      return el;
    };
  })();

  /* ---------- Codex ---------- */
  function initCodex() {
    let trail = [];
    let currentId = null;

    // Rend un élément de carte cliquable vers une autre carte du codex.
    function linkify(node, id, label) {
      if (!id || !byId.has(id) || id === currentId) return node;
      node.classList.add("is-link");
      node.tabIndex = 0;
      node.setAttribute("role", "link");
      node.setAttribute("aria-label", `Ouvrir la carte ${label || byId.get(id).word}`);
      const go = (event) => { event.stopPropagation(); event.preventDefault(); goToCard(id); };
      node.addEventListener("click", go);
      node.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") go(event); });
      return node;
    }

    function formsOf(e) {
      if (e.locked) return [];
      if (e.type !== "langue") return e.forms;
      const out = [];
      CODEX.forEach((x) => {
        if (x.locked || x.type === "langue") return;
        x.forms.forEach((form) => { if (form.lang === e.key) out.push({ ...form, from: x.word }); });
      });
      return out.sort((a, b) => Number(b.found) - Number(a.found));
    }
    function bandOf(e) {
      if (e.type === "langue") return [LANGS[e.key].c, "#0f1f19"];
      if (e.type === "mot") return ["#0f1f19", "#f3eee3"];
      return [TYPES[e.type].c, "#0f1f19"];
    }
    const silhouette = (text) => "•".repeat(Math.min(Math.max(text.length, 3), 9));

    const cbGrid = $("#cbGrid");
    const miniById = new Map();
    let cbFilter = "all";
    let cbSort = "n";
    let visibleIds = [];

    function newDot() {
      const dot = mk("span", "new-dot");
      dot.title = "Nouvelle carte";
      dot.setAttribute("role", "img");
      dot.setAttribute("aria-label", "Nouvelle carte");
      return dot;
    }

    function buildMini(e) {
      const card = mk("button", "mini");
      card.type = "button";
      const [tc, tt] = bandOf(e);
      card.style.setProperty("--tc", tc);
      card.style.setProperty("--tt", tt);
      card.dataset.type = e.type;
      const top = mk("span", "m-top");
      const side = mk("span", "m-side");
      side.append(mk("span", "m-kind", TYPES[e.type].label));
      // La rareté se pose dans le bandeau, en haut à droite, jamais sur une brique.
      if (e.rar) { const r = rarityEl(e.rar, true); r.classList.add("m-rar"); side.append(r); }
      const num = mk("span", null, `N°\u00a0${pad(e.n)}`);
      // Nouvelle carte : pastille Corail dans le bandeau, jusqu’à sa première consultation.
      if (e.fresh && !e.locked) { num.append(newDot()); card.classList.add("is-new"); }
      top.append(num, side);
      card.append(top);
      if (isLegend(e)) card.classList.add("is-legend");
      if (e.locked) {
        card.classList.add("locked");
        card.append(mk("span", "m-q", "?"), mk("span", "m-foot", `Piste : ${e.hint}`));
        card.setAttribute("aria-label", `Carte ${e.n}, fascicule ${e.fasc} : ${TYPES[e.type].label.toLowerCase()} à découvrir`);
      } else {
        const forms = formsOf(e);
        const got = forms.filter((x) => x.found).length;
        // Texture de la carte : seulement une fois découverte, pour ne rien trahir.
        const art = cardArt(e.id);
        if (art) card.append(art);
        if (e.type === "langue") card.append(mk("span", "m-glyph", e.glyph));
        const isAffix = e.type === "prefixe" || e.type === "suffixe";
        const word = isAffix ? chipEl(e.word, KIND_FR[e.type]) : mk("span", "m-word", e.word);
        if (isAffix) word.classList.add("m-brick");
        if (e.type !== "langue") word.lang = e.lang;
        card.append(word);
        // Sens littéral (mot) ou glose (brique), au milieu de la carte comme le nom d’une langue.
        const sense = isAffix ? e.gloss : e.lit;
        if (sense) card.append(mk("span", "m-lit", `«\u00a0${sense}\u00a0»`));
        const foot = mk("span", "m-foot");
        if (e.type === "langue") {
          foot.append(mk("span", null, `${got} / ${forms.length} formes`));
        } else {
          const lang = mk("span", "m-lang");
          const dot = mk("i");
          dot.style.background = LANGS[e.lang].c;
          lang.append(dot, LANGS[e.lang].name);
          const dots = mk("span", "m-dots");
          forms.forEach((x) => { const d = mk("i"); if (x.found) d.classList.add("on"); dots.append(d); });
          foot.append(lang, dots);
        }
        card.append(foot);
        card.setAttribute("aria-label", `${e.fresh ? "Nouvelle carte : " : ""}${e.word}, ${TYPES[e.type].label.toLowerCase()}${sense ? `, «\u00a0${sense}\u00a0»` : ""}, fascicule ${e.fasc}, ${got} formes trouvées sur ${forms.length}`);
      }
      card.addEventListener("click", () => openViewer(e.id, card));
      return card;
    }
    const SHOWN = CODEX.filter((e) => !isSecret(e));
    SHOWN.forEach((e) => { const card = buildMini(e); miniById.set(e.id, card); cbGrid.append(card); });
    let cbFasc = "all";
    const fascHeads = new Map();
    const progressOf = (list) => {
      const counted = list.filter(isCounted);
      return { got: counted.filter((e) => !e.locked).length, total: counted.length, legends: list.filter((e) => isLegend(e) && !e.locked).length };
    };
    const legendNote = (n) => {
      const note = mk("span", "cb-legend");
      note.append(rarityEl("legendaire"), `${n}\u00a0légendaire${n > 1 ? "s" : ""} trouvée${n > 1 ? "s" : ""}`);
      return note;
    };
    FASCICULES.forEach((f) => {
      const head = mk("div", "cb-group");
      head.setAttribute("role", "presentation");
      fascHeads.set(f.n, head);
    });

    const sortKey = (e) => (e.locked ? "" : e.word.replace(/^-/, ""));
    const SORTERS = {
      n: (a, b) => a.n - b.n,
      az: (a, b) => (Number(!!a.locked) - Number(!!b.locked)) || sortKey(a).localeCompare(sortKey(b), "fr", { sensitivity: "base" }),
      type: (a, b) => (TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type)) || a.n - b.n,
      fasc: (a, b) => (a.fasc - b.fasc) || (Number(!!a.locked) - Number(!!b.locked)) || a.n - b.n,
    };

    // Complétude par fascicule : les légendaires ne comptent jamais, pour garder le suspense.
    const fascBox = $("#cbFasc");
    const fascBtns = FASCICULES.map((f) => {
      const btn = mk("button", "cb-fasc-btn");
      btn.type = "button";
      btn.dataset.fasc = String(f.n);
      btn.addEventListener("click", () => { cbFasc = cbFasc === f.n ? "all" : f.n; renderCodex(); });
      fascBox?.append(btn);
      return [f, btn];
    });
    function paintFascicules() {
      fascBtns.forEach(([f, btn]) => {
        const { got, total, legends } = progressOf(SHOWN.filter((e) => e.fasc === f.n));
        const bar = mk("span", "cb-fasc-bar");
        const fill = mk("i");
        fill.style.width = `${total ? (got / total) * 100 : 0}%`;
        bar.append(fill);
        const head = mk("span", "cb-fasc-head");
        head.append(mk("b", null, f.label), mk("span", null, `${f.when} · ${JACKETS.find((jk) => jk.id === f.jacket)?.name || ""}`));
        const count = mk("span", "cb-fasc-count");
        count.append(mk("b", null, `${got} / ${total}`), " cartes");
        if (got === total) count.append(" · complet");
        btn.replaceChildren(head, bar, count);
        if (legends) btn.append(legendNote(legends));
        btn.setAttribute("aria-pressed", String(cbFasc === f.n));
        btn.setAttribute("aria-label", `${f.label} : ${got} cartes découvertes sur ${total}${legends ? `, et ${legends} légendaire trouvée` : ""}. ${cbFasc === f.n ? "Afficher tous les fascicules" : "Afficher ce fascicule seulement"}`);
        const gh = fascHeads.get(f.n);
        gh.replaceChildren(mk("b", null, f.label), mk("span", null, `${got} / ${total} cartes`));
      });
    }

    const filterBox = $("#cbFilters");
    [["all", "Tout", null], ...TYPE_ORDER.map((t) => [t, TYPES[t].plural, TYPES[t].c])].forEach(([key, label, color]) => {
      const chip = mk("button", "cb-chip");
      chip.type = "button";
      chip.dataset.filter = key;
      if (color) { const sw = mk("i"); sw.style.background = color; chip.append(sw); }
      chip.append(mk("span", null, label), mk("b", null, ""));
      chip.addEventListener("click", () => { cbFilter = key; renderCodex(); });
      filterBox.append(chip);
    });
    const sortBtns = $$("#cbSort button");
    sortBtns.forEach((btn) => btn.addEventListener("click", () => { cbSort = btn.dataset.sort; renderCodex(); }));

    function renderCodex(animate = true) {
      const doAnimate = animate && !reduce;
      const first = new Map();
      if (doAnimate) miniById.forEach((card) => { if (!card.hidden) first.set(card, card.getBoundingClientRect()); });
      const inFasc = SHOWN.filter((e) => cbFasc === "all" || e.fasc === cbFasc);
      const list = inFasc.filter((e) => cbFilter === "all" || e.type === cbFilter).sort(SORTERS[cbSort]);
      visibleIds = list.map((e) => e.id);
      const shown = new Set(visibleIds);
      miniById.forEach((card, id) => { card.hidden = !shown.has(id); });
      fascHeads.forEach((head) => { head.hidden = true; });
      let lastFasc = null;
      list.forEach((e) => {
        if (cbSort === "fasc" && e.fasc !== lastFasc) { const head = fascHeads.get(e.fasc); head.hidden = false; cbGrid.append(head); lastFasc = e.fasc; }
        cbGrid.append(miniById.get(e.id));
      });
      $$(".cb-chip", filterBox).forEach((chip) => {
        const key = chip.dataset.filter;
        $("b", chip).textContent = String(inFasc.filter((e) => key === "all" || e.type === key).length);
      });
      paintFascicules();
      if (doAnimate) {
        list.forEach((e, i) => {
          const card = miniById.get(e.id);
          const last = card.getBoundingClientRect();
          const prev = first.get(card);
          if (prev) {
            const dx = prev.left - last.left;
            const dy = prev.top - last.top;
            if (dx || dy) card.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { duration: 560, easing: "cubic-bezier(.16,1,.3,1)" });
          } else {
            card.animate([{ opacity: 0, transform: "scale(.7) rotate(-5deg)" }, { opacity: 1, transform: "none" }], { duration: 460, delay: i * 25, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "backwards" });
          }
        });
      }
      $$(".cb-chip", filterBox).forEach((chip) => chip.setAttribute("aria-pressed", String(chip.dataset.filter === cbFilter)));
      sortBtns.forEach((btn) => btn.setAttribute("aria-pressed", String(btn.dataset.sort === cbSort)));
      const all = progressOf(SHOWN);
      const countEl = $("#cbCount");
      countEl.replaceChildren(`${all.got} / ${all.total} cartes découvertes`);
      if (all.legends) countEl.append(" · ", legendNote(all.legends));
    }
    renderCodex(false);

    /* ---------- Codex : carte agrandie ---------- */
    const viewer = $("#viewer");
    const backdrop = $(".viewer-backdrop", viewer);
    const bigWrap = $("#bigWrap");
    const bigCard = $("#bigCard");
    const bigFront = $("#bigFront");
    const bigBack = $("#bigBack");
    let vIndex = -1;
    let vOrigin = null;
    let vBusy = false;

    function faceTop(e, right) {
      const top = mk("div", "bf-top");
      const num = mk("span", null, `N° ${pad(e.n)}`);
      if (e.fresh && !e.locked) num.append(newDot());
      top.append(num, mk("span", "bf-type", right));
      return top;
    }
    function flipButton(label, icon) {
      const btn = mk("button", "flip-btn");
      btn.type = "button";
      btn.append(mk("span", null, label), mk("em", null, icon));
      return btn;
    }

    function buildFront(e) {
      const body = mk("div", "bf-body");
      if (e.locked) {
        body.append(mk("p", "bf-q", "?"), mk("p", "bf-def", "Cette carte n’est pas encore découverte."), mk("p", "bf-lit", `Piste : ${e.hint}`));
      } else {
        if (e.type === "langue") body.append(mk("p", "bf-glyph", e.glyph));
        const isAffix = e.type === "prefixe" || e.type === "suffixe";
        const word = isAffix ? brickEl("div", e.word, KIND_FR[e.type], e.gloss) : mk("p", "bf-word", e.word);
        if (isAffix) word.classList.add("bf-brick");
        if (e.type !== "langue") word.lang = e.lang;
        if (e.parts) paintWord(word, e.word, e.parts);
        body.append(word);
        if (e.type !== "langue") {
          const lang = mk("p", "bf-lang");
          const dot = mk("i");
          dot.style.background = LANGS[e.lang].c;
          lang.append(dot, LANGS[e.lang].name);
          body.append(linkify(lang, langCard(e.lang), LANGS[e.lang].name));
        }
        if (e.parts) $$(".seg", word).forEach((seg, i) => linkify(seg, byWord.get(e.parts[i].label), e.parts[i].label));
        body.append(mk("p", "bf-def", e.def));
        if (e.parts) {
          const eq = buildEquation(e.parts, e.lit);
          $$(".brick", eq).forEach((b, i) => linkify(b, byWord.get(e.parts[i].label), e.parts[i].label));
          body.append(eq);
        }
        else if (e.lit) body.append(mk("p", "bf-lit", e.lit));
        if (e.note) body.append(mk("p", "bf-note", e.note));
      }
      const foot = mk("div", "bf-foot");
      const conf = mk("span", "conf");
      if (e.locked) conf.append(mk("b", null, "Inconnue"));
      else conf.append(mk("i"), mk("i"), mk("i"), mk("b", null, e.conf));
      foot.append(conf, flipButton("Voir les formes", "↻"));
      const art = e.locked ? null : cardArt(e.id);
      bigFront.replaceChildren(...[art, faceTop(e, TYPES[e.type].label), body, foot].filter(Boolean));
    }

    function buildBack(e) {
      const body = mk("div", "bf-body bb-body");
      const forms = formsOf(e);
      const got = forms.filter((x) => x.found).length;
      body.append(mk("p", "bb-title", e.type === "langue" ? `Formes en ${e.word.toLowerCase()}` : "Formes trouvées"));
      if (!forms.length) {
        body.append(mk("p", "bf-note", "Découvrez cette carte pour révéler ses formes dans chaque langue."));
      } else {
        const progress = mk("div", "bb-progress");
        const bar = mk("span", "bb-bar");
        const fill = mk("i");
        fill.style.width = "0%";
        fill.dataset.w = `${(got / forms.length) * 100}%`;
        bar.append(fill);
        progress.append(bar, mk("span", null, `${got} / ${forms.length}`));
        const list = mk("ul", "bb-forms");
        forms.forEach((x) => {
          const li = mk("li", x.found ? "" : "missing");
          const dot = mk("i");
          dot.style.background = LANGS[x.lang].c;
          const text = mk("span", "f-text");
          const affix = kindOf(x.form) !== "mot";
          let form;
          if (affix) {
            form = chipEl(x.found ? x.form : silhouette(x.form), kindOf(x.form), !x.found);
            form.classList.add("f-chip");
          } else {
            form = mk("span", "f-form", x.found ? x.form : silhouette(x.form));
          }
          if (x.found) form.lang = x.lang;
          text.append(form);
          const sub = mk("span", "f-tr");
          if (!x.found) sub.textContent = "À découvrir";
          else {
            if (x.tr) sub.append(x.tr);
            if (x.from) {
              if (x.tr) sub.append(" · ");
              const from = kindOf(x.from) !== "mot" ? chipEl(x.from) : mk("span", "f-from", x.from);
              sub.append("dans ", linkify(from, byWord.get(x.from), x.from));
            }
          }
          if (sub.childNodes.length) text.append(sub);
          li.append(dot, text);
          if (e.type !== "langue") li.append(linkify(mk("span", "f-lang", LANGS[x.lang].name), langCard(x.lang), LANGS[x.lang].name));
          list.append(li);
        });
        body.append(progress, list);
      }
      if (e.links) {
        body.append(mk("p", "bb-links-title", e.links.label));
        // Famille d’une brique : combien de mots formés sont déjà trouvés.
        if (e.links.label === "Mots formés") {
          const done = e.links.items.filter(([, ok]) => ok).length;
          const progress = mk("div", "bb-progress");
          const bar = mk("span", "bb-bar");
          const fill = mk("i");
          fill.style.width = "0%";
          fill.dataset.w = `${(done / e.links.items.length) * 100}%`;
          bar.append(fill);
          progress.append(bar, mk("span", null, `${done} / ${e.links.items.length} mots`));
          progress.setAttribute("aria-label", `Famille : ${done} mots formés trouvés sur ${e.links.items.length}`);
          body.append(progress);
        }
        const links = mk("div", "bb-links");
        e.links.items.forEach(([text, ok]) => {
          const isBrick = e.links.label === "Composants" || kindOf(text) !== "mot";
          const node = isBrick ? chipEl(ok ? text : silhouette(text), kindOf(text), !ok) : mk("span", ok ? "bb-link" : "bb-link missing", ok ? text : silhouette(text));
          links.append(ok ? linkify(node, byWord.get(text), text) : node);
        });
        body.append(links);
      }
      const foot = mk("div", "bf-foot");
      foot.append(mk("span", null, e.locked ? "Aucune forme pour l’instant" : `${got} forme${got > 1 ? "s" : ""} sur ${forms.length}`), flipButton("Recto", "↺"));
      bigBack.replaceChildren(faceTop(e, "Formes trouvées"), body, foot);
    }

    function setFlipped(on, focus = false) {
      bigCard.classList.toggle("flipped", on);
      bigFront.inert = on;
      bigBack.inert = !on;
      if (on) $$(".bb-bar i", bigBack).forEach((bar) => { bar.style.width = bar.dataset.w; });
      if (focus) $(".flip-btn", on ? bigBack : bigFront).focus({ preventScroll: true });
    }
    bigCard.addEventListener("click", (event) => {
      setFlipped(!bigCard.classList.contains("flipped"), event.detail === 0);
    });

    function fillViewer(e) {
      currentId = e.id;
      const [tc, tt] = bandOf(e);
      bigCard.style.setProperty("--tc", tc);
      bigCard.style.setProperty("--tt", tt);
      buildFront(e);
      buildBack(e);
      setFlipped(false);
      if (e.fresh) {
        e.fresh = false;
        const mini = miniById.get(e.id);
        mini.classList.remove("is-new");
        $(".new-dot", mini)?.remove();
        mini.setAttribute("aria-label", mini.getAttribute("aria-label").replace(/^Nouvelle carte : /, ""));
      }
      $("#vTitle").textContent = e.locked ? `Carte ${e.n}, à découvrir` : `${e.word}, ${TYPES[e.type].label.toLowerCase()}`;
    }

    function renderTrail() {
      const box = $("#vTrail");
      box.replaceChildren();
      box.toggleAttribute("data-empty", trail.length < 2);
      if (trail.length < 2) return;
      const back = mk("button", "trail-back", "←");
      back.type = "button";
      back.setAttribute("aria-label", "Revenir à la carte précédente");
      back.addEventListener("click", () => goToCard(trail[trail.length - 2]));
      box.append(back);
      trail.forEach((id, i) => {
        const e = byId.get(id);
        if (i) box.append(mk("span", "trail-sep", "›"));
        const isAffix = e.type === "prefixe" || e.type === "suffixe";
        const label = isAffix ? chipEl(e.word, KIND_FR[e.type]) : mk("span", null, e.word);
        if (i === trail.length - 1) {
          const current = mk("span", "crumb");
          current.setAttribute("aria-current", "page");
          current.append(label);
          box.append(current);
        } else {
          const crumb = mk("button", "crumb");
          crumb.type = "button";
          crumb.append(label);
          crumb.addEventListener("click", () => goToCard(id));
          box.append(crumb);
        }
      });
    }

    function showCard(id) {
      const mini = miniById.get(id);
      if (vOrigin) vOrigin.classList.remove("away");
      vOrigin = mini;
      if (mini && !mini.hidden) mini.classList.add("away");
      const idx = visibleIds.indexOf(id);
      vIndex = idx >= 0 ? idx : Math.max(0, vIndex);
      fillViewer(byId.get(id));
      renderTrail();
    }

    function goToCard(id) {
      if (viewer.hidden || vBusy || id === currentId) return;
      const idx = trail.indexOf(id);
      trail = idx >= 0 ? trail.slice(0, idx + 1) : [...trail, id];
      showCard(id);
      $(".flip-btn", bigFront).focus({ preventScroll: true });
      if (!reduce) bigWrap.animate([{ transform: "scale(.88) translateY(18px)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 420, easing: "cubic-bezier(.16,1,.3,1)" });
    }

    const flight = (from, to) => `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`;

    function openViewer(id, origin) {
      if (vBusy || !viewer.hidden) return;
      vIndex = visibleIds.indexOf(id);
      vOrigin = origin;
      trail = [id];
      fillViewer(byId.get(id));
      renderTrail();
      viewer.hidden = false;
      document.documentElement.style.overflow = "hidden";
      origin.classList.add("away");
      $(".flip-btn", bigFront).focus({ preventScroll: true });
      if (reduce) return;
      vBusy = true;
      const to = bigWrap.getBoundingClientRect();
      const from = origin.getBoundingClientRect();
      backdrop.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360, easing: "ease-out" });
      bigWrap.animate([{ transform: flight(from, to), opacity: 0.5 }, { transform: "none", opacity: 1 }], { duration: 620, easing: "cubic-bezier(.2,.9,.25,1.08)" })
        .onfinish = () => { vBusy = false; };
    }

    function closeViewer() {
      if (viewer.hidden || vBusy) return;
      const origin = vOrigin;
      const finish = () => {
        viewer.hidden = true;
        document.documentElement.style.overflow = "";
        if (origin) { origin.classList.remove("away"); origin.focus({ preventScroll: true }); }
        if (location.hash.startsWith("#carte-")) history.replaceState(null, "", location.pathname + location.search);
        vBusy = false;
      };
      if (reduce) { finish(); return; }
      vBusy = true;
      setFlipped(false);
      const to = bigWrap.getBoundingClientRect();
      const target = origin ? origin.getBoundingClientRect() : null;
      const onScreen = target && target.bottom > 0 && target.top < innerHeight;
      backdrop.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 380, easing: "ease-in", fill: "forwards" }).onfinish = (ev) => ev.target.cancel();
      const frames = onScreen
        ? [{ transform: "none", opacity: 1 }, { transform: flight(target, to), opacity: 0.6 }]
        : [{ transform: "none", opacity: 1 }, { transform: "scale(.85)", opacity: 0 }];
      bigWrap.animate(frames, { duration: 420, easing: "cubic-bezier(.5,0,.75,0)" }).onfinish = finish;
    }

    function navigate(dir) {
      if (viewer.hidden || vBusy || visibleIds.length < 2) return;
      vIndex = (vIndex + dir + visibleIds.length) % visibleIds.length;
      const id = visibleIds[vIndex];
      trail = [id];
      showCard(id);
      if (!reduce) bigWrap.animate([{ transform: `translateX(${dir * 70}px) rotate(${dir * 5}deg)`, opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 440, easing: "cubic-bezier(.16,1,.3,1)" });
    }

    $$("[data-close]", viewer).forEach((node) => node.addEventListener("click", closeViewer));
    $("#vPrev").addEventListener("click", () => navigate(-1));
    $("#vNext").addEventListener("click", () => navigate(1));
    document.addEventListener("keydown", (event) => {
      if (viewer.hidden) return;
      if (event.key === "Escape") { event.preventDefault(); closeViewer(); }
      else if (event.key === "ArrowRight") { event.preventDefault(); navigate(1); }
      else if (event.key === "ArrowLeft") { event.preventDefault(); navigate(-1); }
      else if (event.key === "Tab") {
        const focusables = $$("button, [tabindex='0']", viewer).filter((b) => !b.closest("[inert]") && b.offsetParent !== null);
        const firstEl = focusables[0];
        const lastEl = focusables[focusables.length - 1];
        if (!viewer.contains(document.activeElement)) { event.preventDefault(); firstEl.focus(); }
        else if (event.shiftKey && document.activeElement === firstEl) { event.preventDefault(); lastEl.focus(); }
        else if (!event.shiftKey && document.activeElement === lastEl) { event.preventDefault(); firstEl.focus(); }
      }
    });

    // Lien profond : codex.html#carte-biologie ouvre directement la carte.
    const openFromHash = () => {
      const id = decodeURIComponent(location.hash.replace(/^#carte-/, ""));
      if (!location.hash.startsWith("#carte-") || !byId.has(id) || byId.get(id).locked) return;
      const origin = miniById.get(id);
      if (!origin) return;
      origin.scrollIntoView({ block: "center" });
      requestAnimationFrame(() => openViewer(id, origin));
    };
    openFromHash();
    addEventListener("hashchange", openFromHash);
  }

  /* ---------- Pied de page ---------- */
  const footWord = $("#footWord");
  if (footWord) {
    const footWords = ["piste", "énigme", "histoire", "trouvaille", "porte"];
    let fi = 0;
    setInterval(() => { fi = (fi + 1) % footWords.length; scramble(footWord, footWords[fi]); }, 2600);
  }

  /* ---------- Indicateur glissant (contrôle segmenté) ---------- */
  function slider(box, attr) {
    const update = (instant) => {
      const on = box.querySelector(`[${attr}="true"]`);
      if (!on || !box.offsetWidth) return;
      if (instant) box.classList.add("no-slide");
      box.style.setProperty("--slide-x", `${on.offsetLeft}px`);
      box.style.setProperty("--slide-w", `${on.offsetWidth}px`);
      if (instant) requestAnimationFrame(() => requestAnimationFrame(() => box.classList.remove("no-slide")));
    };
    box.classList.add("has-slider");
    update(true);
    new MutationObserver(() => update(false)).observe(box, { subtree: true, attributes: true, attributeFilter: [attr] });
    new ResizeObserver(() => update(true)).observe(box);
  }
  $$(".cb-sort").forEach((box) => slider(box, "aria-pressed"));

  /* ---------- ADR : sommaire actif ---------- */
  const adrToc = $(".adr-toc");
  if (adrToc) {
    const tocLinks = $$("a", adrToc);
    const tocObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        tocLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    $$(".adr").forEach((el) => tocObserver.observe(el));
  }

  if ($("#tray")) initGame();
  if ($("#pkStage")) initPacks();
  if ($("#cbGrid")) initCodex();
  // Cartes statiques (charte, maquettes) : <div class="mq-card" data-card-art="bio"> reçoit sa texture.
  document.querySelectorAll("[data-card-art]").forEach((el) => {
    const art = cardArt(el.dataset.cardArt);
    if (!art) return;
    el.classList.add("has-card-art");
    el.prepend(art);
  });
})();
