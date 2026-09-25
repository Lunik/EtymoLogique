# ADR 0012 — Briques rationnées, exemplaires obtenus par les plis

- **Statut** : Accepté
- **Remplace partiellement** : [ADR 0011](0011-plis-raretes-et-doublons.md), pour la valeur des doublons
- **Complète** : [ADR 0004](0004-progression-atteignable.md) (atteignabilité avec quantités), [ADR 0007](0007-etat-et-economie-autoritaires.md) (consommation sous autorité serveur), [ADR 0008](0008-energie-et-plis.md) (rôle des plis)

## Contexte

Jusqu'ici, une brique obtenue restait utilisable sans limite. Le joueur pouvait donc tout essayer dès qu'il possédait les briques, et les doublons n'avaient de valeur que par l'encre. Le codex se remplissait vite, et les plis perdaient leur intérêt une fois les briques connues.

Nous voulons que chaque brique compte : le joueur dispose d'un nombre limité d'exemplaires, et les plis sont le seul moyen d'en obtenir de nouveaux. Il faut le faire sans punir l'expérimentation, qui reste le cœur du jeu, et sans créer d'impasse.

## Décision

### Réserve et exemplaires

- Chaque brique connue a un nombre d'**exemplaires** : c'est la **réserve** du joueur.
- La connaissance est permanente : une brique à zéro exemplaire reste dans le codex, marquée **épuisée**.
- Au début, le joueur reçoit une **réserve de départ** (démonstration : 4 briques × 2 exemplaires). Elle permet les premières découvertes sans ouvrir de pli.
- Ensuite, **seuls les plis donnent des exemplaires**. Les jalons ne donnent plus de brique directement : ils offrent un pli de jalon, dont le contenu est déterministe et déclaré dans le graphe d'obtention.
- **Plafond** : 5 exemplaires par brique. Un exemplaire reçu au-delà se change en gouttes d'encre, selon la rareté (barème de l'ADR 0011).

### Consommation

| Situation | Effet sur la réserve |
|---|---|
| Poser une brique sur la table | L'exemplaire est **réservé** : le compteur baisse, il revient si on le retire ou si on vide la table. |
| Nouvelle découverte | **Un exemplaire de chaque brique utilisée est consommé.** |
| Recette déjà découverte | Rien n'est consommé. |
| Presque (mauvais ordre) ou échec | Rien n'est consommé. |

Règle d'expérience : **se tromper ne coûte rien, réussir consomme**. Le joueur ne peut pas poser plus d'exemplaires qu'il n'en possède. Quand il ne lui reste qu'un exemplaire d'une brique utile à plusieurs mots, il doit choisir quel mot écrire : c'est une décision de jeu voulue.

### Plis

- Chaque pli donne un exemplaire d'une brique :
  - brique nouvelle : 1 exemplaire ;
  - brique connue : +1 exemplaire (« De retour ! » si elle était épuisée) ;
  - réserve pleine : de l'encre.
- La garantie de nouveauté au 6ᵉ pli est conservée (ADR 0011).
- **Filet d'utilité** : si la réserve ne permet plus aucune découverte, le 5ᵉ pli consécutif ouvert dans cet état contient forcément une brique qui en rend au moins une possible. Le compteur est visible. Si aucune brique seule ne suffit, le pli donne une brique manquante d'une recette encore à découvrir.

### Atteignabilité

La fermeture monotone de l'ADR 0004 ne suffit plus, puisque des quantités sont consommées. Le validateur ajoute donc une simulation de réserve :

- un joueur qui ouvre des plis finit toujours par pouvoir découvrir chaque mot publié ;
- aucune recette du chemin critique n'exige plus d'exemplaires que le plafond ;
- la réserve de départ permet au moins trois découvertes distinctes ;
- le filet d'utilité trouve toujours une brique éligible.

### Autorité serveur

La réservation est locale et purement visuelle. La consommation, en revanche, fait partie de la transaction de découverte : vérification de la recette, décrément des exemplaires et ajout au codex réussissent ou échouent ensemble, de façon idempotente. Une fusion hors ligne est mise en file d'attente et rejouée à la reconnexion. Elle ne consomme qu'une fois, au moment où le serveur l'accepte.

### Rythme visé

Simulation sur le catalogue de démonstration (9 mots, 9 briques, réserve de départ 4 × 2, plafond 5, un pli toutes les 12 heures, joueur qui découvre dès que c'est possible) :

| Règle | Plis pour tout découvrir (médiane) | 90ᵉ centile | Pire cas observé |
|---|---|---|---|
| Rationnement sans filet | 33 | 59 | 175 |
| Rationnement + filet au 5ᵉ pli | 22 | 26 | 30 |
| Rationnement + filet au 3ᵉ pli | 16 | 18 | 20 |
| Rationnement + 2 briques par pli | 17 | 31 | — |

Retenu : **filet au 5ᵉ pli, une brique par pli**. Avec 22 plis en médiane, soit environ onze jours, le rythme reste proche de celui de l'ADR 0011 (24 plis), mais les séries de malchance sont bornées. La taille du pli, le plafond, la réserve de départ et le seuil du filet sont des paramètres d'équilibrage ([ADR 0009](0009-contenu-et-equilibrage.md)).

## Options envisagées

### Briques illimitées (situation précédente)

Écartée : les doublons perdent leur sens et le codex se remplit trop vite.

### Consommation à chaque tentative

Écartée : l'expérimentation deviendrait punitive, et une erreur pourrait vider la réserve en quelques gestes.

### Rationnement sans filet

Écarté : la simulation montre des séries de plus de 150 plis sans progrès possible pour quelques joueurs.

### Plusieurs briques par pli

Non retenue pour l'instant : elle accélère le rythme, mais demande un rituel de révélation multiple. Elle reste une option d'équilibrage.

## Conséquences

### Positives

- Chaque exemplaire a de la valeur, et les doublons redeviennent désirables.
- Les plis restent utiles même quand toutes les briques sont connues.
- Le choix du mot à écrire avec un exemplaire rare crée de vraies décisions.
- Le rythme est réglable sans toucher aux faits linguistiques.

### Négatives

- Un joueur peut se retrouver sans découverte possible pendant quelques plis. Le filet borne cette attente, mais elle existe.
- Une quantité de plus à synchroniser, à valider et à expliquer.
- Le principe « essayer ne coûte rien » devient « se tromper ne coûte rien ». L'interface doit rendre le coût d'une découverte lisible (compteur, « −1 », exemplaires utilisés sur la fiche).
- Le validateur d'atteignabilité devient une simulation, plus coûteuse qu'une fermeture.

## Critères de réévaluation

Revoir le plafond, la réserve de départ, le seuil du filet ou la taille du pli si les tests montrent plus de deux jours sans découverte possible pour un joueur actif, ou si le taux d'abandon augmente après l'épuisement de la réserve de départ.
