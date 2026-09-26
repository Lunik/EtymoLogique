# ADR 0022 — Fascicules de 20 à 30 mots, un par mois

- **Statut** : Accepté
- **Remplace partiellement** : [ADR 0014](0014-sources-et-fascicules.md), pour la taille d'un fascicule (20 à 40 mots) ; le rythme, les sources, la complétude et le reste de la publication restent en vigueur.
- **Complète** : [ADR 0012](0012-briques-rationnees.md) et [ADR 0020](0020-deux-plis-en-attente-et-sabliers.md) (rythme de découverte)

## Contexte

L'[ADR 0014](0014-sources-et-fascicules.md) fixe de 20 à 40 mots par fascicule, un fascicule environ tous les 30 jours. Un état des lieux du Wiktionnaire montre que le corpus n'est pas une contrainte : des milliers de mots formés par préfixe ou suffixe, de quoi publier des centaines de fascicules ([potentiel d'évolution](../potentiel-evolution.md)). La question est donc : combien de mots un joueur peut-il découvrir en un mois ?

- Sur le catalogue de démonstration (9 mots), il faut environ **20 plis** en médiane pour tout découvrir ([ADR 0020](0020-deux-plis-en-attente-et-sabliers.md)), soit un peu plus de 2 plis par mot : chaque découverte consomme un exemplaire de chaque brique utilisée ([ADR 0012](0012-briques-rationnees.md)).
- Un joueur assidu ouvre 2 plis par jour, plus un pli offert au moins tous les 3 jours grâce aux sabliers : environ **70 à 80 plis par mois**.

En extrapolant linéairement :

| Taille du fascicule | Plis nécessaires | Jours pour le compléter |
|---|---|---|
| 20 mots | environ 45 | environ 17 à 20 |
| 30 mots | environ 65 | environ 25 à 28 |
| 40 mots | environ 90 | environ 33 à 38 |
| 100 mots | environ 220 à 240 | environ 85 à 100 |

Au-delà de 30 mots, un joueur assidu ne peut plus compléter un fascicule avant la parution du suivant : les fascicules s'empilent et le codex devient une dette.

## Décision

- Un fascicule publie **de 20 à 30 mots**, mots croisés compris.
- Le rythme ne change pas : **un fascicule environ tous les 30 jours** ([ADR 0014](0014-sources-et-fascicules.md)).
- Les deux valeurs restent des paramètres d'équilibrage ([ADR 0009](0009-contenu-et-equilibrage.md)) : elles se recalculent par simulation sur chaque fascicule, avant publication.
- La fermeture ([ADR 0014](0014-sources-et-fascicules.md)) s'applique toujours. Avec un plafond de 30 mots, les affixes très productifs (*-able*, *-ment*, *dé-*, *in-*) doivent être introduits quand peu de mots de base publiés peuvent les recevoir, pour que les mots croisés tiennent dans le plafond.

## Options envisagées

### Garder 20 à 40 mots

Écartée : à 40 mots, il faut plus d'un mois pour compléter un fascicule, même en jouant chaque jour.

### Environ 100 mots par mois

Écartée : environ trois mois pour compléter un fascicule, et 3 à 4 mots à sourcer chaque jour pour l'équipe éditoriale.

### Environ 100 mots tous les 60 à 90 jours

Écartée : même volume par mois, mais une attente trop longue entre deux nouveautés et un codex dont la progression se voit mal (100 silhouettes d'un coup).

## Conséquences

### Positives

- Un joueur assidu peut compléter chaque fascicule dans le mois, avec quelques jours de marge.
- La charge éditoriale reste d'environ un mot sourcé par jour.
- La complétude d'un fascicule (« 24 / 27 cartes ») reste lisible dans le codex.

### Négatives

- Le choix des affixes d'un fascicule est plus contraint : un affixe qui ouvre trop de mots croisés doit attendre.
- Un joueur occasionnel ne complétera pas tous les fascicules dans le mois : les plis des anciens fascicules restent ouverts ([ADR 0016](0016-plis-et-jaquettes-par-fascicule.md)), sans pénalité.
- L'extrapolation est linéaire, à partir d'un catalogue de démonstration de 9 mots : elle devra être confirmée par une simulation sur un vrai fascicule.

## Critères de réévaluation

- La simulation d'un vrai fascicule de 30 mots dépasse 30 jours en médiane pour un joueur assidu : réduire le plafond ou revoir le rationnement.
- Les joueurs assidus complètent un fascicule en moins de deux semaines : relever le plafond.
- Les mots croisés ouverts par un affixe indispensable dépassent régulièrement le plafond.
- L'équipe veut publier ponctuellement beaucoup de contenu d'un coup (piste des fascicules spéciaux, voir le [potentiel d'évolution](../potentiel-evolution.md)) : un nouvel ADR devra le décider.
