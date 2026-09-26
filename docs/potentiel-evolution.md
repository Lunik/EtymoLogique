# ÉtymoLogique — Potentiel d'évolution du contenu

Cette note estime la quantité de contenu que le jeu peut publier et décrit les pistes qui permettront de l'enrichir. Elle s'appuie sur l'[ADR 0014](adr/0014-sources-et-fascicules.md) (sources et fascicules) et l'[ADR 0022](adr/0022-fascicules-de-20-a-30-mots.md) (fascicules de 20 à 30 mots, un par mois).

> Les chiffres ci-dessous sont un ordre de grandeur, pas un décompte exact. Ils décrivent des pistes de repérage : aucun mot n'est publiable sans source de référence.

## Le corpus du Wiktionnaire

Relevé du 26 septembre 2026 sur le Wiktionnaire français, à partir des catégories « Mots en français préfixés avec … » et « Mots en français suffixés avec … » :

| | Préfixes | Suffixes |
|---|---|---|
| Affixes recensés | 1 080 | 675 |
| Affixes formant au moins 20 mots | 184 | 181 |
| Affixes formant au moins 100 mots | 42 | 70 |
| Appartenances aux catégories | 19 604 | 50 400 |

- Préfixes les plus fournis : *in-* (1 080 mots), *dé-* (751), *re-* (603), *anti-* (520), *micro-* (457), *hyper-* (311), *pré-*, *auto-*, *mono-*, *neuro-*, *télé-*, *hydro-*, *bio-*.
- Suffixes les plus fournis : *-able* (3 065 mots), *-ment* (2 676), *-iste* (2 467), *-isme* (2 318), *-eur*, *-ique*, *-age*. Côté savant : *-mètre* (452), *-graphie* (426), *-phile* (369), *-phobie* (292), *-logue* (271).
- Hors affixes : 58 638 « compositions » et 56 111 « dérivations » en français.

Limites de la mesure : un mot à la fois préfixé et suffixé est compté deux fois, et seules les tailles des catégories ont été relevées. Un décompte exact demandera l'export structuré de [kaikki.org](https://kaikki.org/) (Wiktextract), plus fiable qu'une interrogation page par page de l'API.

## Combien de fascicules ?

| | Mots | Fascicules de 20 à 30 mots | À un fascicule par mois |
|---|---|---|---|
| Corpus brut | environ 50 000 | environ 2 000 | plus d'un siècle |
| Corpus publiable (estimation) | 5 000 à 10 000 | 200 à 400 | 15 à 30 ans |

Le corpus publiable écarte les mots archaïques, trop techniques ou trop rares, ceux dont l'analyse n'est pas établie et ceux qu'aucune source de référence n'atteste. La proportion de 10 à 20 % est une hypothèse, à mesurer sur les premiers fascicules.

**Le corpus n'est pas la limite.** Ce qui fixe le rythme, c'est :

- le temps du joueur : environ 2 plis par mot découvert, soit 30 mots par mois au plus pour un joueur assidu ([ADR 0022](adr/0022-fascicules-de-20-a-30-mots.md)) ;
- le travail éditorial : sourcer, rédiger et relire environ un mot par jour ([ADR 0014](adr/0014-sources-et-fascicules.md)) ;
- la fermeture : un affixe très productif (*-able*, *-ment*, *dé-*) ouvre d'autant plus de mots croisés que le catalogue grandit. Il doit arriver tôt, ou avec peu de mots de base.

## Leviers d'évolution

- **Les mots comme ingrédients** : un mot publié redevient une brique (*biologie* + *-iste*). Chaque fascicule élargit ce que les suivants peuvent former, sans nouvel affixe ([modèle de données](modele-donnees.md)).
- **Les racines et les compositions savantes** : au-delà des préfixes et suffixes, des milliers de compositions (*photo-* + *-graphie*) donnent des mots aux histoires riches.
- **D'autres langues de jeu** : l'architecture est multilingue dès le départ ([ADR 0006](adr/0006-architecture-multilingue.md)). Chaque langue de jeu ouvre son propre corpus, et les langues d'origine communes créent des ponts.
- **Les légendaires** : des mots rares ou surprenants, hors des compteurs, qui enrichissent un fascicule sans alourdir sa complétude ([ADR 0015](adr/0015-codex-fascicules-et-legendaires.md)).
- **Des recettes plus longues** : trois briques ou plus, si les tests montrent qu'elles restent lisibles (question ouverte de la [vision du jeu](game-design.md#questions-encore-ouvertes)).

## Piste : les fascicules spéciaux

> Piste ouverte, non décidée. Elle demandera un ADR avant toute mise en œuvre.

Au-delà du fascicule mensuel, l'équipe pourrait publier, **hors calendrier et quand elle le souhaite**, un fascicule spécial qui ajoute d'un coup beaucoup de contenu : une grande famille de mots, une langue d'origine, un thème (la médecine, la navigation, les sciences).

Ce qui semble compatible avec les règles en vigueur :

- un fascicule spécial reste un fascicule : sa jaquette, son pli, ses briques, sa complétude dans le codex ([ADR 0016](adr/0016-plis-et-jaquettes-par-fascicule.md)) ;
- ses plis restent ouverts pour toujours, comme ceux des anciens fascicules : aucun contenu à durée limitée, **aucune fausse urgence** ;
- il est gratuit : **aucun paiement** dans le MVP, et le contenu n'est jamais vendu ;
- il ne dévoile pas son contenu : son annonce ne donne que des nombres, et seulement à sa parution ([ADR 0014](adr/0014-sources-et-fascicules.md)).

Ce qu'un futur ADR devra trancher :

- **Taille** : combien de mots, et comment un joueur assidu les découvre sans que le fascicule mensuel en souffre ? Plus de 30 mots dépasse le rythme d'un mois ([ADR 0022](adr/0022-fascicules-de-20-a-30-mots.md)) : il faudra accepter qu'il se complète sur plusieurs mois.
- **Rythme des plis** : partage-t-il les mêmes plis quotidiens que le fascicule mensuel, ou faut-il un apport de plis propre, sans créer de pression à revenir ?
- **Calendrier** : suspend-il ou décale-t-il le fascicule mensuel de sa période ?
- **Fermeture** : ses affixes ouvrent des mots croisés avec tout le catalogue. Appartiennent-ils au fascicule spécial, même s'ils dépassent sa taille prévue ?
- **Travail éditorial** : un grand volume se prépare sur plusieurs mois, en parallèle des fascicules mensuels.
- **Présentation** : comment le distinguer dans le codex et sur l'écran des plis (nom, jaquette), sans vocabulaire interdit (« pack », « extension », « saison ») ?

## Prochaines étapes

- Décompter exactement le corpus à partir de l'export kaikki.org : mots distincts, mots formés d'un préfixe et d'un suffixe, mots formables à partir d'un premier jeu de briques.
- Simuler un vrai fascicule de 20 à 30 mots pour confirmer qu'il se complète en moins de 30 jours.
- Mesurer la part publiable sur les premiers fascicules pour remplacer l'hypothèse de 10 à 20 %.
