# ADR 0002 — Graphe linguistique éditorial et versionné

- **Statut** : Accepté

## Contexte

Une simple liste de chaînes ne peut pas représenter les changements de langue, les graphies, les sens ni les relations historiques. Interroger une source externe à chaque tentative rendrait la jouabilité et la qualité imprévisibles. Une génération automatique risquerait de valider des rapprochements faux.

## Décision

Le contenu linguistique jouable sera un graphe éditorial publié par versions immuables. Une nouvelle publication crée une nouvelle version ; elle ne modifie pas silencieusement le sens d'une partie déjà jouée.

Le modèle distingue au minimum :

| Entité | Responsabilité |
|---|---|
| `Language` | Langue, période et métadonnées d'affichage. |
| `WritingSystem` | Système d'écriture d'une forme. |
| `Lexeme` | Unité lexicale abstraite rattachée à une langue. |
| `Sense` | Acception contextualisée d'un lexème ou morphème. |
| `Form` | Graphie attestée, normalisée pour l'identification mais conservée telle qu'affichée. |
| `Transliteration` | Représentation d'une forme selon une convention nommée. |
| `Morpheme` | Unité liée ou libre utilisable dans une composition documentée. |
| `EtymologicalRelation` | Relation typée entre deux objets linguistiques. |
| `SourceReference` | Provenance bibliographique ou éditoriale. |
| `EditorialAssessment` | Niveau de confiance, note et état de relecture. |

Les relations utilisent un vocabulaire contrôlé, notamment : héritage, emprunt, dérivation, composition, adaptation et apparentement. « Ressemble à » n'est pas une relation étymologique jouable.

Les identifiants sont stables et indépendants de la graphie. Corriger un accent ou une translittération ne doit pas créer artificiellement une nouvelle brique.

Chaque fait publié possède :

- une ou plusieurs sources ;
- un niveau de confiance : établi, probable ou discuté ;
- un état de relecture ;
- la version dans laquelle il apparaît ;
- si nécessaire, une note expliquant la simplification ludique.

## Options envisagées

### Liste de mots et préfixes

Écartée : simple au début, mais incapable de distinguer formes, sens et relations.

### Dictionnaires externes interrogés à la volée

Écartés comme autorité d'exécution. Ils peuvent aider l'édition, mais leurs schémas, licences, disponibilité et analyses diffèrent.

### Validation par modèle génératif

Écartée : non déterministe, difficile à sourcer et insuffisante pour garantir l'exactitude.

## Conséquences

### Positives

- résultats déterministes et explicables ;
- contenu testable et reproductible ;
- corrections et migrations traçables ;
- prise en charge de plusieurs écritures et analyses concurrentes ;
- séparation entre fait linguistique et représentation ludique.

### Négatives

- coût éditorial important ;
- modèle plus riche qu'un dictionnaire de chaînes ;
- besoin d'outils de saisie, de revue et de migration ;
- impossibilité de promettre une couverture exhaustive.

## Critères de réévaluation

Le vocabulaire et les entités pourront évoluer après un premier lot réel de contenu. La nature éditoriale et versionnée du graphe ne devra être remise en cause que si une autre approche offre la même traçabilité et la même qualité.

