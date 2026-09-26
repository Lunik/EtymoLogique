# ADR 0014 — Sources de référence et publication par fascicules

- **Statut** : Proposé
- **Complète** : [ADR 0002](0002-graphe-linguistique-editorial.md) (sources et confiance), [ADR 0004](0004-progression-atteignable.md) (atteignabilité par fascicule), [ADR 0005](0005-pipeline-de-contenu.md) (circuit d'édition), [ADR 0013](0013-schema-des-briques.md) (tables `source` et `fascicule`)

## Contexte

Le [modèle de données](../modele-donnees.md) décrit les langues, mots, préfixes et suffixes, mais pas leur origine ni leur rythme d'arrivée. Deux questions restent ouvertes.

- **D'où viennent les faits ?** Le Wiktionnaire offre une couverture très large et des données déjà structurées (extraites par Wiktextract et diffusées sur kaikki.org). Mais ses étymologies sont inégales et rarement sourcées. Son texte est sous licence CC BY-SA 4.0 : tout contenu qui en dérive doit être redistribué sous la même licence. Les références savantes (TLFi, Bailly, Gaffiot, Chantraine…) sont plus sûres, mais aucune n'est sous licence libre : on peut les citer, pas les copier.
- **Comment le catalogue grandit-il ?** Un joueur qui a tout découvert doit recevoir de nouveaux mots. Chaque apport doit rester cohérent : toutes les briques nécessaires présentes, aucune combinaison réelle laissée sans réponse.

## Décision

### Le Wiktionnaire repère, les références attestent

- Le Wiktionnaire (français et anglais) est une **source de repérage**. Il sert à proposer des candidats : unités, formes, relations et compositions. **Aucun de ses textes n'est copié** dans le catalogue.
- Chaque import est un fichier daté, conservé hors du catalogue publié. Un fait proposé par un import naît à l'état `brouillon`.
- Les gloses, définitions, sens littéraux et explications sont **rédigés par l'équipe**.
- La licence du catalogue reste donc un choix libre de l'équipe, tranché depuis par l'[ADR 0017](0017-licences.md) : CC BY-SA 4.0.

### Sources de référence et niveaux de confiance

Une source a un rôle : `reference` (dictionnaire ou ouvrage qui fait autorité) ou `reperage` (Wiktionnaire, outils d'extraction). Liste de départ, extensible par l'équipe éditoriale :

| Langue | Sources de référence |
|---|---|
| Français | TLFi (ATILF), Dictionnaire de l'Académie française (9ᵉ édition), Littré (domaine public, étymologies à dater) |
| Latin | Gaffiot, Ernout-Meillet |
| Grec ancien | Bailly, LSJ, Chantraine |

Règles de publication :

| Confiance | Exigence |
|---|---|
| Établie | Au moins une source de référence affirme le fait. |
| Probable | Au moins une source de référence le présente comme une hypothèse. |
| Discutée | Au moins deux sources de référence sont en désaccord. Chaque analyse est enregistrée. |
| Non retenue | Jamais publiée comme solution. |

- **Le Wiktionnaire seul ne suffit jamais pour publier**, quel que soit le niveau de confiance.
- Chaque lien entre un fait et une source indique l'entrée ou la page consultée, et l'édition utilisée.

### Le fascicule, unité de publication du contenu

Le contenu arrive par **fascicules**, comme les grands dictionnaires qui paraissaient par livraisons successives. Le mot « pli » reste réservé au pli scellé que le joueur ouvre.

- **Rythme** : un fascicule environ tous les **30 jours**. Ce délai est un paramètre d'équilibrage ([ADR 0009](0009-contenu-et-equilibrage.md)).
- **Taille** : **20 à 40 mots** par fascicule, mots croisés compris (voir plus bas). La fourchette est aussi un paramètre d'équilibrage.
- **Contenu** : un fascicule déclare la liste complète des unités dont il a besoin : ses mots, et tous les préfixes, suffixes et mots qui servent d'ingrédients à ses recettes. Les langues en découlent.
- **Unicité** : un mot n'est **le résultat** que d'un seul fascicule. Un préfixe, un suffixe ou un mot déjà publié peut être **repris** comme ingrédient par un fascicule suivant : c'est la même unité, avec le même identifiant, jamais une copie.
- **Présentation au joueur** : un fascicule ne dévoile jamais son contenu. Son annonce, sa fiche sur l'écran des plis et sa présentation n'affichent que des nombres : mots, préfixes, suffixes et langues, légendaires exclues ([ADR 0015](0015-codex-fascicules-et-legendaires.md)). Avant sa parution, même ces nombres restent cachés. Dans le codex, les silhouettes gardent leur piste de sens.
- **Publication** : chaque fascicule est une nouvelle version immuable du catalogue ([ADR 0002](0002-graphe-linguistique-editorial.md)), qui passe tout le circuit de l'[ADR 0005](0005-pipeline-de-contenu.md).
- **Plis** : dès sa publication, le fascicule a son propre pli, qui porte sa jaquette et ne tire que parmi ses briques ([ADR 0016](0016-plis-et-jaquettes-par-fascicule.md)). Le joueur peut fusionner des briques de fascicules différents.

### Complétude : aucune combinaison réelle sans réponse

Un fascicule N n'est publiable que si les deux règles suivantes sont vraies sur l'ensemble des fascicules 1 à N :

1. **Autonomie** : tout ingrédient d'une recette du fascicule est publié, dans ce fascicule ou dans un fascicule précédent.
2. **Fermeture** : pour toute suite ordonnée de briques publiées, jusqu'au nombre maximal de briques sur la table, **si une source de référence atteste un mot formé de ces éléments**, ce mot est publié avec sa recette. La règle couvre aussi les mots déjà publiés utilisés comme ingrédients (*biologie* + *-iste*).

Conséquences pour l'édition :

- Un nouvel affixe peut créer des **mots croisés** avec les briques des anciens fascicules. Ils appartiennent au nouveau fascicule et comptent dans ses 20 à 40 mots. On choisit donc les affixes d'un fascicule en tenant compte de ce qu'ils ouvrent.
- La recherche des combinaisons candidates est outillée : un script parcourt les suites de briques publiées et interroge l'import du Wiktionnaire pour trouver les mots qui s'analysent ainsi. Chaque candidat est ensuite vérifié dans une source de référence. Une simple ressemblance de chaînes ne prouve jamais une combinaison ([ADR 0003](0003-recettes-de-fusion.md)).
- **Exclusion déclarée** : une combinaison attestée peut être écartée si le mot est archaïque, trop rare, offensant, ou si son analyse n'est pas établie. L'exclusion est enregistrée avec sa raison et relue. Le joueur qui la tente reçoit un retour honnête, jamais un échec qui laisserait croire que le mot n'existe pas.

### Suivi et correction

- À chaque nouveau fascicule, un nouvel import du Wiktionnaire est comparé au précédent. Un changement qui touche un fait déjà publié ouvre une **tâche de revue**, jamais une modification automatique.
- Une correction publie une nouvelle version et suit les migrations de l'ADR 0005.

## Options envisagées

### Importer le Wiktionnaire comme source de contenu

Écartée : le catalogue entier deviendrait CC BY-SA 4.0 par dérivation, les étymologies non sourcées entreraient dans le jeu, et une modification d'une page du Wiktionnaire pourrait changer un fait publié.

### Importer seulement les données structurées du Wiktionnaire

Écartée : formes et relations extraites restent une adaptation de la base, soumise au partage à l'identique, et la vérification resterait nécessaire.

### Publier en « probable » avec le Wiktionnaire seul

Écartée : le niveau de confiance deviendrait un reflet de la source disponible, plus du consensus. Le joueur n'aurait aucun moyen de le savoir.

### Contenu publié en continu, mot par mot

Écartée : chaque ajout devrait passer seul la validation d'atteignabilité et de complétude, le rythme serait illisible pour le joueur, et les mots croisés arriveraient au hasard.

### Mots croisés hors budget

Écartée : un affixe très productif (*-logie*) ferait exploser la taille d'un fascicule et le travail éditorial du mois.

### Pas de règle de fermeture

Écartée : le joueur qui combine deux briques de fascicules différents pour former un mot réel recevrait un échec. Le jeu contredirait la langue.

## Conséquences

### Positives

- Tout fait publié repose sur une source de référence, et le Wiktionnaire accélère le travail sans en devenir l'autorité.
- La licence du catalogue reste un choix libre (CC BY-SA 4.0 depuis l'[ADR 0017](0017-licences.md)).
- Le joueur reçoit un apport régulier et cohérent : chaque fascicule se joue sans brique manquante.
- Les fusions entre fascicules sont encouragées et jamais punies par un faux échec.

### Négatives

- Rédiger toutes les gloses, définitions et explications demande un vrai travail éditorial : environ 20 à 40 fiches par mois.
- Les références savantes sont souvent payantes ou consultables seulement en ligne : l'équipe doit y avoir accès.
- La règle de fermeture croît avec le catalogue : plus il y a de briques, plus un nouvel affixe ouvre de combinaisons à vérifier. Le script de candidats devient indispensable.
- Les exclusions déclarées demandent une réponse de jeu dédiée, à concevoir.
- Le rythme des plis ([ADR 0012](0012-briques-rationnees.md)) doit être recalculé à chaque fascicule : un joueur actif doit pouvoir découvrir la plupart des mots d'un fascicule avant le suivant.

## Critères de réévaluation

- Un fascicule ne peut pas être bouclé en 30 jours à cause de la rédaction ou de la vérification.
- La règle de fermeture impose plus de la moitié des mots d'un fascicule en mots croisés.
- Les joueurs actifs épuisent un fascicule en moins de 10 jours, ou n'en découvrent pas la moitié avant le suivant.
- L'équipe décide d'une licence libre compatible avec CC BY-SA : l'import direct du Wiktionnaire pourrait alors être reconsidéré. C'est le cas depuis l'[ADR 0017](0017-licences.md), qui maintient toutefois le Wiktionnaire en source de repérage.
