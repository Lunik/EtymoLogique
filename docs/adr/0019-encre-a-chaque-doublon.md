# ADR 0019 — Chaque doublon rapporte de l'encre

- **Statut** : Accepté, partiellement remplacé par l'[ADR 0020](0020-deux-plis-en-attente-et-sabliers.md) : chaque pli rapporte aussi 2 gouttes de base, brique nouvelle comprise, et l'indice coûte 30 gouttes. Les bonus de doublon restent régis par le présent ADR.
- **Remplace partiellement** : [ADR 0012](0012-briques-rationnees.md), pour la valeur d'un doublon sous le plafond, qui ne rapportait qu'un exemplaire ; [ADR 0011](0011-plis-raretes-et-doublons.md), pour la source de l'encre
- **Complète** : [ADR 0018](0018-sabliers-et-boutique.md) (échange d'encre contre un sablier, proposé)

## Contexte

Depuis l'ADR 0012, un doublon ajoute un exemplaire à la réserve, et l'encre ne vient que d'un exemplaire reçu alors que la brique en a déjà 5. Or chaque découverte consomme des exemplaires : une brique atteint rarement le plafond.

Une simulation de 5 000 parties sur le catalogue de démonstration (réserve de départ 4 × 2, deux fascicules, joueur qui découvre dès que possible) le confirme : le joueur termine la démo en 20 plis en médiane, et **78 % des parties ne rapportent aucune goutte**. Les indices, et demain l'échange contre un sablier, sont donc hors de portée, et l'encre affichée à l'écran reste à zéro sans explication.

## Décision

Tout doublon rapporte de l'encre, en plus de son effet sur la réserve.

| Rareté | Doublon sous le plafond : +1 exemplaire et | Réserve pleine : aucun exemplaire, mais |
|---|---|---|
| Commune | 1 goutte | 2 gouttes |
| Peu commune | 2 gouttes | 4 gouttes |
| Rare | 4 gouttes | 8 gouttes |
| Légendaire | 10 gouttes | 20 gouttes |

- Le barème de la réserve pleine (ADR 0011) ne change pas. Sous le plafond, le doublon rapporte la moitié de ce barème, puisqu'il donne aussi un exemplaire.
- Une brique nouvelle ne rapporte pas d'encre : elle apporte déjà la découverte.
- L'indice coûte toujours 10 gouttes.
- La révélation et l'historique affichent les deux gains : « +1 exemplaire · ×3 · +1 goutte ».
- Les deux barèmes sont des paramètres versionnés d'équilibrage ([ADR 0009](0009-contenu-et-equilibrage.md)). L'encre reste non achetable et non convertible en argent.

### Rythme visé

Même simulation, avec la nouvelle règle :

| Règle | Encre à la fin de la démo (médiane) | 10ᵉ centile | 90ᵉ centile | Parties sans encre |
|---|---|---|---|---|
| Encre au-delà du plafond seulement (ADR 0012) | 0 | 0 | 4 | 78 % |
| Demi-barème sous le plafond (retenu) | 19 | 14 | 25 | 0 % |
| Barème complet sous le plafond | 38 | 28 | 48 | 0 % |

Retenu : **le demi-barème**. Il donne environ un indice tous les dix plis, et au moins un indice à 90 % des joueurs sur la démo. Le barème complet rendrait les indices trop fréquents. La simulation ne dépense pas l'encre : un joueur qui prend des indices découvre plus vite, sans changer le nombre de plis requis par le filet.

## Options envisagées

### Garder l'encre au-delà du plafond seulement

Écartée : la plupart des joueurs ne voient jamais l'encre servir, et l'écran affiche une ressource qui reste à zéro.

### Donner de l'encre à chaque découverte

Écartée : l'encre deviendrait une récompense de la réussite, alors qu'elle doit consoler le hasard du pli. Elle ferait aussi doublon avec le plaisir de la découverte.

### Baisser le coût de l'indice

Écartée : sans source régulière d'encre, même un indice à 2 gouttes resterait inaccessible pour la plupart des joueurs.

### Barème complet sous le plafond

Écarté : environ deux indices tous les dix plis, ce qui affaiblit la déduction.

## Conséquences

### Positives

- Un doublon n'est plus jamais « juste » un exemplaire : il fait toujours progresser quelque chose de visible.
- Les indices deviennent accessibles à tous les joueurs, à un rythme mesuré.
- L'échange d'encre contre un sablier (ADR 0018) aurait une source réelle.

### Négatives

- Deux barèmes à expliquer au lieu d'un.
- L'encre circule davantage : il faudra surveiller le nombre d'indices utilisés par découverte.
- Le rythme devra être recalculé à chaque nouveau fascicule, comme les autres paramètres des plis.

## Critères de réévaluation

- Plus d'un indice utilisé pour trois découvertes en moyenne : baisser le demi-barème ou augmenter le coût de l'indice.
- Des joueurs actifs qui n'ont pas pu prendre un indice après dix plis : relever le barème.
