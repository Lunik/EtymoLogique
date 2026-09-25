# ADR 0001 — PWA responsive comme plateforme MVP

- **Statut** : Accepté
- **Portée** : MVP

## Contexte

ÉtymoLogique doit tester rapidement une interaction de manipulation utilisable au toucher comme à la souris. Le produit vise des sessions courtes, mais le codex et les explications bénéficient aussi d'un grand écran. Maintenir plusieurs applications natives retarderait la validation du cœur ludique.

## Décision

Le MVP sera une application web responsive installable en tant que Progressive Web App.

L'interface partagera le même modèle d'interaction sur mobile et ordinateur, avec des alternatives accessibles :

- glisser-déposer ou sélection suivie de « Ajouter à la table » ;
- réorganisation au pointeur, au toucher ou au clavier ;
- confirmation explicite de la fusion ;
- mise en page adaptée plutôt que réduction uniforme de l'écran desktop.

Le shell de l'application et le dernier catalogue publié pourront être mis en cache. La consultation du codex et la préparation d'une fusion pourront fonctionner hors connexion. Les opérations modifiant l'état autoritaire — ouverture de pli, consommation d'énergie, attribution d'une découverte et synchronisation — nécessiteront une validation serveur.

Une tentative préparée hors connexion peut être conservée localement, mais elle ne doit pas afficher un succès définitif avant validation si le client ne possède pas une version de contenu autorisée pour ce calcul.

## Options envisagées

### Applications natives iOS et Android

Écartées pour le MVP : elles offrent une intégration système supérieure, mais multiplient les surfaces à maintenir avant validation du gameplay.

### Application desktop

Écartée : elle facilite le glisser-déposer, mais correspond moins bien aux sessions courtes et réduit la portée du test.

### Site web non installable

Écarté : proche techniquement, mais moins adapté au retour régulier lié aux plis et à la reprise de session.

## Conséquences

### Positives

- une base d'interface pour mobile et desktop ;
- déploiement et expérimentation rapides ;
- installation facultative ;
- partage simple d'un prototype ;
- stratégie hors connexion progressive.

### Négatives

- comportement variable des PWA selon les plateformes ;
- gestes tactiles et glisser-déposer à tester soigneusement ;
- notifications et tâches d'arrière-plan non garanties partout ;
- nécessité de gérer cache, migration et incompatibilité de catalogue.

## Critères de réévaluation

Réévaluer si les tests montrent une limitation critique des interactions, si une fonctionnalité native devient centrale ou si la distribution en boutique devient une exigence produit.

