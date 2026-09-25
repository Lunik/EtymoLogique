# ADR 0004 — Progression pilotée par un graphe d'obtention vérifiable

- **Statut** : Accepté, complété par l'[ADR 0012](0012-briques-rationnees.md) : les briques étant rationnées, la fermeture est complétée par une simulation de réserve.

## Contexte

Le joueur ne peut pas saisir un mot arbitraire pour créer une brique. Toute brique indispensable doit donc provenir d'une graine, d'une fusion, d'un jalon ou d'un pli. Une dépendance circulaire ou un tirage manquant peut bloquer définitivement la progression.

## Décision

Chaque version du contenu définit un graphe d'obtention distinct du graphe linguistique :

- les nœuds sont les objets déblocables ;
- une hyperarête de recette relie plusieurs ingrédients à ses résultats ;
- les graines, jalons et récompenses déterministes sont des sources ;
- les plis sont des sources conditionnelles avec un ensemble d'éligibilité explicite.

Avant publication, un validateur calcule une fermeture par point fixe :

1. initialiser l'ensemble avec les graines et récompenses garanties ;
2. ajouter le résultat de toute recette dont les ingrédients et préconditions sont satisfaits ;
3. ajouter les récompenses de jalons devenus satisfaits ;
4. répéter jusqu'à ce qu'aucun objet ne soit ajouté ;
5. comparer l'ensemble obtenu aux objets déclarés atteignables.

Le validateur échoue si :

- une brique requise n'est pas atteignable ;
- une recette du chemin critique dépend uniquement d'un tirage aléatoire ;
- un cycle n'a aucun point d'entrée ;
- un pli peut se retrouver sans récompense valide ni compensation ;
- une précondition référence un contenu absent ou d'une autre version ;
- une recette accessible exige une brique que le joueur ne peut posséder à ce stade.

Le système doit aussi simuler les états importants, notamment nouveau joueur, joueur ayant épuisé un pool de pli et migration depuis la version précédente.

Les contenus optionnels peuvent être volontairement inatteignables seulement s'ils sont explicitement marqués comme non publiés ou réservés à une future version. Ils ne comptent alors pas dans le codex visible.

## Options envisagées

### Relecture manuelle

Écartée comme seul contrôle : les chemins combinatoires dépassent rapidement ce qu'une revue peut garantir.

### Déblocage de secours universel

Écarté : masquerait les erreurs de graphe et rendrait la progression incohérente.

### Plis purement aléatoires

Écartés pour les briques indispensables : aucune garantie de progression ni de test reproductible.

## Conséquences

### Positives

- absence d'impasse connue dans une version publiée ;
- changements de contenu testables en intégration continue ;
- visualisation possible des zones trop linéaires ou trop dépendantes des graines ;
- base solide pour calculer des plis utiles.

### Négatives

- modèle de progression et outils dédiés à maintenir ;
- fermeture simple insuffisante pour certaines contraintes temporelles ou quantitatives ;
- besoin de scénarios supplémentaires lorsque l'économie se complexifie.

## Critères de réévaluation

Ajouter une simulation d'états ou un solveur plus riche si des coûts, choix exclusifs ou événements temporels rendent la fermeture monotone insuffisante.

