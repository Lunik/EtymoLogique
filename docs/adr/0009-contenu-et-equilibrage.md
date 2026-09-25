# ADR 0009 — Séparation des faits linguistiques et de l'équilibrage

- **Statut** : Accepté

## Contexte

La rareté d'une brique, son apparition dans un pli et le moment où elle est jouable peuvent changer après un test. Ces paramètres ne sont pas des propriétés linguistiques. Les mélanger aux faits rendrait une correction d'équilibrage difficile à distinguer d'une correction scientifique.

## Décision

Le catalogue comporte deux couches référencées par identifiants :

### Couche linguistique

Elle contient formes, langues, sens, morphèmes, relations, sources, niveaux de confiance et explications factuelles.

### Couche ludique

Elle contient recettes jouables, graines, jalons, visibilité, difficulté, indices, groupes de progression, poids de rareté et de type des plis, garantie de nouveauté, conversion des doublons en encre et récompenses.

La couche ludique référence la couche linguistique, jamais l'inverse. Un objet linguistique peut exister sans être jouable. Une brique ou une recette ne peut pas inventer un fait absent de la couche linguistique validée.

Les versions des deux couches sont associées dans un manifeste de publication. Un ajustement de poids de pli peut publier une nouvelle version ludique réutilisant exactement la même version linguistique. Une correction de relation publie une nouvelle version linguistique et déclenche la revue des recettes dépendantes.

Le niveau de confiance d'une étymologie ne détermine pas sa rareté. La rareté reflète uniquement la progression du jeu et doit employer un vocabulaire visuel différent.

## Options envisagées

### Un document unique par mot

Écarté : pratique pour l'affichage, mais mélange vérité linguistique, état du joueur et paramètres temporaires.

### Copier les faits dans chaque recette

Écarté : duplication, divergences et corrections incomplètes.

### Déduire automatiquement tout l'équilibrage du graphe

Écarté : des métriques peuvent assister l'équipe, mais la qualité d'une progression reste une décision de design.

## Conséquences

### Positives

- rééquilibrage sans altération des sources ;
- audit clair des corrections ;
- réutilisation d'un même fait dans plusieurs recettes ;
- possibilité de tester plusieurs progressions sur un catalogue commun.

### Négatives

- deux cycles de version à coordonner ;
- compilation nécessaire pour une vue client efficace ;
- dépendances à invalider lorsqu'un fait change.

## Critères de réévaluation

Le format physique peut être combiné pour le déploiement, mais les responsabilités et versions logiques doivent rester séparées.

