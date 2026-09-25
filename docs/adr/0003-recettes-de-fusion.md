# ADR 0003 — Recettes explicites et transformations expliquées

- **Statut** : Accepté

## Contexte

La concaténation stricte est facile à comprendre, mais elle ne représente ni les variations de forme ni les chemins historiques. À l'inverse, une évaluation libre rendrait les résultats arbitraires et difficiles à expliquer.

## Décision

Une fusion réussit uniquement lorsqu'elle correspond à une recette éditoriale publiée et accessible.

Une recette contient :

- un identifiant stable ;
- une liste **ordonnée** d'emplacements ;
- pour chaque emplacement, les briques ou variantes acceptées ;
- les préconditions de progression ;
- une suite de transformations contrôlées ;
- un résultat linguistique ;
- les objets et pistes débloqués ;
- une définition courte du résultat dans son sens actuel, et son sens littéral lorsqu'il diffère ;
- une explication courte et une explication détaillée ;
- les références aux faits linguistiques qui la justifient.

Les transformations sont des données explicites, pas du code libre. Leur vocabulaire initial peut inclure :

- ajout ou retrait d'une voyelle de liaison ;
- allomorphie ;
- adaptation de graphie ;
- adaptation phonétique décrite ;
- suffixation ou préfixation ;
- emprunt via une forme intermédiaire ;
- composition avec ordre documenté.

Le moteur compare des identifiants et variantes autorisées, jamais des saisies libres. Toutes les entrées reçues par l'API sont validées côté serveur : nombre d'ingrédients, type, ordre, appartenance au catalogue actif et possession des briques.

Une recette ne prétend pas nécessairement que le mot a été historiquement « fabriqué » par l'opération que réalise le joueur. L'explication distingue l'analogie ludique du chemin attesté.

## Résultats de tentative

- `discovery` : recette valide et résultat nouveau ;
- `known` : recette valide déjà découverte ;
- `hintable` : proposition correspondant à un indice éditorial sûr ;
- `locked` : recette réelle mais préconditions non remplies ;
- `invalid` : aucune correspondance.

Le serveur ne renvoie pas l'identifiant ou les ingrédients secrets d'une recette verrouillée.

## Options envisagées

### Concaténation stricte

Écartée comme règle unique : trop peu expressive et pédagogiquement trompeuse dans de nombreux cas.

### Évaluation libre par dictionnaire ou IA

Écartée : résultats non maîtrisés, couverture incohérente et risques d'erreurs.

### Grammaire linguistique universelle

Écartée pour le MVP : complexe, fragile et inutile pour un catalogue éditorial fini.

## Conséquences

### Positives

- logique déterministe, testable et expliquée ;
- difficulté contrôlable ;
- transformations rendues visibles ;
- aucune saisie arbitraire à modérer.

### Négatives

- chaque solution doit être conçue ;
- les variantes acceptables doivent être anticipées ;
- le moteur ne reconnaît pas automatiquement une solution réelle absente du catalogue ;
- frustration possible si une variante plausible n'est pas éditée.

## Critères de réévaluation

Enrichir le vocabulaire de transformations à partir des besoins réels du contenu. N'introduire une évaluation ouverte que si elle peut rester déterministe, sourcée et sûre.

