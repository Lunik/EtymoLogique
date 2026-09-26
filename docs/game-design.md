# ÉtymoLogique — Vision du jeu

## Résumé

**ÉtymoLogique** est un jeu de logique, de découverte et de collection dans lequel le joueur assemble des briques linguistiques pour retrouver des mots et explorer leur histoire.

Le plaisir recherché vient de trois moments :

1. formuler une hypothèse à partir de racines, affixes et mots déjà connus ;
2. découvrir si l'assemblage correspond à une recette linguistique documentée ;
3. voir la découverte enrichir un codex et ouvrir de nouvelles possibilités.

ÉtymoLogique n'est ni un dictionnaire exhaustif ni un simulateur de concaténation. C'est un jeu fondé sur un graphe éditorial de relations linguistiques, simplifié pour être manipulable mais suffisamment explicite pour ne pas transformer une ressemblance en fait étymologique.

La direction « cabinet linguistique contemporain » est explorée dans le [dossier de direction](index.html), découpé en pages :

- **Identité** : [identité visuelle](identite.html), [design système](design-system.html), [typographie](typographie.html), [mouvement](mouvement.html) ;
- **Jeu** : [table de fusion](jeu.html), [plis](plis.html), [codex](codex.html) ;
- **Décisions** : [ADR](adr.html), [modèle de données](modele.html), [boussole](boussole.html).

Les pages se renvoient les unes aux autres là où une règle est appliquée ou décidée. La démo garde la réserve, les découvertes et les plis d'une page à l'autre (stockage local du navigateur).

## Promesse

> Comprendre comment les mots voyagent, se transforment et se composent en résolvant un monde de puzzles interconnectés.

### Piliers

- **Déduction** : les découvertes doivent pouvoir être anticipées à partir d'indices cohérents.
- **Expérimentation** : une tentative est rapide et réversible. Se tromper ne coûte rien ; seule une découverte consomme des exemplaires.
- **Rareté des briques** : les briques sont rationnées. Chaque exemplaire compte, et les plis sont le seul moyen d'en obtenir d'autres.
- **Collection** : chaque découverte complète un codex lisible et donne envie de terminer une famille.
- **Transmission** : le résultat explique la relation étymologique sans interrompre le rythme du jeu.
- **Progression maîtrisée** : le joueur ne dépend jamais d'une brique impossible à obtenir.

## Vocabulaire du jeu

| Terme | Rôle |
|---|---|
| **Brique** | Objet manipulable sur la table. Une brique peut représenter un lexème, un morphème ou une forme servant d'ingrédient. |
| **Découverte** | Entrée de codex nouvellement obtenue. Elle peut ajouter de nouvelles briques au catalogue des plis, mais ne donne jamais d'exemplaire directement. |
| **Exemplaire** | Unité d'une brique. Une découverte consomme un exemplaire de chaque brique utilisée. |
| **Réserve** | Ensemble des exemplaires possédés, 5 au plus par brique. Une brique à zéro exemplaire est **épuisée** mais reste dans le codex. |
| **Recette** | Combinaison ordonnée d'ingrédients et de transformations produisant une découverte. |
| **Transformation** | Changement documenté entre les ingrédients et la forme résultante : adaptation phonétique, voyelle de liaison, suffixation, emprunt, etc. |
| **Codex** | Collection de langues, mots, morphèmes, familles et relations déjà découverts. |
| **Graine** | Brique de la réserve de départ, accordée avec quelques exemplaires pour amorcer le graphe. Ensuite, les jalons offrent des plis au contenu déterministe. |
| **Pli** | Pli scellé, gratuit, seule source d'exemplaires après la réserve de départ. On dit « ouvrir un pli », « l'atelier des plis ». Le mot anglais « pack » n'est jamais employé. |
| **Fascicule** | Nouvel ensemble de 20 à 30 mots, avec leurs briques et leurs langues, publié environ tous les 30 jours. Il a sa jaquette et son pli, que le joueur peut ouvrir à tout moment. On ne dit ni « pack », ni « extension », ni « saison ». |
| **Sablier** | Objet qui fait avancer d'une heure la recharge d'énergie, jamais un tirage. Il coûte 1 goutte d'encre ou se gagne par un jalon (ADR 0020) ; son achat n'arrivera qu'après le MVP (ADR 0018, proposé). On ne dit ni « boost », ni « accélérateur ». |

Le terme « Pokédex » décrit bien l'intention de collection, mais le produit utilisera **codex** tant qu'aucun nom propre original n'aura été choisi.

## Boucle principale

1. Le joueur ouvre son codex.
2. Il filtre ou recherche des briques par langue, famille, fonction ou découverte récente.
3. Il envoie une ou plusieurs briques sur la table de fusion. Chaque brique posée réserve un exemplaire.
4. Il les ordonne et les superpose ou active le bouton de fusion.
5. Le moteur compare la proposition aux recettes accessibles :
   - **succès** : animation courte, révélation du mot, explication et nouveaux déblocages ; un exemplaire de chaque brique utilisée est consommé ;
   - **presque** : indice sobre si les ingrédients sont pertinents mais incomplets ou mal ordonnés ;
   - **échec** : retour immédiat, sans perte d'exemplaire.
6. Le joueur consulte les nouvelles branches ouvertes dans le codex.
7. Il recommence ou poursuit une famille. Quand sa réserve ne suffit plus, il ouvre le prochain pli gratuit pour la remplir.

Une session courte doit permettre au minimum une hypothèse, une fusion et une décision sur la prochaine piste.

## Première session

### Objectifs

