# ADR 0013 — Schéma relationnel des langues, mots, préfixes et suffixes

- **Statut** : Proposé
- **Complète** : [ADR 0002](0002-graphe-linguistique-editorial.md) (entités du graphe), [ADR 0006](0006-architecture-multilingue.md) (formes, écritures et translittérations), [ADR 0009](0009-contenu-et-equilibrage.md) (points d'ancrage de la couche ludique)

## Contexte

Le prototype décrit chaque brique par un objet plat : un libellé avec son trait d'union (« géo- »), une glose, un type et une rareté. Chaque recette y mélange le mot, son sens littéral, sa définition et son explication. Ce format a suffi pour éprouver le design. Il ne permet pas de sourcer un fait, de relier *philo-* à *-phile*, de montrer les formes d'un mot dans plusieurs langues, ni de réutiliser un mot découvert comme ingrédient.

L'ADR 0002 nomme les entités du graphe, mais ne dit ni comment elles se relient, ni lesquelles deviennent des briques. Nous commençons avec quatre types d'objets : **langue, mot, préfixe et suffixe**. Il faut un schéma relationnel logique, indépendant de toute base de données, que le pipeline de contenu (ADR 0005) pourra valider.

Le schéma détaillé, ses diagrammes et ses exemples sont dans le [modèle de données](../modele-donnees.md).

## Décision

### Un supertype pour les mots, préfixes et suffixes

- Mots, préfixes et suffixes sont des **unités lexicales**. Ils partagent une table `unite_lexicale`, avec un discriminant `nature`, et deux sous-types exclusifs : `mot` et `affixe`.
- Compositions, relations étymologiques, sources et briques référencent toutes `unite_lexicale`. Un mot découvert peut donc redevenir un ingrédient (*biologie* + *-iste*) sans exception dans le modèle.

### La langue est un contexte, pas une brique

- Une langue n'est pas une unité lexicale. Chaque unité appartient à exactement une langue.
- La langue a sa carte dans le codex, mais une brique ne peut, par construction, référencer qu'une unité lexicale : aucune langue ne se pose sur la table.
- Les langues forment une généalogie (`langue_parente_id`). Le MVP compte **trois langues, sans variété** : grec ancien, latin et français. Une forme tardive ou médiévale reste rattachée à sa langue, et la précision éventuelle va dans l'explication.
- Les noms affichés sont traduits par locale. Les codes restent internes (ADR 0006).

### Un étymon est une unité d'une langue source

- Il n'y a pas de type « étymon » ni « racine ». Le grec *gê* est un mot du grec ancien.
- *géo-* est un préfixe **du français**, relié à *gê* par une relation `forme_de_composition`.
- *philo-* et *-phile* sont deux unités françaises distinctes, reliées au même grec *phílos*. Le codex les rapproche en remontant la relation, et chacune garde sa position.
- Un étymon qui n'est ni une brique ni le résultat d'une recette **n'a pas de carte propre** dans le codex. Il apparaît au verso des cartes qui en descendent et sur la carte de sa langue.

### Formes, sens et translittérations séparés

- Une unité a une forme canonique et, si nécessaire, des allomorphes et des graphies anciennes. Aucune de ces formes ne crée une nouvelle brique : quand une recette emploie un allomorphe (*phil-* dans *philanthrope*), elle le déclare comme transformation.
- Le texte d'une forme est stocké **sans trait d'union**. La position vient de la nature de l'unité, conformément à la règle d'affichage des briques.
- Les gloses (« terre ») et les définitions actuelles appartiennent aux sens, et sont traduites par locale.
- Une translittération appartient à une forme et à une convention déclarée.

### Homographes : deux unités, deux cartes

- Deux unités de même langue, de même nature et de même forme (*a-* « sans », du grec, et *a-* « vers », du latin *ad-*) sont des **homographes** : deux unités, deux briques, deux cartes.
- Le critère est l'origine. Même origine et sens différents : une unité avec plusieurs sens. Origines différentes : deux unités.
- Aucun numéro ne les distingue. Le joueur les reconnaît aux autres attributs de la carte : la glose affichée sur la brique et l'étymon visible au verso. Le validateur refuse deux homographes dont la glose ou l'étymon sont identiques.

### Composition n-aire et relations binaires

- Une **composition** analyse un mot en parties ordonnées. Chaque partie désigne une unité, le sens mobilisé, la forme employée et son segment dans le mot résultat (pour le surlignage).
- Le sens littéral et les transformations (élision, voyelle de liaison, allomorphie…) appartiennent à la composition.
- Un mot peut avoir plusieurs compositions : une synchronique, jouable, et une historique, ou deux analyses « discutées ».
- Une **relation étymologique** relie une unité source à une unité cible, avec un type contrôlé : héritage, emprunt, dérivation, forme de composition, adaptation, apparentement. La composition n'en fait pas partie, car elle n'est pas binaire.

### Tout ce qui est affirmé est un fait

- Unités, formes, sens, compositions et relations partagent le supertype éditorial `fait`. Il porte la confiance, l'état de relecture, les sources et la note de simplification.
- Les notes internes restent hors de l'artefact publié.

### Couche ludique : points d'ancrage seulement

- Une brique référence une unité lexicale, la forme affichée et le sens affiché. **Une unité a au plus une brique**, et une brique une seule unité. Une recette référence une composition.
- Les cartes du codex sont dérivées des unités et des relations, pas stockées. Une unité a sa carte si et seulement si elle est référencée par une brique ou par le résultat d'une recette.
- Le détail de la couche ludique (recettes, raretés, plis, réserve) fera l'objet d'un travail séparé.

### Versionnage par instantanés

Chaque publication est un instantané immuable. Le schéma ne porte pas de colonnes temporelles : les identifiants sont opaques et stables, et les changements de nature ou les suppressions passent par une migration explicite.

## Options envisagées

### Une table unique « brique » pour tout

Écartée : elle mélange faits et équilibrage (ADR 0009), duplique les formes grecques dans chaque brique et ne sait pas relier deux briques à un même étymon.

### Un type « étymon » ou « racine » à part

Écarté : un étymon est déjà un mot ou un morphème d'une langue. Un type à part dupliquerait les formes, les sens et les sources, et forcerait à décider arbitrairement ce qui est « racine ».

### La langue comme brique jouable

Écartée : la langue n'est pas un ingrédient d'un mot. Elle donne le contexte d'une forme. La poser sur la table brouillerait la distinction entre emprunt et composition.

### Une seule brique « philo » dont la recette fixe la position

Écartée : préfixe et suffixe ont des formes, des sens et des couleurs différents. La position fait partie de l'identité de la brique.

### Des tables séparées pour les mots et les affixes, sans supertype

Écartée : chaque composition, relation et brique aurait besoin de deux clés étrangères exclusives, ou d'une référence polymorphe impossible à contraindre.

### Le libellé avec trait d'union comme donnée

Écarté : « géo- » mélange forme et rendu. Le trait d'union est une convention d'affichage, et une brique n'est jamais affichée en texte brut.

### Une brique par forme, allomorphes compris

Écartée : *philo-* et *phil-* deviendraient deux briques, deux compteurs d'exemplaires et deux tirages dans les plis. Le joueur ne comprendrait pas pourquoi *philo-* ne suffit pas, et l'allomorphie cesserait d'être une transformation expliquée.

### Des variétés de langue distinctes

Écartées pour le MVP : grec ancien et koinè, ou latin classique et médiéval, fragmenteraient le codex en cartes de langue peu remplies et multiplieraient le coût éditorial, sans différence perceptible pour le joueur.

### Une carte pour chaque étymon

Écartée : le codex se remplirait de cartes obtenues sans découverte, ce qui diluerait la valeur de chaque fusion.

### Des homographes numérotés

Écartés : un « a¹ » ou « a² » n'apprend rien au joueur. La glose et l'étymon suffisent à distinguer les deux cartes et portent un vrai contenu.

## Conséquences

### Positives

- Un même fait (*gê* → *géo-*) sert au codex, aux recettes et aux explications, sans copie.
- Mot comme ingrédient, chaînes de langues et analyses concurrentes sont possibles sans cas particulier.
- Toute affirmation est sourçable et relue de la même manière.
- La langue ne peut pas devenir une brique par erreur de saisie.
- Le modèle reste indépendant de tout choix de stockage.

### Négatives

- Plus de tables qu'un dictionnaire de chaînes, et plus de saisie éditoriale : chaque brique demande au moins une unité, une forme, un sens et une relation vers sa source.
- Les sous-types exclusifs et l'absence de cycles demandent des contraintes que tous les stockages n'offrent pas. Le validateur de publication doit les vérifier.
- Le codex doit calculer ses cartes à partir des relations. La compilation du catalogue (ADR 0005) devra les précalculer pour le client.
- Deux homographes posent sur la table deux briques de même forme et de même couleur : seule la glose les distingue, et un mauvais choix donne un échec qui peut sembler injuste.
- Sans variété de langue, certaines précisions historiques (latin médiéval, formation savante moderne) ne passent que par l'explication.

## Critères de réévaluation

Revoir le schéma après la saisie d'un premier lot réel de contenu, en particulier si :

- des cas fréquents ne rentrent pas dans le vocabulaire de relations ou de transformations ;
- la distinction entre affixe et élément de composition n'est d'aucune utilité ;
- des briques ont besoin de plusieurs formes jouables pour une même unité ;
- les joueurs confondent des homographes, ou demandent à collectionner les étymons ;
- un contenu réel exige de distinguer des variétés d'une même langue ;
- un cinquième type d'objet collectionnable (famille, écriture…) remet en cause le supertype.
