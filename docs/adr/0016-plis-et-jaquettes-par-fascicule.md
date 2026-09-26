# ADR 0016 — Un pli et une jaquette par fascicule

- **Statut** : Accepté
- **Remplace partiellement** : [ADR 0011](0011-plis-raretes-et-doublons.md), pour le catalogue du tirage et le compteur de la garantie ; [ADR 0012](0012-briques-rationnees.md), pour le compteur du filet d'utilité
- **Complète** : [ADR 0014](0014-sources-et-fascicules.md) (fascicules), [ADR 0015](0015-codex-fascicules-et-legendaires.md) (légendaires secrètes)

## Contexte

Jusqu'ici, un pli tirait une brique dans tout le catalogue, et sa jaquette tournait parmi dix modèles selon le numéro du pli. Avec les fascicules ([ADR 0014](0014-sources-et-fascicules.md)), deux besoins apparaissent :

- donner une identité à chaque fascicule, visible à chaque ouverture ;
- laisser le joueur choisir ce qu'il cherche : les briques nouvelles d'un fascicule récent, ou des exemplaires d'un ancien fascicule pour refaire sa réserve.

Avec un seul catalogue, plus il y a de fascicules, moins un pli a de chances de donner une brique du fascicule qui intéresse le joueur.

## Décision

### Une jaquette par fascicule

- Chaque fascicule a **sa propre jaquette**. Tous les plis de ce fascicule la portent.
- La jaquette ne dit que le fascicule, que le joueur a choisi. Ni son motif ni sa couleur ne trahissent la brique tirée, sa rareté ou sa langue. La palette reste limitée aux neutres et à l'Ambre.
- Les dix jaquettes existantes sont attribuées aux fascicules n° 01 à 10, dans l'ordre : Rosette, Argile, Aleph, Boustrophédon, Routes des mots, Arbre des langues, Lapidaire, Casse, Lettrine, Palimpseste. Chaque fascicule suivant demande une jaquette nouvelle.

### Choisir un fascicule, puis ouvrir son pli

- L'écran des plis commence par le **choix d'un fascicule** parmi ceux qui sont parus. Chaque fascicule y montre sa jaquette, ses briques connues (légendaires inconnues exclues, [ADR 0015](0015-codex-fascicules-et-legendaires.md)) et les exemplaires en réserve.
- Une fois le fascicule choisi, l'écran d'ouverture s'affiche. Le joueur peut revenir au choix à tout moment, sauf pendant une ouverture.
- Le joueur peut ouvrir le pli de **n'importe quel fascicule paru, à tout moment**, en particulier pour refaire sa réserve d'anciennes briques.
- L'énergie reste unique : une charge ouvre un pli, quel que soit le fascicule.

### Catalogue d'un pli

- Remplace, dans l'ADR 0011, le tirage « dans tout le catalogue du pli » : un pli tire **uniquement parmi les briques de son fascicule**, c'est-à-dire ses briques nouvelles et les briques qu'il reprend comme ingrédients.
- Poids, raretés, doublons, plafond et encre ne changent pas. Les chances affichées sont celles du fascicule choisi.

### Garantie et filet par fascicule

- **Garantie de nouveauté** : le compteur de 6 plis se tient par fascicule. Il ne porte que sur les briques inconnues de ce fascicule.
- **Filet d'utilité** : le compteur de 5 plis se tient par fascicule, et la brique utile garantie est choisie parmi ses briques. Si aucune brique du fascicule ne peut rendre une découverte possible, l'écran le dit et invite à choisir un autre fascicule.

## Options envisagées

### Jaquette du dernier fascicule paru, tirage dans tout le catalogue

Écartée : le joueur ne choisit rien, et plus le catalogue grandit, moins il a de chances d'obtenir une brique précise.

### Rotation des jaquettes des fascicules parus selon le numéro du pli

Écartée : la jaquette ne dirait plus rien du contenu, et l'identité de chaque fascicule se perdrait.

### Garantie et filet communs à tous les fascicules

Écartés : un joueur pourrait remplir le compteur sur un fascicule déjà complet, puis voir la garantie profiter à un autre, ou l'inverse. Un compteur par fascicule reste lisible.

## Conséquences

### Positives

- Chaque fascicule a une identité visible dans le codex, sur l'écran des plis et à chaque ouverture.
- Le joueur choisit ce qu'il cherche, et peut refaire sa réserve d'anciennes briques sans subir la taille du catalogue.
- La probabilité d'une brique reste stable quand de nouveaux fascicules paraissent.

### Négatives

- Une étape de plus avant chaque ouverture.
- Le rythme calculé dans l'[ADR 0012](0012-briques-rationnees.md) (22 plis en médiane sur un catalogue unique) doit être recalculé par fascicule.
- Une brique reprise par plusieurs fascicules s'obtient dans chacun d'eux : ses chances réelles dépendent des choix du joueur.
- Au-delà de dix fascicules, chaque nouveau fascicule demande une jaquette nouvelle.

## Critères de réévaluation

- Les joueurs trouvent l'étape de choix lourde, ou ouvrent presque toujours le même fascicule.
- Le rythme par fascicule s'écarte nettement de la cible (un joueur actif doit pouvoir découvrir l'essentiel d'un fascicule avant le suivant).
- Le filet renvoie souvent vers « un autre fascicule » : il faudrait alors un filet commun.
