---
name: adr
description: Créer, remplacer partiellement ou corriger un Architecture Decision Record d'ÉtymoLogique dans docs/adr/, puis mettre à jour l'index, les ADR liés, les renvois et régénérer docs/adr.html. À utiliser dès qu'une décision produit, de jeu ou d'architecture est prise ou modifiée.
---

# Skill ADR

Les ADR vivent dans `docs/adr/NNNN-titre-en-kebab.md`, en français. `docs/adr/README.md` est l'index. `docs/adr.html` est **généré** : ne l'éditez jamais à la main.

## 1. Choisir l'action

| Situation | Action |
|---|---|
| Nouvelle décision | Nouvel ADR, statut **Proposé** (ou **Accepté** si l'utilisateur le décide explicitement). |
| La décision d'un ADR change, en tout ou en partie | **Nouvel ADR** qui remplace l'ancien. Ne réécrivez jamais la décision d'un ADR accepté. |
| Correction factuelle ou clarification sans changement de décision | Modifier l'ADR existant. |

En cas de doute entre modifier et remplacer, demandez à l'utilisateur.

## 2. Rédiger

1. Numéro : le plus grand `NNNN` de `docs/adr/` + 1, sur 4 chiffres. Nom de fichier en minuscules, sans accent, mots séparés par `-`.
2. Partez de [template.md](template.md). Première ligne exacte : `# ADR NNNN — Titre` (tiret cadratin `—`, que le générateur analyse).
3. Métadonnées en liste, juste sous le titre, au format `- **Clé** : valeur` :
   - `Statut` (obligatoire) : `Proposé`, `Accepté`, `Remplacé par l'[ADR NNNN](…)`, ou `Accepté, partiellement remplacé par l'[ADR NNNN](…)` suivi d'une phrase qui dit ce qui change et ce qui reste en vigueur ;
   - facultatifs : `Portée`, `Remplace` / `Remplace partiellement` (avec le périmètre), `Complète`.
4. Sections obligatoires, dans cet ordre : `## Contexte`, `## Décision`, `## Options envisagées` (une `###` par option, avec la raison du rejet), `## Conséquences` (`### Positives`, `### Négatives`), `## Critères de réévaluation`.
5. Contenu :
   - une décision vérifiable, chiffrée quand c'est possible (plafonds, taux, garanties) ;
   - aucune contradiction non déclarée avec un ADR accepté : lancez le skill `rule-verification` ;
   - le vocabulaire du jeu (pli, codex, exemplaire, réserve, brique) et la typographie française (« », espaces insécables, ’, virgule décimale) ;
   - le sous-ensemble Markdown que gère `build_adr.py` : titres, paragraphes, listes (imbriquées sur 2 espaces), tableaux, citations `>`, `**gras**`, `*italique*`, `` `code` ``, liens. Pas de HTML, d'image ni de bloc de code.
   - liens relatifs : `[ADR 0004](0004-progression-atteignable.md)` vers un autre ADR, `../game-design.md` ou `../plis.html#chances` vers le reste de la doc.

## 3. Propager

- **ADR remplacé** : mettez à jour sa ligne `Statut` (remplacé, ou partiellement remplacé, avec le lien et le périmètre). Le reste de son texte ne change pas.
- **`docs/adr/README.md`** : ajoutez la ligne dans la table d'index et mettez à jour le statut des ADR remplacés (par exemple « Accepté, contenu des plis remplacé par 0011 »).
- **`docs/scripts/build_adr.py`** : ajoutez une entrée `XREFS["NNNN"]` avec 1 à 3 renvois `(page.html#ancre, "Libellé")` vers les pages qui illustrent la décision. Vérifiez que les ancres existent (`grep -n 'id="ancre"' docs/page.html`).
- **`docs/game-design.md`** et les pages HTML : alignez les règles décrites sur la nouvelle décision. Dans `docs/boussole.html`, les renvois « ADR NNNN » doivent pointer vers le bon ADR.

## 4. Générer et vérifier

```sh
python3 docs/scripts/build_adr.py      # doit afficher « N ADR écrits dans docs/adr.html »
```

- Le nombre d'ADR affiché correspond au nombre de fichiers.
- `git diff docs/adr.html` ne touche que la zone générée.
- Prévisualisez `adr.html#adr-NNNN` avec le skill `doc-preview` : statut, tableaux, listes et renvois s'affichent correctement.
- Terminez par le skill `rule-verification` sur l'ensemble de la modification.
