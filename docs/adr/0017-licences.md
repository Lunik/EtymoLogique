# ADR 0017 — Code sous AGPL, contenu sous CC BY-SA, nom réservé

- **Statut** : Accepté
- **Portée** : tout le dépôt, le futur catalogue publié et l'application
- **Complète** : [ADR 0014](0014-sources-et-fascicules.md) (licence du catalogue, laissée ouverte)

## Contexte

- Le dépôt est public, mais n'avait encore aucune licence : par défaut, tous les droits sont réservés, et personne ne peut ni réutiliser ni contribuer en sécurité.
- L'[ADR 0014](0014-sources-et-fascicules.md) laissait ouverte la licence du catalogue. Aucun texte du Wiktionnaire n'y est copié, donc le choix est libre.
- Le dépôt mélange trois natures d'œuvres : du **code** (démos HTML, CSS, JavaScript, scripts Python, workflows), du **contenu** (dossier de conception, ADR, puis gloses, explications et relations du catalogue) et une **identité** (nom, logo, charte).
- L'intention : un projet ouvert, que chacun peut étudier, modifier et même exploiter, mais qu'**aucun clone fermé** ne peut s'approprier. Le jeu sera servi en ligne ([ADR 0001](0001-pwa-responsive.md), [ADR 0007](0007-etat-et-economie-autoritaires.md)) : une licence qui ne couvre que la distribution de binaires ne suffit pas.

## Décision

### Trois périmètres, trois régimes

| Périmètre | Licence | Fichier |
|---|---|---|
| Code : HTML, CSS, JavaScript, scripts, workflows, skills | **GNU AGPL 3.0 ou ultérieure** (`AGPL-3.0-or-later`) | `LICENSE` |
| Contenu : documentation, ADR, textes et données du catalogue (gloses, définitions, explications, relations) | **Creative Commons BY-SA 4.0** (`CC-BY-SA-4.0`) | `LICENSE-CONTENT` |
| Nom « ÉtymoLogique », logo, marque | **Réservés**, hors de ces licences | — |

- Titulaire des droits : Guillaume MARTINEZ (© 2026). Les contributions sont reçues sous la licence du périmètre qu'elles touchent.
- L'AGPL oblige quiconque sert une version modifiée du jeu en ligne à publier ses sources sous la même licence.
- La CC BY-SA oblige tout dérivé du contenu à créditer ÉtymoLogique et à rester sous CC BY-SA 4.0.
- Un fork peut reprendre le code et le contenu, mais doit **changer de nom et de logo**.
- En cas de doute sur un fichier, les pages HTML relèvent du code pour leur structure et leurs scripts, et du contenu pour leurs textes.

### Pas de clause non commerciale

L'usage commercial reste permis : la protection vient du copyleft, pas d'une interdiction. Le MVP ne comporte aucun paiement ([ADR 0008](0008-energie-et-plis.md)), et cette décision n'en introduit pas.

### Effet sur les sources

- Le catalogue sous CC BY-SA 4.0 devient compatible avec le texte du Wiktionnaire, sous la même licence.
- Cela remplit un critère de réévaluation de l'[ADR 0014](0014-sources-et-fascicules.md), **sans changer sa décision** : le Wiktionnaire reste une source de repérage, parce que ses étymologies sont rarement sourcées et qu'elles peuvent changer. La licence n'est plus un obstacle, la fiabilité l'est toujours. Un import direct demanderait un nouvel ADR.
- Les références savantes (TLFi, Bailly, Gaffiot…) restent citées, jamais copiées.

## Options envisagées

### Licences permissives (MIT, Apache 2.0, CC BY)

Écartées : n'importe qui pourrait reprendre le jeu et son catalogue dans une application fermée, ce que le projet veut précisément éviter.

### Clause non commerciale (PolyForm Noncommercial, CC BY-NC-SA)

Écartée : ces licences ne sont pas libres au sens de l'OSI ni de la Free Software Foundation. La notion de « commercial » est floue (un site avec publicité, une école privée…), elle décourage les contributions, et CC BY-NC-SA n'est pas compatible avec le Wiktionnaire.

### AGPL pour le code, CC BY-NC-SA pour le contenu

Écartée : elle cumule le flou du non-commercial et l'incompatibilité avec le Wiktionnaire, alors que le catalogue est justement ce qu'un clone voudrait copier.

### GPL 3.0 plutôt qu'AGPL

Écartée : la GPL ne s'applique qu'à la distribution. Un service en ligne modifié pourrait garder ses sources fermées.

### Tous droits réservés, code visible

Écartée : personne ne pourrait contribuer ni réutiliser, ce qui contredit l'ouverture souhaitée.

## Conséquences

### Positives

- Le projet est libre, et aucun dérivé, pas même un service en ligne, ne peut se fermer.
- Le catalogue peut accueillir des contributions et s'aligner un jour sur le Wiktionnaire, sans conflit de licence.
- Le nom protège l'identité : un joueur ne confond pas un fork avec le jeu.

### Négatives

- L'AGPL rebute certaines entreprises et certains contributeurs, et interdit d'intégrer le code dans un produit fermé.
- Le double régime oblige à savoir si un fichier relève du code ou du contenu.
- Un concurrent peut exploiter commercialement un fork, s'il le garde ouvert et le renomme.
- Le titulaire seul ne pourra relicencier les contributions extérieures sans l'accord de leurs auteurs.

## Critères de réévaluation

- Un modèle économique futur (paiements, [ADR 0008](0008-energie-et-plis.md)) exige une double licence ou un accord de contribution.
- Un partenaire éditorial (dictionnaire, institution) ne peut fournir du contenu que sous une autre licence.
- Un fork fermé ou trompeur apparaît malgré la licence : il faudra alors envisager un dépôt de marque.