- faire comprendre qu'une erreur ne coûte rien, qu'une découverte utilise un exemplaire de chaque brique, et que les plis remplissent la réserve ;
- montrer qu'ordre et transformations comptent ;
- offrir une première réussite guidée en quelques interactions ;
- révéler simultanément un mot, une langue et une relation ;
- laisser au moins deux pistes ouvertes à la fin du tutoriel.

### Proposition d'onboarding

1. Une entrée thématique telle que **étymologie** est déjà visible, mais son histoire reste masquée.
2. Le jeu révèle progressivement quelques briques validées par l'équipe éditoriale.
3. Une première fusion guidée montre l'ordre des composants.
4. La révélation explique la transformation en une phrase, avec un bouton « En savoir plus ».
5. La découverte débloque une langue, une famille et de nouvelles briques dans le catalogue des plis.
6. Le joueur reçoit ensuite sa réserve de départ (démonstration : quatre briques en deux exemplaires), qui crée plusieurs recettes possibles, pas une seule route obligatoire.

« Étymologie » est un excellent candidat narratif, mais sa décomposition exacte et ses formes grecques, latines et françaises devront être vérifiées et sourcées avant publication. Les exemples du prototype ne doivent pas devenir des faits de production par simple répétition.

### Règle d'amorçage

Le lot initial doit offrir :

- au moins trois recettes immédiatement réalisables, avec assez d'exemplaires pour les réaliser toutes sans pli ;
- au moins deux familles distinctes ;
- au moins une recette à deux ingrédients et une avec transformation visible ;
- plusieurs chemins vers le prochain jalon ;
- aucune brique indispensable disponible uniquement par hasard.

## Table de fusion

### Interaction

- Glisser-déposer sur grand écran, toucher puis « Ajouter à la table » sur mobile.
- Réorganisation explicite des briques, car l'ordre fait partie de l'hypothèse.
- Bouton **Fusionner** toujours disponible lorsque la proposition est syntaxiquement valide.
- Bouton **Vider** qui remet les briques dans la réserve sans conséquence.
- Chaque brique posée réserve un exemplaire. Une brique dont tous les exemplaires sont posés, ou qui est épuisée, ne peut pas être ajoutée ; un message explique pourquoi.
- Accès au codex sans fermer ni perdre la proposition en cours.
- Zone d'essai limitée à un petit nombre de briques dans le MVP afin de préserver la lisibilité.

### Représentation des briques

