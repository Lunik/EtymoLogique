---
name: doc-preview
description: Prévisualiser localement les pages de docs/ d'ÉtymoLogique avec un serveur HTTP et le navigateur intégré. Captures desktop et mobile, en modes atelier et nocturne, avec contrôle de la console et des liens. À utiliser après toute modification visible de docs/ (HTML, CSS, JS, ADR régénérés) ou quand l'utilisateur veut voir une page.
---

# Skill doc-preview

Les pages de `docs/` sont statiques. Servez-les en HTTP plutôt qu'en `file://`, pour que `localStorage`, les chemins relatifs et les modules se comportent comme sur GitHub Pages.

## 1. Préparer

- Si un ADR a changé, régénérez d'abord : `python3 docs/scripts/build_adr.py`.
- Repérez les pages touchées : `git status --short docs/` et `git diff --name-only master -- docs/`. Une modification de `docs/assets/etymo.css`, `etymo.js` ou `site-nav.*` touche **toutes** les pages : prévisualisez au moins `index.html`, `identite.html`, `jeu.html` et `plis.html`.

## 2. Lancer le serveur

Trouvez un port libre (en commençant par 8000), puis lancez le serveur en mode **async** (attaché à la session, jamais `detach`, `nohup` ni `&`) :

```sh
PORT=8000; while lsof -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; do PORT=$((PORT+1)); done; echo $PORT
python3 -m http.server "$PORT" --bind 127.0.0.1 --directory docs
```

Vérifiez qu'il répond avant d'ouvrir le navigateur :

```sh
curl -s -o /dev/null -w '%{http_code}\n' "http://127.0.0.1:$PORT/index.html"   # attendu : 200
```

## 3. Inspecter dans le navigateur intégré

Cherchez les outils de navigateur (`openBrowserPage`, `screenshotPage`, `readPage`, `runPlaywrightCode`, etc.) avec l'outil de recherche d'outils, puis, pour chaque page touchée :

1. **Desktop** : ouvrez `http://127.0.0.1:$PORT/<page>.html` (et l'ancre modifiée, par exemple `adr.html#adr-0012`) en 1280 × 800, puis capturez l'écran.
2. **Mobile** : 390 × 844, capture (mobile d'abord : ADR 0001). Vérifiez qu'il n'y a ni débordement horizontal (`document.documentElement.scrollWidth <= innerWidth`) ni texte coupé, et que les cibles tactiles font au moins 44 px.
3. **Mode nocturne** : `localStorage.setItem("etymologique.theme", "nocturne")`, rechargez, capturez, puis remettez `"atelier"`. Sur `design-system.html`, utilisez plutôt le bouton `#toggleNight`.
4. **Console** : aucune erreur JavaScript et aucune ressource en 404.
5. **Liens internes** : les `href` relatifs et les ancres `#…` de la page pointent vers des fichiers et des `id` existants (vérifiez-le avec `runPlaywrightCode` ou `readPage`).
6. **Démo** : sur `jeu.html`, `plis.html` et `codex.html`, jouez le parcours touché (poser une brique, fusionner, ouvrir un pli). Repartez d'un état propre avec `localStorage.removeItem("etymologique.demo.v1")`.
7. **Mouvement réduit** : si des animations ont changé, émulez `prefers-reduced-motion: reduce` et vérifiez que le contenu reste accessible.

Si les outils de navigateur ne sont pas disponibles, donnez à l'utilisateur l'URL locale et la liste des points à vérifier. Faites quand même les contrôles possibles en `curl` (code 200 de chaque page et de chaque ressource liée).

## 4. Rendre compte et nettoyer

- Montrez les captures pertinentes, en indiquant la page, la largeur et le thème. Listez les anomalies trouvées.
- Arrêtez le serveur à la fin (`stop_bash` sur son shellId), sauf si l'utilisateur veut le garder ouvert. Dans ce cas, donnez-lui l'URL.
- Remettez `localStorage` dans l'état initial si vous l'avez modifié.
- Après publication, la branche est aussi visible sur GitHub Pages sous `/branches/<nom-de-branche>/`. Le workflow tourne à chaque push sur `master` et toutes les heures.
