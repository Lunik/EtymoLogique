# ADR 0021 — Logo : le sceau ÉL affiné

- **Statut** : Accepté
- **Portée** : logo, icône des pages, navigation du dossier et future application
- **Complète** : [ADR 0017](0017-licences.md) (le logo reste réservé, hors des licences libres)

## Contexte

- Le dossier affichait déjà un sceau « ÉL » : une tuile Corail inclinée, avec une ombre dure et des initiales en monospace. Ce sceau n'avait jamais été décidé comme logo, ni décrit.
- L'[ADR 0017](0017-licences.md) réserve le nom et le logo : il faut savoir précisément ce qui est protégé.
- Dix pistes ont été comparées sur la [page de travail du logo](../logo.html) : sceau affiné, deux briques, trait d'union, accent aigu, miroir des écritures, racine, casse d'imprimerie, guillemets, généalogie d'une lettre et ligature ÉL. Chacune a été vue en grand, en logo horizontal, en nocturne, en monochrome et à 64, 32 et 16 px.

## Décision

Le logo d'ÉtymoLogique est le **sceau ÉL affiné** (piste 01 de la [page de travail](../logo.html#piste-1)).

### Symbole

- Une tuile carrée à coins arrondis : rayon égal à 27 % du côté (12 pour 44).
- Aplat Corail (`--c-action`), bordure Encre (`--fixed-ink`) d'environ 5 % du côté.
- Ombre dure décalée d'environ 11 % du côté en x et en y, sans flou : Encre sur fond clair, Crème à 28 % (`--dark-shadow`) sur fond sombre.
- Inclinaison de −6°. Au survol, le sceau pivote jusqu'à +8° avec l'easing `--ease-spring`, et reste immobile sous `prefers-reduced-motion`.
- Les initiales **ÉL**, en serif gras (`--serif`), toujours en Encre fixe : jamais en blanc ni en Crème sur le Corail.

### Logo horizontal

- Le sceau, suivi de « ÉtymoLogique » en serif gras, en Encre (`--ink`), avec un espace égal à environ un tiers du côté du sceau.
- Le nom s'écrit toujours avec un É majuscule accentué et un L majuscule.

### Déclinaisons

- **Couleur** : sur Papier, Crème, Encre ou Nuit uniquement, jamais sur une couleur de ressource.
- **Monochrome** : tuile Crème, bordure, initiales et ombre en Encre (ou l'inverse sur fond sombre).
- **Où le monochrome s'impose** : sur la bande Corail du pied de page (un Corail sur Corail disparaîtrait) et sur la face des plis, dont la palette se limite aux neutres et à l'Ambre ([ADR 0016](0016-plis-et-jaquettes-par-fascicule.md)).
- **Taille minimale** : 16 px pour le symbole seul, 24 px de haut pour le logo horizontal.
- **Icône des pages** : `docs/assets/logo.svg`, référencée par toutes les pages du dossier.

### Interdits

- Pas d'autre couleur que le Corail pour la tuile, pas de dégradé, pas d'ombre colorée ni floue.
- Pas de déformation, pas d'autre inclinaison au repos, pas d'initiales en monospace ou en sans.
- Le sceau Ambre des plis reste un objet de jeu distinct : il est rond, et ce n'est pas le logo.

## Options envisagées

### Deux briques (étymo- / -logique)

Elle raconte bien la fusion, mais emprunte les couleurs du préfixe et du suffixe, ce qui leur donne un deuxième sens, et elle se lit mal à 16 px.

### Trait d'union en brique Corail

L'idée est forte, mais le trait d'union disparaît dès 32 px. Il faudrait redessiner les proportions, sans garantie de lisibilité.

### Miroir des écritures (É / Э)

Elle parle explicitement des langues, mais fait de Palimpseste, la couleur des langues, une couleur de marque.

### Généalogie d'une lettre et ligature ÉL

Ce sont les pistes les plus originales et les plus nettes, mais elles rompent avec le sceau déjà présent sur toutes les pages. La généalogie demande en plus une explication.

### Accent aigu, racine, casse d'imprimerie, guillemets

Elles sont trop courantes (accent, arbre), trop proches d'autres jeux (Scrabble), trop ambiguës (les chevrons ressemblent aux boutons d'un lecteur) ou illisibles en icône.

## Conséquences

### Positives

- Le logo garde la continuité avec le dossier existant : le changement est un affinage, pas une rupture.
- Il est très lisible en petit, et se décline en monochrome sans perte.
- Le Corail reste la seule couleur de marque, conformément à la charte.

### Négatives

- Les initiales seules ne disent rien des langues : c'est le nom et le jeu qui portent l'étymologie.
- Les initiales sont encore composées avec les polices système de la charte. Avant toute publication hors du dossier (magasin d'applications, impression), le sceau devra être vectorisé à partir d'une police sous licence libre.

## Critères de réévaluation

- Un test auprès de joueurs montre que le sceau est confondu avec un autre jeu ou une autre marque.
- La vectorisation dans une police libre dénature le dessin des initiales.
- Une identité propre à l'application (icône de magasin, écran de lancement) exige un symbole plus distinctif.
