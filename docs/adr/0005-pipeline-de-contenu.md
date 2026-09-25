# ADR 0005 — Pipeline de contenu validé avant publication

- **Statut** : Accepté

## Contexte

Le contenu relie exactitude linguistique, règles de fusion et progression. Une erreur de saisie peut créer une fausse explication ou bloquer une branche. Modifier directement les données de production ne permet ni revue ni reproduction.

## Décision

Le contenu suit un pipeline distinct du déploiement applicatif :

1. **édition** dans un format structuré soumis à un schéma ;
2. **validation locale** des types, références, identifiants et vocabulaires contrôlés ;
3. **revue linguistique** des sources, relations, formulations et niveaux de confiance ;
4. **validation ludique** des recettes, préconditions, récompenses et indices ;
5. **analyse globale** de l'atteignabilité, des cycles et des pools de plis ;
6. **compilation** en artefact immuable optimisé pour le client et le serveur ;
7. **publication** avec un identifiant de version et un rapport de validation ;
8. **migration** explicite des progressions si les identifiants ou déblocages changent.

Les identifiants sont opaques et stables. Ils ne contiennent pas de graphie susceptible d'être corrigée.

La publication est refusée en cas :

- de référence cassée ;
- de source obligatoire absente ;
- de relation non relue ;
- de recette ambiguë dans le même état de progression ;
- d'objet visible inatteignable ;
- de translittération sans convention déclarée ;
- de récompense de pli invalide.

Les avertissements peuvent couvrir les niveaux de confiance discutés, les familles incomplètes et les déséquilibres non bloquants.

Le catalogue publié ne contient que les données nécessaires à l'expérience. Les notes internes, brouillons et informations sensibles restent hors de l'artefact client.

## Options envisagées

### Modification directe en base de production

Écartée : peu révisable, non reproductible et risquée.

### Contenu embarqué dans le code

Écarté : mélange les cycles de publication, complique la revue éditoriale et empêche les outils spécialisés.

### CMS générique comme unique validation

Écarté : utile comme interface future, mais insuffisant pour valider un hypergraphe de progression.

## Conséquences

### Positives

- qualité contrôlée avant exposition ;
- catalogue reproductible côté client et serveur ;
- retour arrière vers une version connue ;
- possibilité d'ajouter ensuite une interface éditoriale sans changer les règles.

### Négatives

- investissement initial dans schémas, compilateur et validations ;
- publication moins immédiate ;
- migrations nécessaires pour certaines corrections.

## Critères de réévaluation

Le format d'édition et l'interface pourront changer. Les étapes de validation et la production d'un artefact versionné restent obligatoires.

