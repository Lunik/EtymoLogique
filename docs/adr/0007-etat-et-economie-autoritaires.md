# ADR 0007 — État persistant et économie sous autorité serveur

- **Statut** : Accepté

## Contexte

Le jeu doit reprendre une progression, calculer la recharge d'énergie et empêcher qu'un changement d'horloge locale ou une requête falsifiée n'accorde des récompenses. La PWA doit néanmoins rester réactive et tolérer une connexion intermittente.

## Décision

Le serveur est l'autorité sur :

- la version de catalogue active pour une partie ;
- les graines, découvertes et briques possédées ;
- la résolution finale d'une fusion ;
- l'énergie, sa prochaine échéance et l'ouverture des plis ;
- les récompenses, jalons et migrations de progression.

Le client conserve un cache local pour :

- le catalogue autorisé ;
- une projection de la progression confirmée ;
- l'état visuel de la table ;
- les préférences non sensibles ;
- les opérations en attente qui peuvent être rejouées sans ambiguïté.

Toute commande serveur contient un identifiant d'idempotence généré par le client. Le serveur valide le schéma, l'identité technique, la version du catalogue, les préconditions et les droits avant une mutation. Une réponse en conflit provoque une resynchronisation explicite ; le client ne transforme pas un échec en succès local.

Le MVP peut utiliser un profil invité associé à un identifiant aléatoire d'installation et à un secret stocké de manière adaptée à la plateforme. Ce profil ne contient pas de nom, d'adresse électronique ou d'autre donnée personnelle. La récupération multi-appareil et la conversion vers un compte feront l'objet d'une décision séparée avant collecte de données d'identité.

Les écritures côté serveur sont transactionnelles : consommation d'énergie, tirage et attribution de récompense réussissent ou échouent ensemble.

## Options envisagées

### État uniquement local

Écarté : simple et très privé, mais incompatible avec une économie fiable, les migrations contrôlées et une future synchronisation.

### Client autoritaire avec synchronisation occasionnelle

Écarté : l'horloge, l'énergie et les récompenses seraient facilement incohérentes ou falsifiables.

### Compte obligatoire dès le premier lancement

Écarté pour le MVP : friction et collecte de données non nécessaires pour tester le jeu.

## Conséquences

### Positives

- économie cohérente ;
- commandes rejouables sans doubles récompenses ;
- collecte d'identité minimale ;
- client réactif grâce aux projections locales ;
- chemin futur vers la synchronisation.

### Négatives

- backend requis même pour un jeu essentiellement solo ;
- ouverture de pli indisponible sans connexion ;
- perte possible du profil invité si le stockage local disparaît ;
- résolution de conflits et migrations à concevoir.

## Critères de réévaluation

Créer un nouvel ADR avant d'ajouter compte nominatif, authentification fédérée, synchronisation multi-appareil ou récupération de progression.

