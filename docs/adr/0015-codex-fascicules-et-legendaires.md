# ADR 0015 — Codex par fascicule et légendaires secrètes

- **Statut** : Accepté
- **Remplace partiellement** : [ADR 0011](0011-plis-raretes-et-doublons.md), pour l'affichage des chances des briques légendaires inconnues
- **Complète** : [ADR 0014](0014-sources-et-fascicules.md) (fascicules dans le codex)

## Contexte

Avec les fascicules ([ADR 0014](0014-sources-et-fascicules.md)), le joueur veut savoir où il en est : quelles cartes appartiennent à quel fascicule, et combien il lui en reste à trouver. Le codex affichait jusqu'ici un compteur global et quelques silhouettes.

Mais un compteur exact dévoile tout, y compris le nombre de briques légendaires (forme : diamant). Or la découverte d'une légendaire doit rester une surprise : le joueur ne doit pas savoir combien il en existe, ni combien il lui en manque. L'ADR 0011 imposait d'afficher, sur l'écran des plis, la chance exacte de chaque brique, légendaires inconnues comprises, chacune avec sa silhouette. Cela révèle leur nombre.

## Décision

### Le codex s'organise par fascicule

- Chaque carte indique son fascicule. Une langue appartient au fascicule qui l'a introduite.
- Le codex propose un **tri par fascicule**, qui regroupe les cartes sous un titre par fascicule, et un **filtre par fascicule**.
- Chaque fascicule a son **compteur de complétude** (« 10 / 11 cartes »), avec une barre de progression. Toucher un fascicule n'affiche que ses cartes.
- Les compteurs des filtres par type suivent le fascicule choisi.

### Des silhouettes pour ce qui reste à découvrir

- Toute carte encore inconnue d'un fascicule publié apparaît en **silhouette**, avec sa piste de sens et, pour une brique, sa rareté. Elle compte dans le compteur de son fascicule.

### Les légendaires restent secrètes

- Une **brique légendaire inconnue** n'a ni carte, ni silhouette, et n'entre dans aucun compteur.
- Un **mot qui exige une légendaire inconnue** est traité de même, pour ne pas la trahir. Sa silhouette apparaît dès que la légendaire est trouvée.
- Une légendaire trouvée a sa carte, mais **ne compte jamais** dans les totaux : sinon le total changerait à sa découverte et trahirait les autres. Elle apparaît à part : « 1 légendaire trouvée », avec le diamant.
- Un fascicule est donc « complet » quand toutes ses cartes non légendaires sont découvertes.

### Écran des plis : chances exactes, nombre caché

- Remplace, dans l'ADR 0011, l'obligation d'afficher la chance de **chaque** brique pour les légendaires inconnues.
- Les légendaires inconnues sont regroupées en **une seule ligne** : « Légendaires inconnues », avec le diamant et la somme exacte de leurs chances. Leur nombre n'est jamais affiché.
- Les chances par rareté, par type et pour chaque autre brique restent exactes et affichées. Une légendaire trouvée retrouve sa propre ligne.
- La garantie de nouveauté et le filet d'utilité ne changent pas.

## Options envisagées

### Compteurs exacts, légendaires comprises

Écartée : le joueur saurait combien de légendaires existent et combien il lui en manque. La surprise disparaît.

### Aucun compteur

Écartée : le joueur ne saurait pas où il en est dans un fascicule, alors que c'est ce qui donne envie de le terminer.

### Silhouette de légendaire sans compteur

Écartée : chaque silhouette dévoile une légendaire à venir.

### Garder le détail des légendaires inconnues sur l'écran des plis

Écartée : une ligne par légendaire inconnue révèle leur nombre, et annule le secret gardé dans le codex.

## Conséquences

### Positives

- Le joueur voit sa progression par fascicule, et sait quand il l'a complété.
- Une légendaire reste une vraie surprise, dans le codex comme dans les plis.
- La transparence des chances est préservée : la probabilité d'obtenir une légendaire reste exacte et affichée.

### Négatives

- « Complet » ne veut pas dire « tout trouvé » : il peut rester des légendaires. Le texte doit rester honnête et ne jamais annoncer qu'il ne reste plus rien.
- La garantie de nouveauté peut trahir l'existence d'au moins une légendaire : si toutes les autres briques sont connues, le message de garantie reste affiché. Le nombre, lui, reste caché.
- Un mot qui dépend d'une légendaire n'est visible qu'après elle : le validateur doit vérifier qu'aucun indice public (piste, lien, filiation) ne le dévoile avant.

## Critères de réévaluation

- Les joueurs perçoivent le regroupement des légendaires comme un manque de transparence.
- Une règle de transparence sur les coffres à butin exige le détail par objet.
- Les tests montrent que « complet » avec des légendaires encore cachées est ressenti comme trompeur.