Une brique élémentaire (préfixe, suffixe ou toute forme à trait d'union) n'est **jamais affichée en texte brut**, où qu'elle apparaisse :

- **dans le jeu** : table, fiches, tuiles de découvertes, messages et plis ;
- **dans le codex** : petites cartes, recto, verso, composants et formes dans chaque langue.

Selon la place disponible, elle prend la forme d'une brique complète (avec son type et son sens) ou d'une petite brique en ligne. La couleur reste toujours la même : vert clair pour un préfixe, turquoise pour un suffixe. Une composition s'affiche comme une suite de briques reliées par « + », jamais comme la chaîne « préfixe- + -suffixe ».

### Rationnement des briques

Voir l'[ADR 0012](adr/0012-briques-rationnees.md). Le joueur dispose d'un nombre limité d'exemplaires de chaque brique. Pour en obtenir de nouveaux, il faut ouvrir des plis.

| Situation | Effet sur la réserve |
|---|---|
| Brique posée sur la table | Un exemplaire est réservé ; il revient si on retire la brique ou si on vide la table. |
| Nouvelle découverte | Un exemplaire de chaque brique utilisée est consommé. |
| Recette déjà découverte, presque ou échec | Rien n'est consommé. |
| Pli : brique nouvelle | 1 exemplaire. |
| Pli : brique connue | +1 exemplaire, jusqu'à 5 ; 2 gouttes d'encre, plus un bonus selon la rareté, doublé quand la réserve est pleine (ADR 0019, 0020). |

Représentation :

- **compteur** : chaque brique de la réserve porte une pastille « ×n » qui indique les exemplaires disponibles, y compris « ×1 » ;
- **exemplaires tous posés** : brique à 40 % d'opacité, sans ombre ;
- **épuisée** : contour pointillé, fond hachuré Sable, libellé en Gris encre et pastille « Épuisée ». La brique reste dans le codex et revient par les plis ;
- **consommation** : après une découverte, un « −1 » s'envole des briques utilisées, et la fiche de découverte liste les exemplaires utilisés et ce qu'il en reste.

Quand il ne reste qu'un exemplaire d'une brique utile à plusieurs mots, le joueur choisit quel mot écrire. C'est une décision de jeu voulue, jamais une punition : les essais ratés restent gratuits.

### Retour de tentative

| Résultat | Retour |
|---|---|
| Recette exacte non découverte | Révélation complète, ajout au codex et consommation d'un exemplaire de chaque brique. |
| Recette exacte déjà découverte | Rappel rapide de la fiche, sans récompense artificielle ; rien n'est consommé. |
| Sous-ensemble d'une recette accessible | Indice optionnel : ingrédient manquant ou ordre à revoir. |
| Recette réelle mais pas encore autorisée | Message honnête indiquant qu'une piste reste à découvrir, sans dévoiler la réponse. |
| Aucune recette correspondante | Échec neutre et immédiat ; aucun exemplaire n'est consommé. |

Le jeu ne doit pas marquer une tentative « presque correcte » si le graphe éditorial ne permet pas de justifier cette proximité.

## Le codex

### Vues

- **Découvertes récentes** : relance rapide après une révélation.
- **Mots** : forme principale, langue, sens pertinent, famille et état de complétion.
- **Briques** : composants utilisables et variantes d'affichage.
- **Langues** : progression par langue et liens historiques déjà rencontrés.
- **Familles** : branches découvertes, silhouettes restantes et objectifs.
- **Relations** : vue avancée du chemin entre les formes, après validation de son intérêt UX.

### Vue globale

- Grille de petites cartes, avec un bandeau de couleur par type : mot, préfixe, suffixe, langue. Les cartes de langue prennent la couleur de leur langue.
- Au milieu de chaque petite carte découverte, sous le mot, une ligne discrète donne son sens : le sens littéral d'un mot (*géographie* « description de la terre »), la glose d'une brique (*géo-* « terre »). Une carte de langue y porte son nom.
- Chaque carte découverte porte en fond une silhouette simple de son sens (une hélice pour *biologie*, une amphore pour le grec ancien), en aplat monochrome. Une carte inconnue n'en a pas, pour ne rien révéler ([ADR 0023](adr/0023-textures-des-cartes.md)).
- Filtres par type et par fascicule avec compteurs, et tri par numéro de découverte, par ordre alphabétique, par type ou par fascicule. Les cartes se réorganisent avec une animation.
- Chaque fascicule affiche sa complétude (« 10 / 11 cartes ») avec une barre de progression. Toucher un fascicule n'affiche que ses cartes.
- Les cartes encore inconnues restent visibles en silhouette, avec une piste de sens, sans révéler la réponse.
- Une carte nouvelle se signale par une pastille Corail dans son bandeau, après son numéro, et par un halo Corail diffus, qui disparaissent à sa première consultation. La carte garde sa structure et son contour.
- **Exception : les légendaires** (diamant). Une légendaire inconnue, et tout mot qui en dépend, n'a ni silhouette ni place dans les compteurs. Une légendaire trouvée a sa carte, mais s'affiche à part (« 1 légendaire trouvée ») et n'entre jamais dans les totaux, pour garder le suspense sur leur nombre ([ADR 0015](adr/0015-codex-fascicules-et-legendaires.md)).
- Toucher une petite carte l'agrandit au centre de l'écran, depuis sa position dans la grille. On peut passer à la carte précédente ou suivante sans revenir à la grille.
- **Recto** : mot, langue, définition actuelle, sens littéral et niveau de confiance.
- **Verso** (en touchant la carte) : les formes trouvées dans chaque langue, avec leur progression (par exemple 2 sur 3). Les formes manquantes restent en silhouette. Il affiche aussi les composants ou les mots formés ; pour une brique, la progression de sa famille (par exemple 4 mots formés sur 5).
- Le verso d'une carte de langue regroupe automatiquement toutes les formes découvertes dans cette langue.
- **Navigation entre les cartes** : tout ce qui correspond à une carte déjà découverte est cliquable.
  - Au recto : chaque brique de la composition, chaque morceau coloré du mot, la langue.
  - Au verso : les composants, les mots formés, la langue de chaque forme, les mentions « dans … ».
  - Exemple de parcours : *géographie* → *géo-* → *géologie*.
  - Un fil d'Ariane permet de revenir à n'importe quelle carte du parcours.
  - Les éléments encore inconnus restent en silhouette et ne sont pas cliquables.

### Fiche de découverte

Une fiche présente progressivement :

1. la forme originale et, si nécessaire, sa translittération ;
2. **une définition courte du mot dans son sens actuel**, affichée juste sous le mot ;
3. la langue et le système d'écriture ;
4. la composition et le **sens littéral** qu'elle produit (par exemple *philo- + -sophie* = « amour de la sagesse »). La composition réutilise les briques jouées, avec leur couleur et leur sens, et le mot découvert est surligné morceau par morceau avec ces mêmes couleurs ;
5. la relation historique et les transformations visibles ;
6. une explication courte ;
7. les sources et le niveau de certitude dans une section secondaire ;
8. les nouvelles pistes ouvertes, sans révéler les solutions.

Le sens littéral ne suffit pas : *philologie* ne signifie pas « ami de l'étude ». La définition actuelle est obligatoire pour toute découverte, et elle doit rester consultable depuis le codex.

Une translittération est une représentation d'une forme, pas une nouvelle racine collectionnable.

## Contenu collectionnable

### Objets linguistiques

- **Langue** : contexte linguistique d'une forme.
- **Lexème** : unité lexicale indépendante d'une graphie ou d'un sens particulier.
- **Sens** : acception utile à une relation ou une recette.
- **Forme** : graphie attestée dans un système d'écriture donné.
- **Morphème** : composant ayant une fonction et un sens contextualisés.
- **Relation étymologique** : emprunt, héritage, dérivation, composition ou autre relation contrôlée.
- **Famille** : regroupement éditorial servant la compréhension et la progression.

### Objets ludiques

- recette ;
- brique manipulable ;
- graine ;
- récompense de pli ;
- indice ;
- quête ou objectif de collection ;
- paramètres de rareté et de disponibilité.

Les objets linguistiques décrivent les faits. Les objets ludiques décrivent la manière de les découvrir. Cette séparation permet de rééquilibrer le jeu sans réécrire l'histoire des mots.

Le schéma relationnel des langues, mots, préfixes et suffixes est décrit dans le [modèle de données](modele-donnees.md) ([ADR 0013](adr/0013-schema-des-briques.md)).

## Progression

### Structure

Le contenu forme un graphe plutôt qu'une suite linéaire :

- plusieurs recettes peuvent produire une même découverte ;
- une découverte peut ouvrir plusieurs familles ;
- certaines graines servent de pont entre deux zones ;
- des jalons ouvrent de nouveaux ensembles sans imposer une langue unique ;
- les plis fournissent tous les exemplaires ; les plis de jalon, au contenu déterministe, garantissent les chemins critiques.

### Garde-fous

- Chaque brique requise possède au moins un chemin d'obtention démontrable.
- Le tutoriel et le chemin critique ne dépendent pas d'un tirage aléatoire.
- Un pli peut donner un doublon ; chaque doublon ajoute un exemplaire (5 au plus) et de l'encre, et une brique nouvelle est garantie au plus tard au 6ᵉ pli.
- **Filet d'utilité** : si la réserve ne permet plus aucune découverte, le 5ᵉ pli consécutif dans cet état donne forcément une brique qui en rend une possible.
- La validation d'atteignabilité simule aussi les quantités : un joueur qui ouvre des plis peut toujours finir par découvrir chaque mot publié.
- Un contenu cyclique n'est publiable que si au moins un point d'entrée externe existe.
- Toute version du catalogue passe une validation d'atteignabilité avant publication.

### Fascicules

Voir l'[ADR 0014](adr/0014-sources-et-fascicules.md), l'[ADR 0022](adr/0022-fascicules-de-20-a-30-mots.md) et la [page des plis](plis.html#fascicules). Le contenu arrive par fascicules, environ tous les 30 jours :

- un fascicule publie 20 à 30 mots, et déclare tous les préfixes, suffixes et mots qui servent à les former ;
- **un fascicule ne dévoile pas son contenu** : son annonce et sa présentation n'affichent que des nombres (mots, préfixes, suffixes, langues), légendaires exclues. Avant sa parution, même ces nombres restent cachés. Dans le codex, les silhouettes gardent leur piste de sens ;
- un mot n'appartient qu'à un seul fascicule ; une brique peut être reprise d'un fascicule à l'autre ;
- chaque fascicule a sa jaquette et son pli : dès sa publication, le joueur peut ouvrir ses plis, qui ne tirent que parmi ses briques, et revenir à tout moment aux plis d'un ancien fascicule. Les fusions entre fascicules sont permises ;
- **fermeture** : si des briques publiées, de n'importe quels fascicules, forment un mot attesté par une source de référence, ce mot est publié. Les mots « croisés » ouverts par un nouvel affixe appartiennent au nouveau fascicule et comptent dans ses 20 à 30 mots ;
- une combinaison attestée ne peut être écartée que par une exclusion déclarée et justifiée (mot archaïque, rare, offensant ou analyse non établie) ;
- **pourquoi 30 mots au plus** : il faut environ 2 plis par mot découvert, et un joueur assidu ouvre 70 à 80 plis par mois. Au-delà de 30 mots, il ne complète plus un fascicule avant le suivant ([ADR 0022](adr/0022-fascicules-de-20-a-30-mots.md)).

Le corpus disponible, le nombre de fascicules possibles et la piste des fascicules spéciaux sont décrits dans le [potentiel d'évolution](potentiel-evolution.md).

### Indices

Les indices peuvent être débloqués par l'expérimentation, le temps, des objectifs ou l'encre (30 gouttes l'indice ; au moins 2 gouttes par pli), mais pas par un paiement dans le MVP :

1. famille ou langue du résultat ;
2. nombre d'ingrédients ;
3. présence d'une transformation ;
4. emplacement d'une brique connue ;
5. solution, en dernier recours, sans punir durablement la progression.

### Objectifs possibles

- compléter une famille ;
- découvrir un certain type de transformation ;
- relier deux langues dans le graphe ;
- résoudre une recette sans indice ;
- retrouver plusieurs descendants d'une même forme ;
- défi quotidien construit uniquement à partir des briques possédées.

## Énergie et plis

### Proposition MVP

- Une charge d'énergie permet d'ouvrir un pli gratuit. L'énergie compte **2 charges au plus** : deux plis peuvent attendre le joueur ([ADR 0020](adr/0020-deux-plis-en-attente-et-sabliers.md)).
- Une charge revient toutes les **douze heures**, durée configurable. Quand les deux charges sont prêtes, le temps s'arrête ; ouvrir un pli relance la recharge. Un joueur qui vient une fois par jour ne perd donc rien.
- Des **sabliers**, à 1 goutte d'encre chacun, avancent la recharge d'une heure (voir plus bas).
- Le serveur calcule la disponibilité afin d'éviter la manipulation de l'horloge locale.
- L'énergie limite uniquement les plis, jamais les fusions avec des briques possédées.
- Les plis sont la seule source d'exemplaires après la réserve de départ.
- Aucun achat, publicité forcée ou monnaie premium dans le MVP.

### Interface dédiée

Les plis ont leur propre écran, distinct de la table de fusion. Le joueur y **choisit d'abord un fascicule** parmi ceux qui sont parus : chacun montre sa jaquette, ses briques connues et ses exemplaires en réserve. Il ouvre ensuite le pli de ce fascicule, et peut revenir au choix à tout moment. Sur l'écran d'ouverture, on retrouve :

- l'énergie (« 1 / 2 ») et le temps de recharge, arrêté à 2 / 2 ;
- les sabliers disponibles, l'échange contre de l'encre et le plafond du jour ;
- les chances du fascicule choisi par rareté et par type, et les chances exactes de chaque brique (les briques inconnues restent en silhouette). Les légendaires inconnues sont regroupées en une seule ligne, avec la somme exacte de leurs chances mais sans leur nombre ;
- la garantie de nouveauté et le filet d'utilité, avec leurs compteurs ;
- la réserve de chaque brique (« ×2 / 5 » ou « épuisée ») ;
- l'encre disponible et l'échange contre un indice (30 gouttes) ;
- l'historique des derniers tirages ;
- les règles du pli.

### Jaquettes

Chaque fascicule a sa jaquette, illustrée sur l'écriture et l'histoire des langues, et tous ses plis la portent ([ADR 0016](adr/0016-plis-et-jaquettes-par-fascicule.md)). Les dix premiers fascicules reçoivent, dans l'ordre :

1. **Rosette** : trois écritures pour un même texte (Égypte, 196 av. J.-C.) ;
2. **Argile** : signes cunéiformes pressés dans une tablette (Mésopotamie) ;
3. **Aleph** : une tête de bœuf devient aleph, puis alpha, puis A (Phénicie) ;
4. **Boustrophédon** : des lignes qui changent de sens à chaque retour (Grèce archaïque) ;
5. **Routes des mots** : le trajet d'Athènes à Rome, puis à Lutèce ;
6. **Arbre des langues** : une racine commune et ses branches (indo-européen) ;
7. **Lapidaire** : capitales romaines gravées, « verba volant, scripta manent » ;
8. **Casse** : le casier du typographe (Mayence, 1455) ;
9. **Lettrine** : l'initiale qui ouvre le texte, en version graphique ;
10. **Palimpseste** : un texte neuf écrit sur un texte gratté.

Règles :

- **rien ne se devine** : la jaquette dit seulement de quel fascicule vient le pli, que le joueur a choisi. Ni le motif ni la couleur ne trahissent la brique, sa rareté ou sa langue. La brique n'est tirée qu'au moment de l'ouverture ;
- **au-delà de dix fascicules**, chaque fascicule demande une jaquette nouvelle ;
- **palette du pli** : neutres et Ambre seulement, car les couleurs de préfixe, de suffixe ou de langue annonceraient le contenu ;
- **style** : interprétations graphiques et plates, jamais de parchemin ou de plume en trompe-l'œil (voir la boussole) ;
- **en recharge** : le pli devient une silhouette en pointillé (ce qui manque encore), jamais une carte grisée qui laisserait croire à un contenu caché.

### Rituel d'ouverture

L'ouverture dure entre 1,5 et 2 secondes. Toucher l'écran ou appuyer sur Échap permet de la passer. Si le système demande de réduire les animations, le résultat s'affiche directement.

1. **Charge** (environ 0,3 s) : le pli se secoue et le sceau brille.
2. **Écriture** (environ 1,2 s) : le sceau s'efface, le pli grossit et vibre, et une fenêtre d'écriture s'ouvre en son cœur. L'écriture a lieu **dans la carte, pendant qu'elle vibre** : une plume essaie d'inventer le mot. Elle écrit en cursive des brouillons qu'elle barre aussitôt : des glyphes inventés, puis la forme grecque, puis une translittération. La brique finale s'écrit ensuite directement dans un cadre de brique. On voit ainsi le chemin de la langue d'origine vers la brique, comme si l'on inventait une langue.
3. **Explosion** (environ 0,3 s) : la fenêtre d'écriture éclate, le pli se fend en deux, un flash éclate et des glyphes sont projetés.
4. **Révélation** : la brique atterrit avec un rebond devant des rayons de lumière, avec son origine (« du grec ancien ἄστρον « astre » »). Deux actions sont proposées : essayer la brique sur la table, ou continuer.

Une brique déjà connue suit le même rituel. La révélation affiche alors « +1 exemplaire · ×3 · +3 gouttes », « De retour ! » si la brique était épuisée, ou « Réserve pleine » et les gouttes d'encre gagnées si elle avait déjà 5 exemplaires. L'intensité du rituel grandit avec la rareté : rayons plus rapides, flash plus long, annonce « Rare ! » ou « Légendaire ! ».

### Contenu d'un pli

Voir l'[ADR 0011](adr/0011-plis-raretes-et-doublons.md), l'[ADR 0012](adr/0012-briques-rationnees.md) et l'[ADR 0016](adr/0016-plis-et-jaquettes-par-fascicule.md). En résumé :

- chaque pli tire une brique parmi les briques de son fascicule, nouvelles ou reprises : **les doublons font partie du jeu** ;
- les chances dépendent de la **rareté** (quatre niveaux : triangle commune, carré peu commune, pentagone rare, diamant légendaire) et du **type** (les suffixes sortent un peu plus souvent) ;
- un doublon ajoute **un exemplaire** à la réserve, jusqu'à 5 par brique, et rapporte d'autant plus de **gouttes d'encre** que la brique est rare ;
- chaque pli rapporte **2 gouttes**, plus, pour un doublon, 1, 2, 4 ou 10 gouttes selon la rareté, le double quand la réserve est pleine ([ADR 0019](adr/0019-encre-a-chaque-doublon.md), [ADR 0020](adr/0020-deux-plis-en-attente-et-sabliers.md)) ; l'encre s'échange contre des sabliers (1 goutte) ou des indices (30 gouttes) ;
- une brique nouvelle est **garantie au plus tard au 6ᵉ pli** du même fascicule après sa dernière nouveauté ;
- si la réserve ne permet plus aucune découverte, une brique utile de ce fascicule est **garantie au plus tard au 5ᵉ pli** du même fascicule. Si aucune de ses briques ne peut aider, l'écran invite à choisir un autre fascicule ;
- objectif de rythme : le codex ne doit pas se remplir trop vite. Sur le catalogue de démonstration (9 mots, réserve de départ 4 × 2), il faut 22 plis en médiane pour tout découvrir, soit environ onze jours, et jamais plus de 30 plis dans la simulation (ADR 0012). Avec deux fascicules et les sabliers, la simulation de l'ADR 0020 donne 20 plis et 7,5 jours en médiane. Ce rythme, calculé sur un catalogue unique, est à recalculer par fascicule.

Les poids, les raretés et la garantie relèvent de l'équilibrage. Ils doivent être observables et modifiables sans changer les données linguistiques.

### Sabliers

Dans le MVP ([ADR 0020](adr/0020-deux-plis-en-attente-et-sabliers.md)) :

- un **sablier** fait avancer d'une heure la recharge en cours. Il ne s'utilise que si l'énergie est sous 2 ; le temps en trop passe à la charge suivante, et il n'est perdu que si l'énergie atteint 2, ce que l'interface annonce avant de confirmer ;
- il coûte **1 goutte d'encre** : une goutte, une heure. Certains jalons en donnent aussi ;
- il achète du temps, jamais un tirage : chances, garantie, filet et contenu du pli ne changent pas ;
- au plus **12 sabliers par 24 h**, soit au plus un pli de plus par jour ; au plus 36 sabliers détenus ;
- **pli offert garanti** : un joueur qui vient chaque jour ouvre 6 plis en 3 jours et gagne au moins 12 gouttes, soit 12 sabliers, soit un pli de plus tous les 3 jours. Sur la démo, changer toute son encre en sabliers fait passer le temps pour tout découvrir de 10 à 7,5 jours en médiane.

Après le MVP, proposition de l'[ADR 0018](adr/0018-sabliers-et-boutique.md) :

- les plafonds ci-dessus comptent aussi les sabliers achetés ;
- la boutique vend des lots en euros, sans monnaie intermédiaire, avec le prix par sablier affiché, sans offre limitée ni relance ; lot sans sablier utilisé remboursable pendant 14 jours ;
- revue juridique et boutique désactivable par territoire, contrôle parental, achats validés par le serveur.

### Principes éthiques

- afficher clairement le temps restant ;
- ne pas utiliser de fausse urgence ;
- ne jamais bloquer une session de fusion faute d'énergie ;
- ne jamais faire payer une erreur : seuls les succès consomment des exemplaires ;
- borner l'attente quand la réserve ne permet plus aucune découverte (filet au 5ᵉ pli) ;
- ne pas préparer des mécanismes trompeurs sous prétexte d'une monétisation future ;
- ne jamais vendre un tirage, une brique ou une chance : une future boutique ne vend que du temps, plafonné (ADR 0018) ;
- soumettre toute future boutique à une décision séparée.

## Interfaces

L'inventaire des interfaces de la PWA (coque, première session, table de fusion, codex, plis, réglages et erreurs), avec leur forme sur mobile et sur ordinateur, est tenu dans la [page des interfaces](interfaces.html). Les objectifs et jalons y forment un onglet du codex. Chaque interface est dessinée sur mobile et sur ordinateur dans les [maquettes](maquettes.html).

## Identité visuelle

La charte complète, avec ses démonstrations interactives, est sur la page [identité visuelle](identite.html). Son principe : **une couleur, un seul sens**.

Le logo est le **sceau ÉL** : une tuile Corail inclinée de −6°, cernée d'Encre, avec une ombre dure et les initiales en serif gras ([charte du logo](identite.html#logo), [ADR 0021](adr/0021-logo-sceau-el.md), [pistes comparées](logo.html)).

Le [design système](design-system.html) la prolonge en système complet : principes d'expérience, jetons (couleurs, typographie, espacements, rayons, élévation, mouvement, grille, icônes), composants d'interface et de jeu, motifs d'expérience (navigation, retours, gestes, son, clavier, première utilisation, superpositions), écrans types, microcopie, accessibilité et export des jetons en CSS et en JSON.

| Rôle | Couleur | Utilisation exclusive |
|---|---|---|
| Préfixe | Étincelle `#CDF25A` | Briques et cartes de préfixe, surlignage de la partie préfixe d'un mot |
| Suffixe | Glose `#4FD1C5` | Briques et cartes de suffixe, surlignage de la partie suffixe d'un mot |
| Langue | Palimpseste `#8F7BF0` | **Toutes** les langues, sans distinction de couleur entre elles |
| Mot | Encre `#0F1F19` sur Crème `#FFFBF3` | Cartes de mots : neutres, pour laisser parler les briques |
| Famille | Rosée `#F59AC1` | Cartes et progression de famille |
| Pli et énergie | Ambre `#F4B740` | Plis, sceau, énergie, recharge, rituel d'ouverture, formes de rareté (triangle, carré, pentagone, diamant ; remplies d'Ambre, cernées d'Encre, ou de la teinte profonde du bandeau d'une carte, sans contour, jamais posées sur une brique), gouttes d'encre |
| Action et marque | Corail `#FF6B4A` (survol `#FF8667`, pression `#E24E2D`) | Bouton principal, focus, nouveauté, marque |
| Danger | Corail profond `#C23D1F` (texte Crème, 5,1:1) | Bouton qui confirme une action irréversible (effacer, réinitialiser), avec l'icône octogone et toujours après une confirmation. Variante discrète en contour. Jamais pour un échec de jeu, qui reste en Gris encre. |

Règles complémentaires :

- **Règles élémentaires de couleur** :
  1. Une couleur vive ne se pose jamais sur une autre couleur vive. Briques, pastilles et textes colorés vont toujours sur Crème, Papier, Encre ou Nuit.
  2. Sur une couleur vive, le texte est toujours en Encre, jamais en blanc ou en crème.
  3. Un texte coloré sur fond clair utilise le ton Profond (par exemple Corail profond `#C23D1F`), jamais la couleur vive.
  4. Deux couleurs ne se touchent jamais : un filet neutre de 3 px sépare par exemple les morceaux surlignés d'un mot.
  5. Les grandes surfaces restent neutres. Seul le Corail peut couvrir une bande de marque.
  6. La couleur n'est jamais le seul signal : elle s'accompagne toujours d'un texte, d'une forme ou d'une icône.
  7. Pas de dégradé entre couleurs de ressource, pas d'opacité pour inventer une teinte (sauf l'état désactivé).
  8. Les ombres ne sont jamais colorées. Seule exception : l'ombre Corail de la carte vitrine de l'accueil.
  9. Contraste minimum : 4,5:1 pour le texte ; 3:1 pour les grands titres, les icônes et les bordures utiles. Gris encre `#5C6B62` : 4,9:1 sur Papier.
  10. Au plus trois couleurs de ressource par composant, le Corail d'action n'entrant pas dans ce compte. Une seule surface colorée par composant, son bandeau.

- **États** : ils n'ont pas de teinte propre. Ils se lisent par un cercle :
  - Corail plein : découverte ;
  - contour Encre : presque ;
  - Gris encre : échec, jamais rouge ;
  - Encre plein : déjà connu.
- **Rareté** : quatre niveaux, une forme chacun. Pour les trois premiers, plus la forme a de côtés, plus la brique est rare ; le diamant des légendaires est à part :
  - triangle : commune ;
  - carré : peu commune ;
  - pentagone : rare ;
  - diamant (losange étiré, nettement plus haut que large, bien distinct du cercle des états) : légendaire.

  Sur fond neutre, la forme est remplie d'Ambre et cernée d'Encre 1,5 px ; dans le bandeau d'une carte, elle prend la teinte profonde du bandeau, sans contour. Elle est toujours accompagnée de son libellé ou d'un nom accessible, et n'est jamais posée sur une brique. Tailles : 12 px en liste, 16 px dans les chances, 22 px à la révélation.
- **Confiance éditoriale** : trois traits Encre, jamais de couleur ni de forme géométrique, pour ne pas ressembler à une rareté.
- **Formes** :
  - brique : rayon 10, ombre dure 4, élément manipulable ;
  - petite brique : rayon 6, pour une mention dans un texte ;
  - carte : format 3:4 avec un bandeau de la couleur de son type ; une fois découverte, une silhouette de son sens en fond ;
  - pastille : rayon 999, métadonnée ;
  - pointillé : ce qui manque ou reste inconnu, y compris une brique épuisée.
- **Interactions** :
  - survol : l'élément se soulève de 2 px et son ombre passe à 6 px ;
  - pression : il s'enfonce de 2 px et son ombre passe à 1 px ;
  - focus : anneau Corail de 2 px ;
  - désactivé : opacité 40 % ;
  - sélectionné : fond Encre.
- **Tailles** : cible tactile d'au moins 44 px, boutons de 48 px de haut, briques d'au moins 96 × 52 px.
- **Textures de carte** ([charte](identite.html#textures), [ADR 0023](adr/0023-textures-des-cartes.md)) : une silhouette pleine par carte découverte, d'une seule teinte (Encre à 10 % en grille, 8,5 % en carte agrandie, Papier en nocturne), détails évidés dans la couleur du fond, recadrée par le bord, jamais sous le bandeau ni au verso. Le texte se pose directement dessus ; le texte secondaire passe en Encre secondaire, le sens littéral en pastille Crème cernée de Gris encre. Pour une langue, un objet de sa culture, jamais un drapeau. La grammaire de dessin (traits pleins de 9 à 24 unités sur une grille de 300 × 400, évidements de 4 à 7, arrondis de 6 à 14, débord à droite ou en bas) est détaillée dans la [charte](identite.html#textures-grammaire).

## Exactitude et ton pédagogique

### Niveaux de confiance

Chaque relation publiée porte un état éditorial :

- **établie** : consensus suffisamment solide pour une présentation affirmative ;
- **probable** : hypothèse dominante, formulée avec prudence ;
- **discutée** : plusieurs analyses, présentées comme telles ;
- **non retenue** : donnée de travail jamais publiée comme solution.

Le niveau de confiance ne doit pas être transformé en rareté ludique.

### Principes

- Distinguer composition synchronique, dérivation historique, héritage et emprunt.
- Montrer les formes intermédiaires utiles plutôt que prétendre à un saut direct.
- Sourcer les faits éditoriaux auprès de sources de référence (TLFi, Académie française, Gaffiot, Bailly, Chantraine…). Le Wiktionnaire aide à repérer des pistes, mais aucun de ses textes n'est repris et il ne suffit jamais à publier un fait ([ADR 0014](adr/0014-sources-et-fascicules.md)).
- Publier le code sous AGPL 3.0 et le contenu, catalogue compris, sous CC BY-SA 4.0 ; le nom « ÉtymoLogique » et le logo restent réservés ([ADR 0017](adr/0017-licences.md)).
- Expliquer les simplifications nécessaires au gameplay.
- Ne pas valider une fusion sur la seule ressemblance de deux chaînes de caractères.
- Permettre la correction et la migration d'un contenu déjà publié.

## Architecture technique

Voir l'[ADR 0024](adr/0024-architecture-logicielle-et-hebergement.md). En résumé :

- la PWA React est servie comme des fichiers statiques, chez Scaleway, en France ;
- le catalogue est un artefact statique publié à chaque fascicule. Le client n'en reçoit ni recette ni brique : le serveur lui envoie seulement ce que le joueur a débloqué (réserve, fiches découvertes, silhouettes, chances), sans jamais trahir une légendaire ;
- une seule API serverless, écrite en Rust, résout chaque fusion et chaque pli. Hors connexion, la table se prépare, mais le résultat attend le réseau ;
- la progression vit dans des tables relationnelles PostgreSQL, qui garantissent les plafonds et soldes, et chaque commande est une transaction.

## Périmètre du MVP

### Inclus

- PWA responsive installable ;
- première session guidée ;
- codex filtrable ;
- table de fusion tactile et souris ;
- recettes ordonnées et transformations expliquées ;
- succès, échec, tentative déjà connue et indice simple ;
- progression persistante ;
- graphe de contenu éditorial versionné ;
- validation automatique de l'atteignabilité ;
- énergie et plis gratuits ;
- architecture de contenu multilingue ;
- instrumentation minimale et respectueuse de la vie privée.

### Reporté

- paiements (boutique de sabliers proposée par l'[ADR 0018](adr/0018-sabliers-et-boutique.md)), publicités et monnaie premium ;
- soumission de mots par les joueurs ;
- contenu généré ou validé automatiquement par IA ;
- multijoueur, échanges et classements ;
- chat, profils publics et fonctions sociales ;
- graphe exhaustif de toutes les langues ;
- création communautaire de recettes ;
- réalité augmentée ou interactions physiques avancées.

## Mesurer si le concept fonctionne

Le prototype doit répondre aux questions suivantes :

- Le joueur comprend-il ce qu'une brique représente ?
- Peut-il formuler une hypothèse sans connaître déjà la réponse ?
- Une transformation expliquée paraît-elle satisfaisante plutôt qu'arbitraire ?
- Le codex donne-t-il envie d'explorer une autre branche ?
- Après un échec, sait-il quoi essayer sans recevoir immédiatement la solution ?
- Les plis relancent-ils l'intérêt sans devenir le cœur du jeu ?

### Indicateurs minimaux

- tutoriel terminé ;
- première fusion autonome réussie ;
- nombre de tentatives avant une découverte ;
- utilisation graduelle des indices ;
- retour après disponibilité d'un pli ;
- durée passée avec une réserve qui ne permet aucune découverte ;
- familles commencées et complétées.

Ces événements doivent être agrégés avec des identifiants techniques pseudonymes à durée limitée. Les journaux ne doivent contenir ni contenu libre saisi par le joueur, ni donnée personnelle.

## Risques et réponses

| Risque | Réponse envisagée |
|---|---|
| Les recettes semblent arbitraires | Explication systématique, indices cohérents et tests utilisateurs. |
| Le contenu contient des erreurs | Sources, relecture, niveau de confiance, versions et corrections traçables. |
| Une branche devient impossible | Validation d'atteignabilité à chaque publication. |
| Le joueur essaie au hasard | Objectifs de famille, silhouettes, indices graduels et coût nul des essais. |
| Le pli devient frustrant | Doublons utiles (un exemplaire de plus et de l'encre à chaque fois), garantie de nouveauté au 6ᵉ pli, chances affichées, chemin critique jamais dépendant d'un pli. |
| La réserve s'épuise et le joueur décroche | Réserve de départ suffisante pour trois découvertes, essais ratés gratuits, filet d'utilité au 5ᵉ pli, compteurs visibles. |
| L'interface est trop dense sur mobile | Limite de briques sur la table, gestes alternatifs et révélation progressive. |
| L'ambition multilingue explose le coût éditorial | Architecture générique, mais lots de contenu petits et cohérents. |
| Le jeu est perçu comme un cours | Révélations courtes ; détails et sources à la demande. |

## Expérimentations UX prioritaires

### Cartes ou briques

Tester deux représentations sans modifier le modèle :

- **cartes** : plus de place pour langue, sens et variante ; meilleures pour le codex ;
- **briques** : composition plus tangible ; meilleures pour la table ;
- **hybride recommandé à tester** : cartes dans le codex qui se condensent en briques sur la table.

### Geste de fusion

Comparer :

- superposition directe, expressive mais ambiguë pour l'ordre ;
- rail ordonné suivi d'un bouton, plus clair et accessible ;
- hybride : glisser pour ordonner, puis superposer ou appuyer pour confirmer.

### Révélation

Comparer une révélation instantanée à une révélation en trois temps :

1. mot ;
2. transformation ;
3. nouvelles branches.

## Questions encore ouvertes

- Quelles langues et familles donnent le meilleur premier lot de contenu ?
- Quel nom original donner au codex ?
- Le plafond de 5 exemplaires, la réserve de départ et le filet au 5ᵉ pli sont-ils ressentis comme justes ? Faut-il plusieurs briques par pli sur un grand catalogue ?
- Combien de briques une recette peut-elle utiliser sans devenir illisible ?
- Quand un indice « presque » aide-t-il sans transformer le jeu en recherche exhaustive ?
- Une découverte doit-elle débloquer toutes ses briques immédiatement ou certaines via des mini-objectifs ?
- Quel volume de contenu permet de tester la rétention sans surinvestir dans l'éditorial ? Hypothèse : des fascicules de 20 à 30 mots tous les 30 jours ([ADR 0022](adr/0022-fascicules-de-20-a-30-mots.md)).
- Le compte utilisateur est-il obligatoire, facultatif ou différé jusqu'à la synchronisation multi-appareil ?
