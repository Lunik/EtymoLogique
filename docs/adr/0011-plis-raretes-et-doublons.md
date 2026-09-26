# ADR 0011 — Plis à raretés, doublons convertis en encre

- **Statut** : Accepté, partiellement remplacé par l'[ADR 0012](0012-briques-rationnees.md). Un doublon ajoute désormais un exemplaire à la réserve, et, depuis l'[ADR 0019](0019-encre-a-chaque-doublon.md), chaque doublon rapporte aussi de l'encre : la moitié du barème sous le plafond, le barème complet au-delà. Depuis l'[ADR 0020](0020-deux-plis-en-attente-et-sabliers.md), l'encre s'échange aussi contre des sabliers (1 goutte) et l'indice coûte 30 gouttes. Le tirage, les raretés, la garantie et la transparence restent régis par le présent ADR. Partiellement remplacé aussi par l'[ADR 0015](0015-codex-fascicules-et-legendaires.md) : les légendaires inconnues sont regroupées en une ligne, sans leur nombre ; et par l'[ADR 0016](0016-plis-et-jaquettes-par-fascicule.md) : un pli ne tire que parmi les briques de son fascicule, et la garantie se compte par fascicule.
- **Remplace partiellement** : [ADR 0008](0008-energie-et-plis.md), pour le contenu des plis

## Contexte

L'ADR 0008 prévoyait des plis qui ne donnent que des briques nouvelles et utiles, sans doublon. Ce fonctionnement remplit le codex trop vite : chaque pli est une nouveauté garantie, et la découverte perd de sa valeur. Or l'attente, la surprise et la rareté font partie du plaisir de collection.

Il faut ralentir le remplissage sans rendre le jeu frustrant, ni bloquer la progression.

## Décision

### Tirage

Chaque pli tire une brique dans **tout le catalogue du pli**, y compris les briques déjà possédées. Les doublons sont donc possibles et assumés.

La probabilité d'une brique dépend de deux paramètres d'équilibrage :

| Rareté | Symbole | Poids indicatif | Encre rendue par un doublon |
|---|---|---|---|
| Commune | triangle | 62 | 2 gouttes |
| Peu commune | carré | 26 | 4 gouttes |
| Rare | pentagone | 10 | 8 gouttes |
| Légendaire | diamant | 2 | 20 gouttes |

- **Type** : les suffixes ont un poids légèrement supérieur aux préfixes (1,25 contre 1), car ils se combinent plus souvent.
- **Poids d'une brique** : poids de sa rareté × poids de son type, réparti entre les briques de même rareté et de même type.

Ces valeurs sont des paramètres versionnés de la couche d'équilibrage ([ADR 0009](0009-contenu-et-equilibrage.md)). La rareté ne dépend jamais du niveau de confiance d'une étymologie.

Il y a exactement quatre niveaux de rareté, chacun avec sa forme. Pour les trois premiers, le nombre de côtés croît avec la rareté : triangle, carré, pentagone. Le diamant, réservé aux légendaires, est à part : il ne suit pas cette progression et se reconnaît à sa silhouette, un losange étiré nettement plus haut que large. Ce vocabulaire reste distinct du cercle des états de retour et des traits de la confiance éditoriale. La forme est toujours accompagnée de son libellé ou d'un nom accessible ; ses couleurs sont fixées par la charte ([identité](../identite.html#formes)).

### Doublons et encre

> Remplacé par l'[ADR 0012](0012-briques-rationnees.md) : un doublon ajoute un exemplaire (5 au plus par brique) ; le barème d'encre ci-dessus ne s'applique qu'au-delà de ce plafond.

- Un doublon augmente le nombre d'exemplaires de la brique (×2, ×3…) et rapporte des **gouttes d'encre**, d'autant plus que la brique est rare.
- L'encre s'échange contre des **indices**, 10 gouttes dans la démonstration.
- Plus tard, elle pourra peut-être servir à forger une brique choisie, sous réserve d'un ADR dédié.
- L'encre n'est ni achetable ni convertible en argent.

### Garantie de nouveauté

- Tant qu'il reste des briques inconnues, une brique nouvelle est **garantie au plus tard au 6ᵉ pli** après la dernière nouveauté.
- Le compteur est visible par le joueur.
- Quand toutes les briques sont connues, chaque pli donne un doublon et de l'encre.

### Transparence

L'écran des plis affiche en permanence :

- les chances par rareté et par type ;
- les chances exactes de chaque brique, les briques inconnues restant en silhouette avec leur rareté ;
- l'état de la garantie ;
- l'encre disponible ;
- l'historique des tirages.

Les pourcentages affichés sont calculés à partir des poids réels, jamais arrondis de manière trompeuse.

### Garde-fous conservés

- Les briques indispensables au tutoriel et au chemin critique ne dépendent jamais d'un tirage aléatoire ([ADR 0004](0004-progression-atteignable.md)) : elles viennent de la réserve de départ et des plis de jalon, dont le contenu est déterministe ([ADR 0012](0012-briques-rationnees.md)).
- L'énergie ne limite que les plis, jamais les fusions.
- Aucun paiement, aucune publicité et aucune monnaie premium dans le MVP.
- Le tirage et l'attribution restent atomiques, idempotents et calculés par le serveur.

### Rythme visé

Une simulation de 20 000 parties sur le catalogue de démonstration (4 briques de départ, 5 à découvrir) donne :

| Garantie | Plis pour tout découvrir (médiane) | 90ᵉ centile |
|---|---|---|
| au 6ᵉ pli | 24 | 29 |
| au 10ᵉ pli | 34 | 43 |
| aucune | 92 | 154 |

Avec la garantie au 6ᵉ pli et un pli toutes les 12 heures, le catalogue de démonstration se complète en environ deux semaines, sans série de malchance interminable. Ces chiffres seront recalculés à chaque version du catalogue.

## Options envisagées

### Nouveauté garantie à chaque pli (ADR 0008)

Écartée : le codex se remplit trop vite et les plis perdent leur intérêt.

### Hasard pur, sans garantie

Écarté : la simulation montre des séries de plus de 150 plis pour 10 % des joueurs, ce qui est trop frustrant.

### Doublons sans compensation

Écartés : un doublon doit toujours rapporter quelque chose.

## Conséquences

### Positives

- La découverte redevient rare et désirable, et les briques rares créent de vrais moments forts.
- Les doublons gardent une valeur grâce à l'encre et aux indices.
- Le rythme de remplissage est réglable par les poids et la garantie, sans toucher aux faits linguistiques.
- Toutes les chances sont transparentes.

### Négatives

- Une économie de plus (l'encre) à équilibrer et à surveiller.
- Le risque d'une perception « machine à sous » si les chances ou la garantie ne sont pas clairement affichées.
- Le rythme doit être recalculé à chaque ajout de briques.

## Critères de réévaluation

Revoir les poids et la garantie si le taux de nouveauté observé s'écarte nettement de la simulation, ou si les tests montrent de la frustration. Toute monétisation liée aux plis ou à l'encre exige un nouvel ADR couvrant l'éthique, la conformité (notamment les règles sur les coffres à butin), le contrôle parental et la transparence des probabilités.
