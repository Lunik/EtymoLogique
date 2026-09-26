# ADR 0024 — Architecture serverless chez Scaleway, backend Rust, état relationnel

- **Statut** : Accepté
- **Portée** : application du MVP (PWA, API, bases, hébergement), hors dossier de conception
- **Complète** : [ADR 0001](0001-pwa-responsive.md) (hors connexion), [ADR 0005](0005-pipeline-de-contenu.md) (artefact publié), [ADR 0007](0007-etat-et-economie-autoritaires.md) (autorité serveur), [ADR 0010](0010-observabilite-et-vie-privee.md) (journaux et télémétrie)

## Contexte

Le dossier de conception fixe déjà les règles techniques du jeu, sans choisir de technologie : une PWA ([ADR 0001](0001-pwa-responsive.md)), un catalogue compilé en artefact versionné ([ADR 0005](0005-pipeline-de-contenu.md)), un serveur qui fait autorité sur l’économie ([ADR 0007](0007-etat-et-economie-autoritaires.md)) et une télémétrie minimale ([ADR 0010](0010-observabilite-et-vie-privee.md)).

Les contraintes posées pour l’application :

- front en React, servi par un service statique ;
- coût serveur minimal, serverless autant que possible ;
- forte préférence pour un cloud français (Scaleway, OVHcloud, Clever Cloud) ;
- deux données de nature opposée : le **catalogue** (mots, briques, recettes) change une fois par mois, au rythme des fascicules ([ADR 0022](0022-fascicules-de-20-a-30-mots.md)) ; la **progression** des joueurs (réserve, découvertes, énergie, encre, sabliers, réglages) change à chaque action.

Le trafic d’un MVP est faible et irrégulier : payer des serveurs allumés en permanence n’a pas de sens.

## Décision

### Hébergement : Scaleway, région Paris, serverless

Tout est hébergé chez **Scaleway**, en région `fr-par`, sur des services facturés à l’usage :

| Brique | Service Scaleway | Rôle |
|---|---|---|
| PWA | Object Storage + Edge Services | Fichiers statiques, TLS, domaine, cache CDN |
| Catalogue public | Object Storage, derrière le même CDN | Artefact lisible par le client |
| Catalogue serveur | Object Storage, bucket privé | Artefact complet, lu par l’API seule |
| API de jeu | Serverless Containers | Toutes les commandes du jeu |
| Progression | Serverless SQL Database (PostgreSQL) | État des joueurs |
| Tâches planifiées | Serverless Jobs | Migrations de progression, purges, agrégats de télémétrie |
| Secrets | Secret Manager | Accès à la base, clés de signature |
| Supervision | Cockpit | Métriques et journaux structurés |

- L’API démarre à **0 instance** au repos. Elle passe à 1 instance minimum si le démarrage à froid dépasse 1 s au 95ᵉ centile sur l’ouverture d’un pli.
- L’infrastructure est décrite en code (OpenTofu ou Terraform, fournisseur Scaleway) et déployée par GitHub Actions. Chaque branche peut avoir sa préversion, comme le dossier aujourd’hui.
- Le cœur reste portable : conteneur OCI standard, PostgreSQL, stockage compatible S3.

### Front : PWA React statique

- React et TypeScript, compilés en fichiers statiques. Un service worker (Workbox) met en cache la coque et le catalogue public autorisé.
- Les fichiers au nom haché sont en cache immuable. `index.html`, le service worker et le manifeste du catalogue ne sont pas mis en cache.
- IndexedDB conserve la projection de la progression confirmée et les commandes en attente ([ADR 0007](0007-etat-et-economie-autoritaires.md)).
- Le front et l’API partagent le même domaine parent. CORS est limité à l’origine de la PWA, sans cookie tiers ni script tiers.

### Catalogue : un artefact statique, sans aucune recette côté client

Le catalogue n’est **pas** une base de données. Le pipeline de l’[ADR 0005](0005-pipeline-de-contenu.md) produit, pour chaque version, deux artefacts immuables :

- **public** : seulement ce que tout joueur peut voir dès le départ, sans rien apprendre du contenu : langues, systèmes d’écriture, fascicules parus et leurs jaquettes ;
- **serveur** : tout le reste, dont les briques, les recettes, les mots et leurs fiches, les poids et raretés des plis, les garanties, les plis de jalon et les légendaires.

Le client ne reçoit **aucune recette**, ni en clair, ni sous forme d’empreinte. Tout ce qui dépend de la progression est une **projection calculée par le serveur pour chaque joueur**, puis gardée en cache :

