# Architecture Decision Records

Les ADR consignent les décisions structurantes d'ÉtymoLogique. Ils complètent la [vision du jeu](../game-design.md) sans figer prématurément un framework ou un fournisseur.

## Statuts

- **Proposé** : décision à éprouver ou à faire accepter.
- **Accepté** : décision applicable au MVP.
- **Remplacé** : décision conservée pour l'historique, avec un lien vers son successeur.

Une modification importante se fait dans un nouvel ADR. Les corrections factuelles et clarifications qui ne changent pas la décision peuvent modifier l'ADR existant.

## Index

| ADR | Décision | Statut |
|---|---|---|
| [0001](0001-pwa-responsive.md) | PWA responsive comme plateforme MVP | Accepté |
| [0002](0002-graphe-linguistique-editorial.md) | Graphe linguistique éditorial et versionné | Accepté |
| [0003](0003-recettes-de-fusion.md) | Recettes explicites et transformations expliquées | Accepté |
| [0004](0004-progression-atteignable.md) | Progression pilotée par un graphe d'obtention vérifiable | Accepté |
| [0005](0005-pipeline-de-contenu.md) | Pipeline de contenu validé avant publication | Accepté |
| [0006](0006-architecture-multilingue.md) | Architecture multilingue indépendante du lancement | Accepté |
| [0007](0007-etat-et-economie-autoritaires.md) | État persistant et économie sous autorité serveur | Accepté |
| [0008](0008-energie-et-plis.md) | Énergie et plis gratuits, paiements hors MVP | Accepté, contenu des plis remplacé par 0011 |
| [0009](0009-contenu-et-equilibrage.md) | Séparation des faits linguistiques et de l'équilibrage | Accepté |
| [0010](0010-observabilite-et-vie-privee.md) | Observabilité minimale et respectueuse de la vie privée | Accepté |
| [0011](0011-plis-raretes-et-doublons.md) | Plis à raretés, doublons convertis en encre | Accepté, valeur des doublons remplacée par 0012, légendaires inconnues par 0015, catalogue du tirage par 0016 |
| [0012](0012-briques-rationnees.md) | Briques rationnées, exemplaires obtenus par les plis | Accepté, filet par fascicule remplacé par 0016 |
| [0013](0013-schema-des-briques.md) | Schéma relationnel des langues, mots, préfixes et suffixes | Proposé |
| [0014](0014-sources-et-fascicules.md) | Sources de référence et publication par fascicules | Proposé |
| [0015](0015-codex-fascicules-et-legendaires.md) | Codex par fascicule et légendaires secrètes | Accepté |
| [0016](0016-plis-et-jaquettes-par-fascicule.md) | Un pli et une jaquette par fascicule | Accepté |

## Page HTML

Les ADR sont aussi présentés dans [adr.html](../adr.html), avec des renvois vers les pages qui illustrent chaque décision. Après toute modification d'un ADR, régénérez la page :

```sh
python3 docs/scripts/build_adr.py
```

## Format

Chaque ADR contient :

1. le contexte et le problème ;
2. la décision ;
3. les options envisagées ;
4. les conséquences positives et négatives ;
5. les critères de réévaluation.

