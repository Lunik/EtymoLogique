# ADR 0025 — Médias du catalogue en statique, publication programmée des fascicules

- **Statut** : Accepté
- **Portée** : application du MVP (catalogue, médias, publication), hors dossier de conception
- **Remplace partiellement** : [ADR 0024](0024-architecture-logicielle-et-hebergement.md), pour la publication par un manifeste unique changé à la main
- **Complète** : [ADR 0005](0005-pipeline-de-contenu.md) (artefact publié), [ADR 0016](0016-plis-et-jaquettes-par-fascicule.md) (jaquettes), [ADR 0023](0023-textures-des-cartes.md) (silhouettes), [ADR 0024](0024-architecture-logicielle-et-hebergement.md) (catalogue public et serveur)

## Contexte

L’[ADR 0024](0024-architecture-logicielle-et-hebergement.md) garde côté serveur tout ce qui dévoilerait le contenu avant que le joueur le débloque. Il ne dit rien des **médias** : les jaquettes des plis ([ADR 0016](0016-plis-et-jaquettes-par-fascicule.md)) et les silhouettes des cartes ([ADR 0023](0023-textures-des-cartes.md)). Les faire passer par l’API coûterait des appels, des démarrages à froid et de la bande passante serverless, pour des fichiers qui ne changent jamais une fois publiés.

Or une silhouette trahit le sens d’une carte : une chouette ou une double hélice suffit à deviner un mot. Ce qui doit rester secret, c’est le **lien** entre une carte et son image, pas le fichier lui-même.

Par ailleurs, l’[ADR 0024](0024-architecture-logicielle-et-hebergement.md) publie un fascicule en changeant un manifeste à la main, le jour même. Avec un fascicule par mois ([ADR 0022](0022-fascicules-de-20-a-30-mots.md)), il faut pouvoir préparer un ou plusieurs fascicules à l’avance et les voir paraître seuls, à la date prévue.

## Décision

### Les médias sont servis en statique, sous un nom opaque

- Les jaquettes et les silhouettes sont des fichiers statiques, déposés dans l’Object Storage public et servis par le CDN, en cache immuable. L’API ne sert jamais leurs octets.
- Chaque fichier porte un **nom tiré de l’empreinte de son contenu** (SHA-256 des octets, tronquée à 128 bits au moins), par exemple `a3f9…c2.svg`. Jamais le mot, jamais l’identifiant d’une carte, ni une empreinte de l’un ou de l’autre, que la force brute retrouverait sur un vocabulaire aussi petit.
- Le bucket public **refuse le listing** : on lit un fichier par son nom, on n’énumère pas le dossier.
- Aucune liste de silhouettes ne figure dans le code de la PWA ni dans le catalogue public. Le service worker met une silhouette en cache la première fois qu’elle s’affiche, sans jamais précacher un lot.

### La correspondance vit dans l’artefact serveur, le lien dans la projection

- La correspondance entre chaque carte et son fichier est compilée par le pipeline ([ADR 0005](0005-pipeline-de-contenu.md)) dans l’**artefact serveur**, stocké dans le bucket privé. Elle n’entre ni dans PostgreSQL ni dans une autre base : le catalogue n’est pas une base de données ([ADR 0024](0024-architecture-logicielle-et-hebergement.md)).
- L’API, qui a l’artefact en mémoire, ajoute l’URL de la silhouette à la **projection** du joueur, seulement pour les cartes qu’il a découvertes. Une carte inconnue n’a ni texture ni lien ([ADR 0023](0023-textures-des-cartes.md)). Une légendaire n’a de lien qu’une fois trouvée ([ADR 0015](0015-codex-fascicules-et-legendaires.md)).
- Les jaquettes des fascicules parus restent dans le **catalogue public**, comme le prévoit l’[ADR 0024](0024-architecture-logicielle-et-hebergement.md) : une jaquette ne dit que le fascicule ([ADR 0016](0016-plis-et-jaquettes-par-fascicule.md)).

### Un fascicule se prépare à l’avance et paraît seul, à sa date

