# ADR 0010 — Observabilité minimale et respectueuse de la vie privée

- **Statut** : Accepté

## Contexte

Le MVP doit vérifier si les joueurs comprennent la fusion, utilisent les indices et reviennent ouvrir un pli. Une collecte exhaustive ou des journaux contenant les propositions brutes créeraient un risque de vie privée sans améliorer nécessairement les décisions.

## Décision

L'observabilité suit les principes de minimisation, finalité explicite, durée limitée et agrégation.

Les événements produit autorisés couvrent :

- démarrage et fin des étapes du tutoriel ;
- tentative de fusion classée par résultat ;
- découverte d'une recette ;
- demande d'un niveau d'indice ;
- ouverture de pli et catégorie de récompense ;
- reprise après disponibilité d'un pli ;
- erreur technique catégorisée.

Un événement contient uniquement :

- un identifiant d'événement ;
- un identifiant technique pseudonyme à rotation ou portée limitée ;
- un horodatage ;
- la version de l'application, du catalogue et de l'équilibrage ;
- des identifiants internes nécessaires à l'analyse ;
- des propriétés énumérées et validées.

Il ne contient jamais de nom, adresse électronique, adresse réseau complète conservée comme propriété analytique, texte libre, contenu de stockage local, en-têtes d'authentification ou autre donnée personnelle inutile.

Les journaux applicatifs utilisent des codes d'erreur et identifiants de corrélation non personnels. Les charges utiles utilisateur, secrets et jetons sont exclus ou expurgés avant émission. Les erreurs de validation sont visibles par des métriques structurées, pas par la copie de la requête.

Le serveur :

- valide chaque événement selon un schéma et une liste de propriétés autorisées ;
- limite le débit et la taille ;
- rejette les propriétés inconnues au lieu de les stocker ;
- sépare télémétrie produit et journaux opérationnels ;
- applique des durées de conservation documentées ;
- restreint les accès et trace les consultations administratives.

Le produit explique la collecte et offre les contrôles requis avant une diffusion publique. Les métriques agrégées sont privilégiées lorsqu'un suivi individuel n'est pas indispensable.

## Options envisagées

### Aucune télémétrie

Non retenue : elle rendrait les hypothèses du MVP difficiles à évaluer. Les tests qualitatifs restent néanmoins indispensables.

### Enregistrement de toutes les sessions

Écarté : intrusif, volumineux et susceptible de capturer des données imprévues.

### Fournisseur analytique choisi immédiatement

Écarté : le besoin et le contrat de données doivent précéder le choix d'un service tiers.

## Conséquences

### Positives

- indicateurs utiles avec exposition réduite ;
- schémas auditables et testables ;
- moindre risque de fuite dans les journaux ;
- indépendance initiale vis-à-vis d'un fournisseur.

### Négatives

- certaines analyses exploratoires seront impossibles a posteriori ;
- effort de gouvernance, rétention et contrôle d'accès ;
- identifiants limités moins adaptés aux cohortes longues.

## Critères de réévaluation

Tout nouvel événement doit justifier sa finalité et sa durée. Toute session replay, expérimentation personnalisée ou intégration tierce nécessite une revue dédiée de la vie privée et de la sécurité.