- les briques obtenues, avec leurs gloses, et la réserve ;
- les fiches des mots découverts, composition comprise ;
- les cartes inconnues visibles en silhouette, avec leur piste de sens, et les compteurs de chaque fascicule, sans aucune légendaire inconnue ni mot qui en dépend ([ADR 0015](0015-codex-fascicules-et-legendaires.md)) ;
- les chances du pli du fascicule choisi, les légendaires inconnues regroupées sur une seule ligne.

Ainsi, aucun mot à venir ni aucune légendaire ne se lit dans le code ou le stockage de la PWA.

- Un **manifeste** désigne la version active. Publier un fascicule consiste à déposer les deux artefacts puis à changer le manifeste. Revenir en arrière consiste à remettre l’ancien manifeste.
- L’API charge l’artefact serveur en mémoire au démarrage et relit le manifeste au plus toutes les 60 s. Le contenu ne passe par aucune requête SQL.
- Le format d’édition, dont le schéma proposé par l’[ADR 0013](0013-schema-des-briques.md), reste indépendant : l’artefact n’en est que la compilation.
- Les sources éditoriales non publiées et l’artefact serveur vivent dans un **dépôt privé**, déployé par sa propre CI. Le code reste public ([ADR 0017](0017-licences.md)). Les textes publiés restent sous CC BY-SA 4.0 : c’est leur date de révélation qui est retenue, pas leur licence.

### Backend : une API en Rust

- **Un seul service**, sans état, écrit en **Rust**, livré dans une image de conteneur minimale. Pile de référence : `tokio`, `axum` et `sqlx` (requêtes vérifiées à la compilation).
- Des commandes, pas un CRUD : fusion, ouverture de pli, sablier, indice, synchronisation, télémétrie. Chaque commande porte un identifiant d’idempotence, la version du catalogue et la version d’état connue du client. La réponse renvoie le nouvel état confirmé. Un conflit renvoie `409` et déclenche une resynchronisation explicite.
- **Toute fusion est résolue par le serveur**, parce que le client n’a pas les recettes : succès, recette déjà connue, « presque », piste pas encore autorisée ou échec ([game-design](../game-design.md)). Hors connexion, la table se prépare, et la tentative attend le réseau sans afficher de résultat ([ADR 0001](0001-pwa-responsive.md)).
- Les tirages de plis utilisent un générateur aléatoire cryptographique côté serveur, sauf les plis de jalon, dont le contenu est déterministe ([ADR 0012](0012-briques-rationnees.md)). L’horloge du serveur seule fait foi pour l’énergie et les sabliers.
- Les types des commandes et de l’artefact sont décrits par un schéma unique, dont on génère les types TypeScript du front.

### Progression : tables relationnelles PostgreSQL

L’état des joueurs est **normalisé en tables relationnelles**, pas stocké en document :

- `joueur` : profil invité, empreinte de son secret, version d’état, version de catalogue ;
- `exemplaire` : une ligne par joueur et par brique, avec contrainte `CHECK` entre 0 et 5 exemplaires ;
- `decouverte` : joueur, mot, date, numéro de découverte ;
- `energie`, `encre`, `sablier` : charges (2 au plus), prochaine échéance, soldes et plafond de 36 sabliers détenus, contrôlés par contraintes ([ADR 0020](0020-deux-plis-en-attente-et-sabliers.md)). Le plafond de 12 sabliers par 24 h glissantes est vérifié dans la transaction, à partir des mouvements ;
- `compteur_pli` : par joueur et par fascicule, plis depuis la dernière nouveauté (garantie au 6ᵉ pli) et plis consécutifs sans découverte possible (filet au 5ᵉ pli) ;
- `reglage` : préférences non sensibles ;
- `commande` : identifiant d’idempotence unique et réponse mémorisée ;
- `mouvement` : journal en ajout seul des gains et consommations, pour l’audit et le support.

Règles :

- les identifiants du catalogue sont les identifiants opaques et stables de l’[ADR 0005](0005-pipeline-de-contenu.md) ; la base de progression ne copie aucun texte du catalogue ;
- chaque commande est **une transaction** : énergie consommée, tirage, exemplaires, encre et mouvement réussissent ou échouent ensemble ;
- les migrations de schéma sont versionnées dans le dépôt et appliquées par le déploiement ; les migrations de progression, à la publication d’un fascicule, tournent dans un Serverless Job.

### Identité et sécurité