- Un fascicule prêt est **livré à l’avance** : artefact public, artefact serveur, médias et migrations de progression. Plusieurs fascicules peuvent attendre en même temps.
- Un **manifeste serveur**, privé, liste les versions du catalogue et leur date d’effet, en UTC (par exemple n° 12 le 1ᵉʳ novembre à 00 h 00, n° 13 le 1ᵉʳ décembre). L’API en déduit la version active avec **sa propre horloge**, qui seule fait foi, comme pour l’énergie et les sabliers ([ADR 0024](0024-architecture-logicielle-et-hebergement.md)). La bascule ne dépend donc pas de la relecture du manifeste toutes les 60 s.
- Le **manifeste public**, que lit la PWA, ne désigne que la version **déjà active**. Il ne mentionne jamais une version à venir, ni son nom, ni sa date, ni l’adresse de son artefact public.
- À chaque date d’effet, une tâche planifiée (Serverless Job) remplace le manifeste public et applique les migrations de progression de la nouvelle version. Ces migrations sont livrées et testées avec le fascicule, jamais écrites le jour même.
- Le pipeline refuse une livraison dont la date d’effet précède celle de la version active, ou dont les migrations n’ont pas été testées sur une copie de la progression.
- Un client resté sur l’ancienne version reçoit un `409` et se resynchronise ([ADR 0024](0024-architecture-logicielle-et-hebergement.md)).
- Reporter ou annuler un fascicule en attente consiste à changer sa date ou à le retirer du manifeste serveur. Revenir en arrière après la parution reste un changement de manifeste.

### Ce qu’un dump du stockage public révélerait

Au pire, des jaquettes et des silhouettes déjà livrées, sans nom de mot, sans ordre ni lien avec leur fascicule, et seulement si leur nom a été deviné ou divulgué. Aucune recette, aucune fiche, aucune brique ni aucune légendaire ne s’y trouve. Ce risque est accepté : un nom opaque n’est pas un contrôle d’accès, mais il protège une date de révélation, pas un secret ([ADR 0024](0024-architecture-logicielle-et-hebergement.md)).

## Options envisagées

### Médias servis par l’API

Contrôle d’accès exact, mais chaque image coûterait un appel, un démarrage à froid possible et de la bande passante serverless, sans cache CDN partagé. Écarté.

### URL signées à durée limitée

Plus étanches qu’un nom opaque, mais chaque projection devrait renouveler ses liens, et le cache immuable du CDN et du service worker serait perdu. Disproportionné pour protéger une date de révélation. Écarté.

### Noms lisibles ou dérivés de l’identifiant

Pratiques à déboguer, mais le vocabulaire est petit : `biologie.svg` ou une empreinte de l’identifiant se devinent en quelques essais. Écarté.

### Correspondance des médias en base de données

Elle placerait du contenu dans la base de progression, que l’[ADR 0024](0024-architecture-logicielle-et-hebergement.md) réserve aux joueurs. Écarté : la correspondance suit l’artefact serveur et ses versions.

### Manifeste public qui liste les versions à venir

Il permettrait à la PWA de précharger le fascicule suivant, mais il révélerait son nom, sa date et l’adresse de son artefact public, jaquette comprise. Écarté.

### Publication manuelle le jour de la parution

C’est la règle de l’[ADR 0024](0024-architecture-logicielle-et-hebergement.md). Elle exige une intervention humaine à heure fixe chaque mois et interdit de préparer plusieurs fascicules. Remplacée par la publication programmée.

## Conséquences

### Positives

- Les images ne coûtent aucun appel à l’API : elles profitent du CDN et du cache immuable.
- Aucune carte inconnue ni aucune légendaire ne se devine depuis le code ou le catalogue public.
- Un fascicule se prépare des jours ou des semaines à l’avance, et paraît à l’heure dite sans intervention.
- Reporter, annuler ou revenir en arrière reste un simple changement de manifeste.

### Négatives

- Un lien de silhouette partagé est visible par n’importe qui : le nom opaque n’est pas un contrôle d’accès.
- Les médias d’un fascicule en attente sont déjà dans le stockage public, lisibles par qui en connaîtrait le nom.
- Hors connexion, une silhouette jamais affichée n’est pas en cache : la carte s’affiche alors sans texture.
- La tâche planifiée devient critique à chaque parution : un échec de migration doit bloquer la bascule du manifeste public et alerter.

## Critères de réévaluation

- Des silhouettes ou des jaquettes d’un fascicule à venir circulent avant sa parution : ne déposer les médias qu’à la date d’effet, par la tâche planifiée.
- Une tâche planifiée de parution échoue ou dépasse 5 minutes : revoir l’ordre de la bascule et des migrations.
- Les joueurs hors connexion voient souvent des cartes sans texture : précacher les silhouettes des cartes découvertes à chaque synchronisation.
