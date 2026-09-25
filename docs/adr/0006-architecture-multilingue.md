# ADR 0006 — Architecture multilingue indépendante du lancement

- **Statut** : Accepté

## Contexte

L'étymologie traverse plusieurs langues et systèmes d'écriture. La langue de l'interface, la langue d'un mot et la convention utilisée pour translittérer une forme sont trois dimensions différentes. Le premier lot de contenu n'est pas encore choisi.

## Décision

L'architecture de données sera multilingue dès le MVP, sans exiger que plusieurs langues d'interface ou un grand nombre de langues jouables soient livrés.

Le système distingue :

- **locale d'interface** : libellés, explications et formats destinés au joueur ;
- **langue linguistique** : langue d'un lexème ou d'un morphème, avec période ou variété si nécessaire ;
- **système d'écriture** : alphabet, abjad, syllabaire ou autre système d'une forme ;
- **forme originale** : texte éditorial conservé en Unicode ;
- **translittération** : représentation selon une convention identifiée ;
- **traduction ou glose** : sens présenté dans une locale d'interface.

Les références utilisent des identifiants stables plutôt que les libellés traduits. Le modèle autorise plusieurs formes et translittérations pour un même objet, sans les transformer en briques distinctes par défaut.

Le rendu :

- affiche toujours le nom complet de la langue dans la locale d'interface (« grec ancien », « latin », « français ») ; les codes de langue restent strictement internes et n'apparaissent jamais au joueur, même sous forme abrégée ;
- respecte la direction d'écriture au niveau du fragment ;
- utilise des polices de repli couvrant les écritures publiées ;
- n'impose pas une translittération lorsqu'une forme originale suffit ;
- affiche ensemble forme originale et translittération lorsque cela aide le public visé ;
- applique une normalisation Unicode uniquement aux comparaisons techniques prévues, jamais en remplaçant silencieusement la graphie éditoriale.

Les règles de fusion ne dépendent pas de chaînes localisées. Une recette référence des objets linguistiques et ses explications possèdent leurs propres traductions.

## Options envisagées

### Modèle centré uniquement sur le français

Écarté : il conduirait à mélanger traduction, translittération et identité linguistique, puis à une migration coûteuse.

### Tout traduire dès le MVP

Écarté : l'architecture générique ne justifie pas le coût d'une interface et d'un catalogue entièrement localisés avant validation.

### Translittération comme objet collectionnable indépendant

Écartée par défaut : elle dupliquerait artificiellement les découvertes. Une convention de lecture peut toutefois être récompensée comme connaissance, séparément des briques.

## Conséquences

### Positives

- ajout de langues sans refonte du domaine ;
- meilleure fidélité des formes historiques ;
- localisation de l'interface indépendante du contenu jouable ;
- recettes stables entre locales.

### Négatives

- contraintes Unicode, directionnelles et typographiques dès le départ ;
- tests nécessaires avec plusieurs écritures même si le lot initial est restreint ;
- coût de traduction des explications à anticiper.

## Critères de réévaluation

Réviser les conventions d'affichage avec des spécialistes des écritures effectivement publiées. Ne pas réduire la séparation entre locale, langue, écriture et translittération.

