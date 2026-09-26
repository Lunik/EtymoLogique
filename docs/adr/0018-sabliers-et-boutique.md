# ADR 0018 — Sabliers : avancer la recharge des plis

- **Statut** : Proposé, en partie repris par l'[ADR 0020](0020-deux-plis-en-attente-et-sabliers.md), accepté : les sabliers gratuits entrent dans le MVP, coûtent 1 goutte et avancent la recharge d'une énergie à deux charges. Seules la boutique payante et ses garde-fous restent proposés ici.
- **Portée** : après le MVP. Le MVP reste sans paiement : les ADR 0008 et 0011 s'appliquent tant que le présent ADR n'est pas accepté.
- **Remplacerait partiellement**, une fois accepté : [ADR 0008](0008-energie-et-plis.md), pour l'interdiction de tout paiement et de tout achat de recharge ; [ADR 0011](0011-plis-raretes-et-doublons.md), pour l'usage de l'encre, qui pourrait aussi s'échanger contre des sabliers
- **Complète** : [ADR 0007](0007-etat-et-economie-autoritaires.md) (achats et usage sous autorité serveur), [ADR 0009](0009-contenu-et-equilibrage.md) (nouveaux paramètres d'équilibrage), [ADR 0010](0010-observabilite-et-vie-privee.md) (données de paiement)

## Contexte

Le jeu devra financer son contenu éditorial et son serveur. L'ADR 0008 écarte toute monétisation du MVP et demande qu'une future boutique fasse l'objet d'une décision couvrant l'éthique, la conformité, le contrôle parental, la transparence des probabilités et le remboursement. L'ADR 0011 ajoute les règles sur les coffres à butin.

Le levier le plus lisible est le temps d'attente entre deux plis : une charge d'énergie, rechargée en douze heures (hypothèse de l'ADR 0008). Il faut le rendre accélérable sans vendre de tirage, sans casser la rareté des briques (ADR 0012), et sans que le jeu ne se remplisse de fausse urgence.

## Décision

### Le sablier

- Un **sablier** fait avancer la recharge d'énergie d'**une heure**.
- Il ne s'utilise que pendant une recharge. Quand l'énergie est pleine, il est inutilisable : l'énergie ne dépasse jamais sa capacité.
- S'il reste moins d'une heure, le sablier termine la recharge. Avant de confirmer, l'interface indique le temps non utilisé (« 42 min seront perdues »).
- Le sablier achète du **temps, jamais un tirage**. Il ne change ni les chances, ni la garantie de nouveauté, ni le filet d'utilité, ni le contenu du pli. Il n'a aucun effet sur les fusions, que l'énergie ne limite jamais.

### Plafonds

| Paramètre | Valeur initiale |
|---|---|
| Durée avancée par sablier | 1 h |
| Sabliers utilisables par 24 h glissantes | 12, soit au plus un pli de plus par jour |
| Sabliers détenus au plus | 36 |

- Le plafond quotidien compte **tous les sabliers**, gratuits comme achetés.
- Un sablier gagné au-delà du plafond de détention reste en attente jusqu'à ce qu'une place se libère ; aucun lot ne peut être acheté s'il ferait dépasser ce plafond.
- Ces valeurs sont des paramètres versionnés d'équilibrage ([ADR 0009](0009-contenu-et-equilibrage.md)).
- Avec un pli toutes les 12 h et le plafond atteint chaque jour, le rythme de découverte peut au plus doubler : le catalogue de démonstration se complète alors en environ six jours au lieu d'onze (22 plis en médiane, ADR 0012).

### Obtenir des sabliers sans payer

- Certains jalons donnent un sablier en plus de leur pli.
- Le défi quotidien peut en donner un.
- L'encre s'échange contre un sablier, au même taux qu'un indice dans la démonstration (10 gouttes). L'encre reste non achetable et non convertible en argent.

La boutique n'est donc qu'un raccourci : tout ce qu'elle vend s'obtient aussi en jouant, et le jeu reste complet sans rien acheter.

### Boutique

- On achète des **lots de sabliers en euros**, sans monnaie intermédiaire.
- Chaque lot affiche son prix TTC et son prix par sablier. Le prix par sablier baisse peu d'un lot à l'autre, sans « bonus » mis en avant.
- Aucune offre limitée dans le temps, aucun compte à rebours, aucune notification ni relance commerciale, aucune proposition d'achat affichée au moment d'une révélation ou d'un échec.
- La boutique est une entrée discrète de l'écran des plis. Le bouton « Utiliser un sablier » reste secondaire face au temps de recharge, toujours affiché avec l'heure du prochain pli.
- Les prix sont fixés dans un ADR ou un paramètre ultérieur.

### Conformité et mineurs

- Un sablier est déterministe, mais il accélère l'accès à un tirage aléatoire. Avant l'ouverture de la boutique, une revue juridique est faite pour chaque territoire (en particulier les règles belges et néerlandaises sur les coffres à butin). La boutique est désactivable par territoire, sans effet sur le reste du jeu.
- Les chances, la garantie et le filet restent affichés en permanence (ADR 0011).
- Sur les magasins d'applications, le contrôle parental et la facturation de la plateforme s'appliquent. Sur le web, un plafond de dépense mensuel par défaut est proposé, modifiable par le titulaire du moyen de paiement.
- Aucun ciblage, aucune offre personnalisée selon le comportement de jeu.

### Remboursement

- Un lot dont aucun sablier n'a été utilisé est remboursable pendant 14 jours.
- Avant le premier usage d'un sablier acheté, le joueur confirme qu'il renonce au droit de rétractation pour ce sablier.
- Un sablier remboursé est retiré de la réserve ; si le solde ne le permet pas, le remboursement porte sur les sabliers restants.

### Autorité serveur et données

- Le serveur valide chaque reçu d'achat avant de créditer les sabliers ; le crédit est idempotent.
- Utiliser un sablier est une commande idempotente et transactionnelle : décrément du solde, avance de la recharge et mise à jour du plafond quotidien réussissent ou échouent ensemble ([ADR 0007](0007-etat-et-economie-autoritaires.md)).
- Les données de paiement restent chez le prestataire ; le jeu ne conserve que l'identifiant de transaction et le lot ([ADR 0010](0010-observabilite-et-vie-privee.md)).
- Un joueur qui a payé ne doit pas perdre ses sabliers avec son profil invité : la boutique ne s'ouvre qu'après la décision sur la récupération de progression prévue par l'ADR 0007.

## Options envisagées

### Monnaie premium

Écartée : elle masque le prix réel, pousse à acheter des soldes inutilisables et reste interdite par l'ADR 0008.

### Sabliers sans plafond quotidien

Écartés : un joueur pourrait vider un fascicule en une soirée, ce qui casse la rareté des briques, et la boutique deviendrait un achat de tirages en série.

### Vendre des plis ou des briques

Écarté : c'est un coffre à butin payant, et vendre une brique contredit « aucune brique impossible à obtenir sans payer ». Le contenu reste de plus sous CC BY-SA ([ADR 0017](0017-licences.md)).

### Publicité récompensée

Écartée : elle interrompt le rythme de réflexion et exige un suivi publicitaire incompatible avec l'ADR 0010.

### Abonnement

Non retenu pour l'instant : il crée une attente de contenu régulier que le rythme des fascicules ne garantit pas encore.

### Cosmétiques et achat de soutien

Reportés : jaquettes alternatives, thèmes ou achat unique de soutien feront l'objet d'une décision séparée.

## Conséquences

### Positives

- Une source de revenus simple à comprendre : du temps, à prix affiché.
- Les chances, la garantie et le filet ne dépendent jamais d'un paiement.
- Le joueur qui ne paie pas a accès aux mêmes briques, au même contenu et même aux sabliers.
- Le plafond quotidien borne à la fois la dépense et l'accélération du rythme.

### Négatives

- Même plafonné, le sablier rapproche le jeu des mécaniques d'attente payante : la perception « payer pour attendre moins » est un risque pour l'image.
- Il faut un compte ou une récupération de progression, une revue juridique par territoire et une intégration de paiement.
- Deux nouveaux compteurs à expliquer (solde, plafond quotidien).
- L'équilibrage doit être simulé avec et sans sabliers.

## Critères de réévaluation

- Plus de la moitié du revenu vient de moins de 2 % des joueurs, ou des joueurs atteignent le plafond de dépense chaque mois.
- Le taux d'abandon après complétion d'un fascicule augmente chez les joueurs qui utilisent des sabliers.
- Les joueurs qui ne paient pas jugent l'attente plus pénible après l'ouverture de la boutique.
- Une évolution légale sur les coffres à butin ou les achats intégrés dans un territoire ciblé.
