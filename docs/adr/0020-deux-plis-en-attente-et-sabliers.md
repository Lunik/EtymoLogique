# ADR 0020 — Deux plis en attente, sabliers gagnés par l'encre

- **Statut** : Accepté
- **Remplace partiellement** :
  - [ADR 0008](0008-energie-et-plis.md), pour la capacité d'énergie (une charge) et pour l'interdiction d'avancer la recharge, qui ne vaut plus que pour les paiements ;
  - [ADR 0011](0011-plis-raretes-et-doublons.md), pour l'usage de l'encre (indices seulement) et le prix de l'indice ;
  - [ADR 0018](0018-sabliers-et-boutique.md), pour les sabliers gratuits, qui entrent dans le MVP, et leur prix en encre ; la boutique payante reste proposée pour après le MVP ;
  - [ADR 0019](0019-encre-a-chaque-doublon.md), pour l'encre d'un pli qui donne une brique nouvelle et pour le prix de l'indice.

## Contexte

Avec une seule charge rechargée en 12 h, un joueur qui ne vient qu'une fois par jour perd une charge sur deux : la recharge s'arrête dès que la charge est pleine, et il n'ouvre qu'un pli par jour au lieu de deux.

L'encre, depuis l'ADR 0019, sert aux indices. Nous voulons qu'elle serve aussi à gagner du temps, et garantir à un joueur qui ne paie pas **au moins un pli offert tous les 3 jours** grâce à l'encre changée en sabliers. Avec le barème de l'ADR 0019 (environ 1 goutte par pli) et un sablier à 10 gouttes, il faudrait près de 120 plis pour gagner un pli.

## Décision

### Deux plis en attente

- L'énergie compte **2 charges au plus**. Une charge revient toutes les **12 h**.
- La recharge tourne tant que l'énergie est sous 2. Quand les deux charges sont prêtes, **le temps s'arrête** et l'interface affiche « 2 / 2 : deux plis prêts », sans compte à rebours.
- Ouvrir un pli consomme une charge. Si l'énergie était pleine, la recharge repart de zéro ; sinon, la recharge en cours continue.
- Un joueur qui vient une fois par jour ouvre donc deux plis, comme celui qui vient deux fois. Le rythme maximal ne change pas : deux plis par jour.
- La capacité et la durée restent des paramètres d'équilibrage ([ADR 0009](0009-contenu-et-equilibrage.md)).

### Encre gagnée à chaque pli

| Résultat du pli | Encre |
|---|---|
| Brique nouvelle | 2 gouttes |
| Doublon sous le plafond | 2 gouttes + 1, 2, 4 ou 10 selon la rareté |
| Réserve pleine | 2 gouttes + 2, 4, 8 ou 20 selon la rareté |

Chaque pli rapporte donc **au moins 2 gouttes**. Les bonus de doublon de l'ADR 0019 et le barème de la réserve pleine de l'ADR 0011 s'ajoutent à cette base.

### Sabliers gratuits dans le MVP

- Un **sablier** fait avancer d'une heure la recharge en cours. Il coûte **1 goutte**. Certains jalons en donnent aussi.
- Il ne s'utilise que si l'énergie est sous 2. Le temps qui dépasse la charge en cours passe à la suivante ; il n'est perdu que si l'énergie atteint 2, et l'interface l'annonce avant de confirmer.
- Les plafonds de l'ADR 0018 s'appliquent : 12 sabliers utilisés par 24 h glissantes, 36 détenus au plus.
- Le sablier ne change ni les chances, ni la garantie, ni le filet. L'achat de sabliers contre de l'argent reste régi par l'ADR 0018, proposé, et n'est pas dans le MVP.

### Indice

Un indice coûte **30 gouttes**, soit l'équivalent de 30 sabliers, environ deux plis et demi. Le joueur choisit entre comprendre plus vite et ouvrir plus de plis.

### Garantie du pli offert

Un joueur qui vient au moins une fois par jour ouvre ses 2 plis quotidiens, soit 6 plis en 3 jours. Il gagne au moins 6 × 2 = 12 gouttes, soit 12 sabliers, soit une charge de 12 h : **au moins un pli offert tous les 3 jours**, sans payer, par construction.

Simulation de 5 000 parties sur le catalogue de démonstration (réserve de départ 4 × 2, deux fascicules, joueur qui découvre dès que possible et change toute son encre en sabliers) :

| Mesure | Médiane | 10ᵉ centile | 90ᵉ centile |
|---|---|---|---|
| Encre gagnée en 6 plis (minimum observé : 13) | 18 | 16 | — |
| Encre par pli | 3 en moyenne | — | — |
| Plis pour tout découvrir | 20 | 16 | 24 |
| Jours pour tout découvrir, sans sablier | 10 | 8 | 12 |
| Jours pour tout découvrir, encre changée en sabliers | 7,5 | 6,1 | 9 |

L'encre gagnée pendant la démo (59 gouttes en médiane) permet aussi environ deux indices, si le joueur les préfère aux sabliers.

## Options envisagées

### Garder une seule charge

Écartée : elle pénalise le joueur qui vient une fois par jour et l'incite à revenir à heure fixe, ce qui ressemble à une fausse urgence.

### Trois charges ou plus

Écartée pour l'instant : le joueur pourrait accumuler et ouvrir une longue série de plis, ce qui accélère le remplissage du codex et affaiblit le rituel.

### Garantir le pli offert par le hasard des doublons seulement

Écartée : l'encre des doublons varie trop d'une partie à l'autre, et la garantie ne serait qu'une moyenne.

### Sablier à 10 gouttes avec une base plus forte

Écartée : il faudrait 20 gouttes par pli, et tous les prix d'encre deviendraient difficiles à lire. Un sablier à 1 goutte donne une règle simple : une goutte, une heure.

### Indice à 10 gouttes

Écarté : avec environ 3 gouttes par pli, le joueur aurait un indice tous les trois plis, ce qui affaiblit la déduction.

## Conséquences

### Positives

- Le joueur n'a plus besoin de revenir deux fois par jour pour ne rien perdre.
- L'encre a toujours une utilité immédiate et lisible : une goutte, une heure.
- Le pli offert tous les 3 jours est garanti par la règle, pas par la chance.
- La future boutique ne vend que ce qu'on gagne déjà en jouant.

### Négatives

- Le codex se remplit plus vite : environ 7,5 jours au lieu de 10 sur la démo si toute l'encre devient des sabliers. Le rythme doit être recalculé par fascicule.
- L'indice coûte trois fois plus qu'avant : il faudra vérifier que les joueurs bloqués y ont encore accès.
- L'écran des plis affiche un compteur de plus (sabliers).

## Critères de réévaluation

- Des joueurs qui viennent chaque jour mais n'obtiennent pas un pli offert tous les 3 jours : revoir la base d'encre ou le prix du sablier.
- Un fascicule complété nettement plus vite que prévu : réduire la base d'encre ou relever le prix du sablier.
- Des joueurs bloqués qui ne prennent jamais d'indice faute d'encre : baisser le prix de l'indice.
