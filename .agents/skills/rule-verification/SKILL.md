---
name: rule-verification
description: Vérifier qu'une modification d'ÉtymoLogique (doc, ADR, page HTML, démo JS, microcopie, règle de jeu) est cohérente avec les ADR acceptés et leurs remplacements, les piliers et la boussole, le vocabulaire et le glossaire, et les règles de jeu de docs/game-design.md. Produit un rapport conforme / écart / à trancher, avec la source de chaque point. À utiliser avant de conclure toute modification de docs/ et lors de la rédaction d'un ADR.
---

# Skill rule-verification

Objectif : aucune modification ne contredit en silence une décision prise. Ce skill vérifie le **fond** (règles, décisions, vocabulaire). L'apparence relève de `visual-identity-check`.

## 1. Délimiter la modification

- `git status --short` et `git diff master -- docs/`. Pour un fichier non suivi, lisez-le en entier.
- Listez les **affirmations** introduites ou modifiées : règle de jeu, chiffre (plafond, taux, poids, délai), comportement de la démo, libellé, décision technique.

## 2. Charger les sources en vigueur

1. Lisez `docs/adr/README.md`, puis les ADR concernés par le sujet. Ne vous fiez pas à un résumé : relisez la section « Décision ».
2. Résolvez les remplacements : un ADR « partiellement remplacé » ne s'applique plus sur le périmètre repris par son successeur (par exemple 0008 → 0011 pour le contenu des plis, 0011 → 0012 pour la valeur des doublons). Un ADR **Proposé** n'est pas encore une règle : un écart avec lui est « à trancher », pas une violation.
3. `docs/game-design.md` : piliers, vocabulaire, boucle, règles de jeu, périmètre du MVP.
4. `docs/boussole.html` : piliers, « à cultiver », « à éviter ».
5. `docs/design-system.html`, section 6 : ton, typographie française, règles de nommage, glossaire de l'interface (§ 6.1, colonne « À ne pas dire »).

## 3. Vérifier

### Invariants de jeu (à ce jour ; en cas d'écart, l'ADR fait foi)

- [ ] **Se tromper ne coûte rien, réussir consomme** : seule une *nouvelle* découverte consomme un exemplaire de chaque brique utilisée. Un échec, un « presque » ou une recette déjà connue ne consomment rien. Poser une brique la *réserve* sans la consommer (ADR 0012).
- [ ] Après la réserve de départ, **seuls les plis donnent des exemplaires**. Une découverte n'en donne jamais directement, et les jalons offrent un pli de jalon déterministe (ADR 0012).
- [ ] Plafond de **5 exemplaires par brique**. Au-delà, l'exemplaire devient de l'encre selon la rareté. Une brique épuisée reste connue (ADR 0012, 0011).
- [ ] Garantie de nouveauté au **6ᵉ pli**, filet d'utilité au **5ᵉ pli** consécutif sans découverte possible, chances affichées (ADR 0011, 0012).
- [ ] **Progression atteignable** : aucune brique impossible à obtenir, pas de chemin critique qui dépende uniquement du hasard, aucune attente sans fin (ADR 0004).
- [ ] Une fusion réussit seulement si elle correspond à une **recette éditoriale ordonnée**, jamais sur une simple ressemblance de chaînes (ADR 0003).
- [ ] Fait linguistique et équilibrage restent **séparés** : la couche ludique ne crée aucun fait, et le **niveau de confiance n'est jamais une rareté** (ADR 0009, 0011).
- [ ] Énergie et plis **gratuits**. Aucun paiement, publicité récompensée ni monnaie premium dans le MVP. L'énergie n'est jamais requise pour fusionner. Pas de fausse urgence (ADR 0008).
- [ ] L'état et l'économie sont **sous autorité serveur** : réservation locale et visuelle, consommation dans une transaction idempotente (ADR 0007, 0012).
- [ ] PWA pensée mobile d'abord, avec des alternatives accessibles au glisser-déposer (ADR 0001).
- [ ] Architecture multilingue : langues en toutes lettres, codes jamais affichés, formes originales et translittérations conservées, attribut `lang` (ADR 0006).
- [ ] Observabilité minimale : aucune donnée personnelle, et seulement les événements autorisés (ADR 0010).
- [ ] Contenu publié par versions immuables, sourcé et relu (ADR 0002, 0005).

### Piliers et boussole

- [ ] Déduction, expérimentation, rareté des briques, collection, transmission, progression maîtrisée : la modification n'en affaiblit aucun, ou elle le dit explicitement.
- [ ] Rien de ce qui figure dans « à éviter » : clichés académiques, dégradés violets, ombres molles, drapeaux pour les langues, animations décoratives, codes de langue, préfixes et suffixes en texte brut.

### Vocabulaire et microcopie

- [ ] Termes du glossaire : brique, table de fusion, découverte, codex, carte, exemplaire, réserve, pli, encre. Jamais leurs équivalents interdits (« pack », « Pokédex », « inventaire », « stock », « charge », « munition », « succès », « victoire », etc. : voir § 6.1). Repérez-les avec `grep -rniE '\b(pack|pokédex|inventaire|stock|munition)s?\b' docs/`, puis examinez chaque occurrence : une mention qui explique pourquoi le terme est proscrit est légitime.
- [ ] Ton : vouvoiement, impératif, phrases courtes, encourageant, jamais moqueur ni professoral. Jargon linguistique expliqué.
- [ ] Typographie française : « » avec espaces insécables, espace insécable avant `: ; ? !`, apostrophe ’, « 5,9 % », « 1 320 », « N° 014 ». Majuscule seulement en début de phrase et aux noms propres.

### Cohérence entre documents

- [ ] Une règle modifiée dans une page l'est aussi dans `game-design.md`, dans l'ADR concerné et dans la démo (`docs/assets/etymo.js`). Les chiffres sont identiques partout.
- [ ] Changer une décision passe par un **nouvel ADR** (skill `adr`), jamais par la réécriture d'un ADR accepté.
- [ ] Les renvois (« ADR NNNN », `xrefs`, ancres) pointent vers la bonne cible, et `adr.html` a été régénéré.

## 4. Rapport

Rendez un tableau, un point par ligne :

| Statut | Point | Où | Source |
|---|---|---|---|
| ✅ Conforme | … | `fichier:ligne` | ADR NNNN § … |
| ❌ Écart | ce qui contredit, et la correction proposée | `fichier:ligne` | citation courte de la source |
| ❓ À trancher | contradiction entre sources, ADR Proposé, cas non couvert | `fichier:ligne` | sources en conflit |

- Chaque écart cite sa source : fichier et section, avec un extrait court.
- Ne corrigez un écart que si c'est dans le périmètre de la demande. Sinon, signalez-le.
- Un point « à trancher » se soumet à l'utilisateur. Il peut justifier un nouvel ADR.
