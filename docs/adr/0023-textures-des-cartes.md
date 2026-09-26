# ADR 0023 — Une silhouette monochrome en fond de chaque carte

- **Statut** : Accepté
- **Portée** : cartes du codex (grille et carte agrandie), charte visuelle
- **Complète** : [ADR 0015](0015-codex-fascicules-et-legendaires.md) (silhouettes des cartes inconnues)

## Contexte

Les cartes du codex étaient plates : un bandeau de couleur, un mot, des métadonnées. La boussole veut pourtant « des mots mis en scène comme des objets précieux » ([boussole](../boussole.html)), et le pilier Collection demande qu'une carte donne envie d'être trouvée.

Dix langages graphiques ont été comparés sur la même carte, « biologie », dans la [page de travail des textures](../cartes-visuels.html) : filigrane, aplat découpé, gravure, trame, macro, contours, constellation, pochoir, demi-teinte et spécimen annoté. Deux traitements du texte posé sur la texture ont ensuite été essayés, puis écartés : un fond opaque et un voile flou.

## Décision

### Une silhouette par carte découverte

- Chaque carte **découverte** porte en fond une silhouette simple de ce que dit son sens : une double hélice pour *biologie*, une pousse pour *bio-*, un livre ouvert pour *-logie*, un buste de penseur pour *philosophie*, une chouette pour *-sophie*, un globe et ses continents pour *géographie*.
- Une carte de **langue** montre un objet de sa culture : rosace pour le français, aqueduc pour le latin, amphore pour le grec ancien. Jamais de drapeau, ni de parchemin ou de plume.
- Une carte **inconnue** garde ses hachures, son « ? » et sa piste, sans aucune texture : l'image trahirait le sens. Les légendaires inconnues restent absentes du codex ([ADR 0015](0015-codex-fascicules-et-legendaires.md)).
- La silhouette figure au **recto**, en grille et en carte agrandie. Le verso, dense en listes, reste sans texture.
- Elle suit la carte partout où celle-ci apparaît : codex, maquettes, exemples de la charte et du design système. Une fiche de découverte (table de fusion, accueil) n'est pas une carte et reste sans texture.

### Style : l'aplat découpé (piste 02)

- **Une seule teinte** : Encre à 10 % d'opacité en grille, 8,5 % en carte agrandie. En mode nocturne, la même opacité de Papier sur fond sombre. Aucune couleur de ressource, aucun second ton, aucun dégradé.
- **Aplat plein, un peu gras** : formes pleines et traits épais. Les détails (nervures, lignes d'un livre, frise d'une amphore) sont **évidés dans la couleur du fond** de la carte, jamais dessinés dans un autre ton.
- **Cadrage** : la silhouette est grande, décentrée vers le bas ou la droite, et recadrée par le bord de la carte. Elle ne passe jamais sous le bandeau.
- **Grammaire de dessin** : épaisseurs, évidements, arrondis, cadrage, inclinaison et choix du sujet sont fixés dans la [charte des textures](../identite.html#textures-grammaire). Toute nouvelle silhouette les respecte.
- **Décorative** : elle est masquée aux technologies d'assistance et ne porte aucune information de jeu (ni type, ni rareté, ni fascicule).

### Le texte reste posé sur la texture

- Le texte se pose directement sur la texture, sans fond ni flou. Le texte principal (Encre) et le texte secondaire (Encre secondaire `#44564D`, 5,5:1 au pire en grille) gardent au moins 4,5:1.
- Le Gris encre (4:1) et le Corail profond (4,3:1) tombent sous le seuil sur la texture : sur une carte texturée, la note, les étiquettes et les liens passent en Encre secondaire, et un lien reste souligné.
- Seule exception : le **sens littéral** en pastille passe en Crème, cerné d'un filet Gris encre de 1 px, pour ne pas se confondre avec la silhouette.

## Options envisagées

### Neuf autres langages graphiques

Filigrane, gravure, trame, macro, contours, constellation, pochoir, demi-teinte et spécimen annoté ont été écartés. Ils sont trop fins pour la grille, trop abstraits, trop proches du cliché académique ou trop chargés sous les métadonnées. Ils restent sur la [page de travail](../cartes-visuels.html).

### Fond opaque sous chaque texte

Écarté : chaque texte découpait la silhouette en rectangles, ce qui cassait l'image.

### Voile flou sous chaque texte

Écarté : un flou aux bords fondus adoucit la découpe, mais brouille la silhouette. Il ajoute aussi une ombre molle, que la charte évite.

### Couleur du type dans la texture

Écartée : une couleur n'a qu'un seul sens. Une texture Étincelle ou Glose ferait de la décoration avec une couleur de ressource, et deux surfaces colorées sur la même carte.

## Conséquences

### Positives

- Chaque carte devient un objet reconnaissable, qu'on a envie de collectionner.
- La texture renforce le sens du mot sans rien dire de la mécanique : la couleur garde son rôle.
- Le rendu est vectoriel et monochrome : il s'adapte à toutes les tailles et au mode nocturne sans second jeu de fichiers.

### Négatives

- Chaque carte publiée demande une silhouette : c'est un coût éditorial et graphique, au rythme des fascicules.
- Certains sens abstraits (*étymo-* « vrai », *philo-* « qui aime ») demandent des objets symboliques, plus ouverts à l'interprétation.
- Sous une texture dense, le texte perd un peu de contraste : il faut vérifier chaque nouvelle silhouette en grille et en carte agrandie.

## Critères de réévaluation

- Un test montre que la texture gêne la lecture du mot ou des métadonnées, en grille ou sur petit écran.
- Le coût de production d'une silhouette par carte ralentit la publication des fascicules.
- Des joueurs lisent la texture comme un indice de jeu (rareté, famille, fascicule).
