# AGENTS.md — ÉtymoLogique

ÉtymoLogique est un jeu de logique, de découverte et de collection : le joueur assemble des briques linguistiques (préfixes, suffixes, racines) pour retrouver des mots et explorer leur histoire. Le dépôt contient pour l'instant **le dossier de conception** : vision du jeu, décisions (ADR), identité visuelle, design système et démonstrations interactives en HTML statique. Il n'y a encore ni application ni dépendance à installer.

Tout le contenu est **en français**. Rédigez en français (documentation, microcopie, messages de commit exceptés).

## Carte du dépôt

| Chemin | Rôle |
|---|---|
| `README.md` | Présentation du projet, prévisualisation, contribution, licences. |
| `LICENSE`, `LICENSE-CONTENT` | Code sous AGPL 3.0 ou ultérieure, contenu sous CC BY-SA 4.0 ; nom et logo réservés (ADR 0017). |
| `docs/game-design.md` | Vision du jeu : piliers, vocabulaire, boucle, règles de jeu, identité, périmètre du MVP. |
| `docs/adr/*.md` | Architecture Decision Records, numérotés `NNNN-titre.md`, indexés dans `docs/adr/README.md`. |
| `docs/adr.html` | Page générée à partir des ADR (entre `<!-- ADR:START -->` et `<!-- ADR:END -->`) : ne pas éditer à la main. |
| `docs/scripts/build_adr.py` | Génère `adr.html` ; contient aussi `XREFS`, les renvois de chaque ADR vers les pages. |
| `docs/index.html` | Accueil du dossier de direction. |
| `docs/identite.html`, `design-system.html`, `typographie.html`, `mouvement.html` | Identité visuelle et design système. |
| `docs/jeu.html`, `plis.html`, `codex.html` | Démonstrations jouables (table de fusion, plis, codex). |
| `docs/boussole.html`, `moodboard.html` | Piliers, à cultiver / à éviter, ambiance. |
| `docs/logo.html` | Page de travail hors navigation : les dix pistes de logo, dont le sceau ÉL retenu (ADR 0021). |
| `docs/cartes-visuels.html` | Page de travail hors navigation : dix pistes de texture pour les cartes du codex, dont la piste 02 (aplat découpé) retenue par l’ADR 0023. Les silhouettes du codex sont dans `cardArt` (`assets/etymo.js`). |
| `docs/assets/etymo.css` | **Jetons de référence** (couleurs, polices, rayons, easing) et styles partagés. |
| `docs/assets/etymo.js` | Démo partagée (réserve, découvertes, plis) stockée dans `localStorage` (`etymologique.demo.v1`, thème `etymologique.theme`). |
| `docs/assets/logo.svg` | Icône des pages : le sceau ÉL (ADR 0021). |
| `docs/assets/site-nav.js` / `.css` | Navigation commune : liste unique des pages (`GROUPS`). |
| `.github/workflows/pages.yml` | Publie `docs/` de `master` sur GitHub Pages, et chaque autre branche sous `/branches/<nom>/`. |
| `.agents/skills/` | Skills des agents (`.github/skills` est un lien symbolique vers ce dossier). |

## Sources de vérité

En cas de doute, dans cet ordre :

1. **ADR acceptés** (`docs/adr/`) : ils l'emportent, en tenant compte des remplacements partiels (par exemple 0011 remplace en partie 0008, 0012 remplace en partie 0011).
2. **`docs/game-design.md`** : vision, vocabulaire et règles de jeu.
3. **`docs/identite.html`** et **`docs/design-system.html`** : charte visuelle, composants, microcopie, glossaire de l'interface (§ 6.1).
4. **`docs/boussole.html`** : piliers, à cultiver / à éviter.

Si deux sources se contredisent, signalez l'écart au lieu de choisir en silence.

## Règles essentielles

- **Se tromper ne coûte rien, réussir consomme** : une découverte consomme un exemplaire de chaque brique utilisée ; un échec, un « presque » ou une recette déjà connue ne consomment rien.
- **Aucune impasse** : aucune brique impossible à obtenir, plafond de 5 exemplaires par brique, filet d'utilité, garantie de nouveauté au 6ᵉ pli.
- **Pas de paiement dans le MVP.** Le niveau de confiance éditoriale n'est jamais une rareté ludique.
- **Vocabulaire** : « pli » (jamais « pack »), « codex » (jamais « Pokédex » ni « inventaire »), « exemplaire », « réserve », « brique », « table de fusion ». Langues en toutes lettres (« grec ancien », jamais « GRC »).
- **Typographie française** : guillemets « » avec espaces insécables, espace insécable avant `: ; ? !`, apostrophe typographique ’, « 5,9 % », « 1 320 ». Vouvoiement et impératif.
- **Identité visuelle** : une couleur, un seul sens. Utilisez les variables de `etymo.css`, jamais de valeur en dur hors palette, jamais de blanc pur, pas d'ombre colorée, pas de dégradé entre ressources, texte en Encre sur couleur vive (`var(--fixed-ink)`).
- **Accessibilité** : contraste 4,5:1 pour le texte (3:1 pour grands titres, icônes et bordures utiles), cible tactile d'au moins 44 px, la couleur n'est jamais le seul signal, `prefers-reduced-motion` respecté.

## Modifier la documentation

- **Changer une décision** : nouvel ADR, qui déclare ce qu'il remplace ; l'ancien reste, avec un statut mis à jour. Les corrections factuelles peuvent modifier l'ADR existant. Voir le skill `adr`.
- **Après toute modification d'un ADR** : `python3 docs/scripts/build_adr.py`, puis committez `adr.html`.
- **Renvois croisés** : les pages se renvoient les unes aux autres (`<p class="xrefs">`, liens `#ancre`). Gardez-les à jour quand vous renommez une ancre ou une page.
- **Nouvelle page** : ajoutez-la à `GROUPS` dans `docs/assets/site-nav.js` et reprenez l'en-tête commun (`site-nav.css`, `etymo.css`, `lang="fr"`, lien d'évitement).
- **Pas de lien symbolique dans `docs/`** : la publication Pages échoue.
- **`game-design.md`** reste cohérent avec les ADR et les pages : mettez à jour les trois ensemble.

## Commandes

```sh
python3 docs/scripts/build_adr.py                                     # régénérer adr.html
python3 -m http.server 8000 --directory docs                          # prévisualiser (voir le skill doc-preview)
python3 .agents/skills/visual-identity-check/check_identity.py        # contrôler l'identité visuelle
python3 .agents/skills/visual-identity-check/check_identity.py --base master  # seulement les lignes modifiées
```

## Skills

| Skill | Quand l'utiliser |
|---|---|
| [`adr`](.agents/skills/adr/SKILL.md) | Créer, remplacer ou corriger un ADR. |
| [`doc-preview`](.agents/skills/doc-preview/SKILL.md) | Prévisualiser les pages localement, avec captures desktop / mobile et jour / nocturne. |
| [`visual-identity-check`](.agents/skills/visual-identity-check/SKILL.md) | Vérifier qu'une modification visuelle respecte l'identité. |
| [`rule-verification`](.agents/skills/rule-verification/SKILL.md) | Vérifier qu'une modification respecte les ADR, la boussole, le vocabulaire et les règles de jeu. |

Avant de conclure une modification de `docs/`, lancez au minimum `rule-verification` et, si l'apparence change, `visual-identity-check` avec `doc-preview`.