- **Profil invité** ([ADR 0007](0007-etat-et-economie-autoritaires.md)) : le client génère un identifiant d’installation et un secret aléatoire de 256 bits. Le serveur ne garde que l’empreinte du secret et délivre un jeton de session signé, valable 15 minutes, renouvelé avec le secret. Aucun nom ni adresse électronique.
- Le compte, la récupération et le multi-appareil restent soumis à l’ADR séparé prévu par l’[ADR 0007](0007-etat-et-economie-autoritaires.md).
- En-têtes : CSP stricte sans script tiers, HSTS, `frame-ancestors 'none'`.
- Chaque commande est validée par schéma, taille bornée, propriétés inconnues refusées. Débit limité par profil et par adresse réseau, sans conserver celle-ci.
- Moindre privilège : l’API lit le seul bucket privé du catalogue et n’accède qu’à sa base. Les secrets vivent dans Secret Manager, jamais dans le dépôt. La CI audite les dépendances (`cargo audit`, `npm audit`).
- Le code est public ([ADR 0017](0017-licences.md)) : aucune sécurité ne repose sur le secret du code. Seuls les clés, les réglages et l’artefact serveur restent privés.
- La télémétrie passe par la même API, dans des tables séparées de la progression ([ADR 0010](0010-observabilite-et-vie-privee.md)). Son identifiant pseudonyme est distinct de celui du joueur et change tous les 30 jours.
- Durées de conservation : commandes traitées 30 jours, événements de télémétrie bruts 90 jours puis agrégats seuls, journaux opérationnels 30 jours. Les purges tournent chaque jour dans un Serverless Job.

## Options envisagées

### Clever Cloud (application statique, application Rust, PostgreSQL, Cellar)

Déploiement très simple et sans démarrage à froid, mais pas d’arrêt complet : une instance et une base tournent en permanence, pour un coût fixe dès le premier jour. Écarté au profit d’un coût quasi nul au repos. Reste le repli si le serverless déçoit.

### OVHcloud (Object Storage, Web PaaS ou Kubernetes, bases managées)

Solide et économique en charge continue, mais sans conteneurs ni base qui s’arrêtent à zéro. Écarté pour le MVP.

### Catalogue en base de données

Une base pour un contenu qui change une fois par mois ajouterait coût, requêtes et risque de modification directe, que l’[ADR 0005](0005-pipeline-de-contenu.md) écarte déjà. Écarté.

### Recettes chez le client, en clair ou en empreintes salées

Elles permettraient de résoudre une fusion hors connexion. En clair, elles révèlent tout le codex et les légendaires. En empreintes, elles restent attaquables par force brute, vu le petit nombre de briques. Écarté : la fusion attend le serveur.

### Backend en TypeScript

Il permettrait de partager le code des règles avec le front. Écarté au profit de Rust : démarrage à froid et mémoire minimaux, donc un coût serverless plus bas, et un typage strict des règles de l’économie. Le partage passe par un schéma commun et des types générés.

### Un document JSON par joueur

Plus simple à faire évoluer, mais les invariants (plafond de 5, charges, soldes) ne seraient garantis que par le code. Écarté : les contraintes relationnelles protègent l’économie même en cas de bogue.

### Fonctions serverless séparées par commande

Plus de pièces à déployer, de démarrages à froid et de code dupliqué pour un domaine petit et cohérent. Écarté au profit d’un seul conteneur.

## Conséquences

### Positives

- Coût au repos de quelques euros par mois, puis proportionnel au jeu réel.
- Montée en charge automatique de l’API sans état. Le catalogue en mémoire n’ajoute aucune charge à la base.
- Données hébergées en France, chez un fournisseur européen.
- Mots à venir, briques non obtenues et légendaires impossibles à lire dans le client.
- Invariants de l’économie protégés par la base et par les transactions.
- Retour arrière d’un fascicule en changeant une seule valeur.

### Négatives

- Démarrage à froid possible au premier appel après une période creuse.
- Aucune fusion n’est résolue hors connexion : le joueur prépare, puis attend le réseau.
- Le codex et la réserve dépendent d’une projection serveur : un premier lancement exige le réseau.
- Deux dépôts à tenir, le code public et le contenu privé.
- Rust demande plus de temps de développement, et le partage de code avec le front se limite aux types générés.
- Chaque nouvelle règle d’économie demande souvent une migration de schéma.
- Serverless SQL Database a des quotas et une latence de reprise à surveiller.
- Dépendance à un seul fournisseur, atténuée par des briques standards.

## Critères de réévaluation

- Le coût de calcul de Serverless SQL dépasse celui d’une base PostgreSQL managée de petite taille pendant 2 mois : passer à la base managée, même moteur.
- Le démarrage à froid reste au-dessus de 1 s au 95ᵉ centile avec 1 instance minimum : réévaluer l’hébergement de l’API (Clever Cloud en repli).
- Les tests montrent que l’attente du réseau pour chaque fusion gêne le jeu hors connexion : rouvrir la question des recettes chez le client, par un nouvel ADR.
- Arrivée des comptes, du multi-appareil ou des paiements ([ADR 0018](0018-sabliers-et-boutique.md)) : revue de sécurité et de l’identité.
