---
name: visual-identity-check
description: Vérifier qu'une modification de docs/ (CSS, HTML, JS, SVG) respecte l'identité visuelle d'ÉtymoLogique (« une couleur, un seul sens ») : script automatique sur la palette, le blanc pur, les ombres colorées, les dégradés et le texte sur couleur vive, puis checklist des règles de couleur, formes, états, rareté, tailles et accessibilité, et revue visuelle. À utiliser pour toute modification d'apparence ou nouveau composant.
---

# Skill visual-identity-check

Références (à relire en cas de doute, elles priment sur ce résumé) :
- `docs/game-design.md`, section « Identité visuelle » ;
- `docs/identite.html` : palette, 10 règles élémentaires avec exemples bons et mauvais, formes, états, rareté ;
- `docs/design-system.html` : jetons (§ 1), composants (§ 2 et 3), accessibilité (§ 7) ;
- `docs/assets/etymo.css` : **jetons de référence** (`:root` et `body.nocturne`).

## 1. Contrôle automatique

```sh
python3 .agents/skills/visual-identity-check/check_identity.py --base master   # lignes modifiées seulement
python3 .agents/skills/visual-identity-check/check_identity.py                 # tout docs/ (état des lieux)
python3 .agents/skills/visual-identity-check/check_identity.py docs/plis.html  # fichiers précis
```

| Règle | Sévérité | Correction attendue |
|---|---|---|
| `hors-palette` | erreur | Remplacer par une variable d'`etymo.css`. Une nouvelle couleur demande une décision (ADR ou mise à jour de la charte), pas une valeur en dur. |
| `blanc-pur` | erreur | Papier `var(--paper)` pour le fond, Crème `var(--cream)` pour les surfaces. |
| `degrade-mixte` | erreur | Supprimer le dégradé. Utiliser une surface unie ou un filet neutre de 3 px. |
| `texte-sur-vif` | erreur | Texte en `var(--fixed-ink)` sur une couleur vive. |
| `encre-variable` | avertissement | `var(--ink)` s'inverse en nocturne : sur une couleur vive, utiliser `var(--fixed-ink)`. |
| `ombre-coloree` | avertissement | Ombre dure en Encre (`var(--pop-shadow)`). Exceptions admises : la carte vitrine Corail de l'accueil et les halos Ambre du rituel des plis, **à justifier**. |

- Les anneaux (`0 0 0 Npx`, pour le focus, une pulsation ou un projecteur) ne sont pas comptés comme des ombres.
- Une exception assumée se marque en fin de ligne par le commentaire `/* identite: ok — raison */`. Les contre-exemples `class="rule-demo bad"` d'`identite.html` sont ignorés.
- Avec `--base`, **aucune nouvelle erreur** n'est acceptable. Les écarts préexistants (lancement sans `--base`) se signalent à l'utilisateur, mais ne se corrigent pas sans son accord.
- Le script ne voit ni le contexte de rendu ni les couleurs calculées en JavaScript : la checklist reste obligatoire.

## 2. Checklist de revue

Pour chaque composant ajouté ou modifié :

**Sens des couleurs** : une couleur désigne un seul type de chose.
- [ ] Préfixe = Étincelle, suffixe = Glose, **toutes** les langues = Palimpseste, famille = Rosée, pli / énergie / rareté / encre = Ambre, action / focus / nouveauté / marque = Corail, danger irréversible = Corail profond (après confirmation, avec l'icône octogone). Cartes de mot neutres : Encre sur Crème.
- [ ] Aucune couleur de ressource n'est détournée pour un autre usage (décoration, succès, alerte). Un échec de jeu reste en Gris encre, jamais en rouge.

**Règles élémentaires** (numérotées comme dans `identite.html`) :
- [ ] 1. Pas de couleur vive sur une autre couleur vive : fond Crème, Papier, Encre ou Nuit.
- [ ] 2. Texte en Encre sur une couleur vive, jamais blanc ni crème.
- [ ] 3. Un texte coloré sur fond clair prend le ton **Profond** (`--c-*-deep`), jamais la couleur vive.
- [ ] 4. Deux couleurs ne se touchent jamais : filet neutre de 3 px.
- [ ] 5. Grandes surfaces neutres. Seul le Corail peut couvrir une bande de marque.
- [ ] 6. La couleur n'est jamais le seul signal : texte, forme ou icône en plus.
- [ ] 7. Pas de dégradé entre ressources. Pas d'opacité pour inventer une teinte : utiliser `--c-*-tint`. Seul le désactivé est à 40 %.
- [ ] 8. Ombres jamais colorées (sauf la vitrine Corail).
- [ ] 9. Contraste ≥ 4,5:1 pour le texte, ≥ 3:1 pour les grands titres, icônes et bordures utiles.
- [ ] 10. Au plus 3 couleurs de ressource par composant (Corail non compté), et une seule surface colorée : son bandeau.

**États et rareté** :
- [ ] Les états se lisent par un losange : Corail plein = découverte, contour Encre = presque, Gris encre = échec, Encre plein = déjà connu.
- [ ] Rareté : triangle (commune), carré (peu commune), pentagone (rare), diamant taillé (légendaire). La forme est remplie d'Ambre, cernée d'Encre 1,5 px, accompagnée d'un libellé ou d'un nom accessible, et **jamais posée sur une brique**. Tailles : 12, 16 et 22 px.
- [ ] Confiance éditoriale : trois traits Encre, sans couleur ni forme géométrique.

**Formes et interactions** :
- [ ] Brique : rayon 10, ombre dure 4, au moins 96 × 52 px. Petite brique : rayon 6. Carte : 3:4 avec bandeau. Pastille : rayon 999. Pointillé : ce qui manque, inconnu ou épuisé.
- [ ] Survol : −2 px et ombre 6 px. Pression : +2 px et ombre 1 px. Focus : anneau Corail 2 px. Désactivé : 40 %. Sélectionné : fond Encre.
- [ ] Cibles tactiles ≥ 44 px, boutons de 48 px de haut.
- [ ] Préfixes et suffixes affichés sous forme de brique, jamais en texte brut.

**Typographie, mouvement, thèmes** :
- [ ] Polices par variable : `--serif` pour les mots, `--sans` pour l'interface, `--mono` pour les métadonnées. Cursive réservée au rituel d'écriture.
- [ ] Animations courtes, avec les easings `--ease-out` et `--ease-spring`, et désactivées sous `prefers-reduced-motion`.
- [ ] Mode nocturne : les neutres s'inversent, les couleurs de ressource ne changent pas. Le composant reste lisible dans les deux thèmes.
- [ ] Rien de ce que la boussole met « à éviter » : parchemins et plumes, dégradés violets, ombres molles, cartes trop arrondies, drapeaux pour les langues, codes de langue.

## 3. Revue visuelle

Lancez le skill `doc-preview` sur les pages touchées : desktop et mobile, atelier et nocturne. Comparez avec les exemples bons et mauvais d'`identite.html#regles`.

## 4. Rapport

Rendez un rapport court :
- le résultat du script (erreurs et avertissements nouveaux) ;
- les points de la checklist en écart, avec `fichier:ligne`, la règle enfreinte et la correction proposée ;
- les exceptions assumées et leur justification ;
- les captures utiles.
