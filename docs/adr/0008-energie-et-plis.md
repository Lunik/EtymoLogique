# ADR 0008 — Énergie et plis gratuits, paiements hors MVP

- **Statut** : Accepté, partiellement remplacé par l’[ADR 0011](0011-plis-raretes-et-doublons.md). Le contenu des plis, les doublons et les raretés relèvent désormais de l’ADR 0011. L’énergie, la recharge et l’absence de paiement restent régies par le présent ADR. Depuis l’[ADR 0012](0012-briques-rationnees.md), les plis sont aussi la seule source d’exemplaires de briques ; l’énergie ne limite toujours pas les fusions, et une tentative ratée ne consomme rien.

## Contexte

Les plis peuvent relancer l'exploration en apportant une nouvelle brique, mais un hasard non maîtrisé peut bloquer la progression. L'énergie fournit un rythme de retour, avec un risque de frustration ou de conception manipulatrice. La monétisation n'est pas nécessaire pour valider le cœur du jeu.

## Décision

Le MVP inclut des plis gratuits limités par une énergie dédiée. Cette énergie n'est jamais requise pour fusionner des briques déjà obtenues.

Principes :

- la capacité, la durée de recharge et le contenu des plis sont des paramètres versionnés d'équilibrage ;
- douze heures constitue la première hypothèse de recharge, sans être codée en dur ;
- le serveur calcule l'énergie à partir d'instants fiables ;
- l'interface affiche la disponibilité et l'heure estimée sans fausse urgence ;
- aucun paiement, publicité récompensée, monnaie premium ou achat de recharge ;
- le chemin critique dispose toujours d'une voie déterministe.

Lors de l'ouverture, le serveur construit un pool à partir :

- des règles d'équilibrage actives ;
- des briques que le joueur ne possède pas ;
- de ses préconditions satisfaites ou du niveau auquel la brique peut être utile ;
- d'au moins une recette ou piste que la récompense peut ouvrir ;
- des exclusions éditoriales et de la protection contre les doublons inutiles.

Le tirage et l'attribution sont atomiques et idempotents. Le résultat enregistre la règle d'équilibrage utilisée afin de permettre un diagnostic sans journaliser de donnée personnelle.

Si aucun objet n'est éligible, le pli fournit une compensation définie, par exemple un indice, ou est remplacé par une récompense déterministe. Il ne renvoie jamais silencieusement un pli vide.

## Options envisagées

### Aucun pli

Non retenu pour le MVP : il empêcherait de tester cette boucle secondaire importante, bien qu'elle puisse être retirée si elle dégrade le jeu.

### Plis purement aléatoires

Écartés : ils peuvent produire doublons, impasses et frustration.

### Monétisation immédiate

Écartée : elle ajoute conformité, attentes économiques et biais de conception avant validation du plaisir.

### Énergie consommée à chaque fusion

Écartée : elle décourage l'expérimentation, qui est le cœur du jeu.

## Conséquences

### Positives

- boucle de retour testable sans pression financière ;
- récompenses adaptées à la progression ;
- expérimentation illimitée sur le contenu possédé ;
- paramètres ajustables sans modifier les faits linguistiques.

### Négatives

- économie serveur à construire et observer ;
- système potentiellement perçu comme artificiel même sans paiement ;
- calcul d'éligibilité plus complexe qu'une table aléatoire ;
- obligation de concevoir une fin de catalogue satisfaisante.

## Critères de réévaluation

Retirer ou modifier l'énergie si les tests ne montrent pas de valeur ludique. Toute monétisation future exige un ADR couvrant éthique, conformité, contrôle parental, transparence des probabilités et politique de remboursement.

