# Mémento Technique - Projet Site Web Dynamique

**Module:** EST - FOR - 004 - Technologie du WEB
**Auteur:** Shanga
**Date:** 21.05.2024

---

## 1. Introduction

Ce document constitue le mémento technique détaillé du projet de site web dynamique, réalisé dans le cadre du module "Technologie du WEB". L'objectif central était de faire évoluer un site portfolio statique en une application web complète et dynamique, en s'appuyant sur des technologies côté serveur pour la gestion de contenu, la persistance des données et les interactions avec les utilisateurs.

Le projet final est une boutique en ligne fonctionnelle pour des montages vidéo et des presets, dotée d'une interface d'administration sécurisée permettant une gestion complète des produits (Ajout, Modification, Suppression). Ce document a pour but d'expliciter les choix technologiques, de détailler l'architecture mise en place et de fournir un guide pour le déploiement et la maintenance de l'application.

### 1.1. Objectifs Pédagogiques et Techniques
Le cahier des charges du module imposait de remplir les objectifs suivants :
-   **Choix d'une stack technologique :** Sélectionner un serveur web (Node.js), un langage de programmation (JavaScript) et un framework (Express.js).
-   **Intégration d'une base de données :** Mettre en place et gérer une base de données (SQLite) pour stocker les informations des produits et les messages des utilisateurs.
-   **Développement d'une application fonctionnelle :** Créer une application web dynamique servant d'exemple concret, incluant une API RESTful et une interface de gestion.
-   **Rédaction d'un mémento technique :** Produire une documentation exhaustive (ce document) qui détaille tous les aspects techniques du projet.

### 1.2. Justification des Technologies Choisies

-   **Node.js & Express.js :**
    -   **Performance :** L'architecture non bloquante de Node.js est idéale pour des applications I/O intensives comme un serveur web qui doit gérer de nombreuses requêtes simultanées.
    -   **Écosystème :** L'écosystème npm offre une vaste bibliothèque de modules qui simplifient le développement. Express.js, en particulier, est un framework minimaliste mais puissant qui accélère la création de serveurs web et d'API.
    -   **Cohérence du langage :** Utiliser JavaScript à la fois pour le frontend et le backend permet une meilleure synergie et simplifie le processus de développement.

-   **SQLite (en mémoire) :**
    -   **Simplicité :** Contrairement à des SGBD plus complexes comme MySQL ou PostgreSQL qui nécessitent un serveur dédié, SQLite est basé sur un fichier (ou, dans notre cas, en mémoire), ce qui le rend extrêmement simple à configurer et à utiliser pour le développement. Il n'y a aucune installation ou configuration de service requise.
    -   **Légèreté :** C'est une solution très légère, parfaite pour des projets de petite envergure ou pour des phases de prototypage rapide.
    -   **Mode "en mémoire" :** Pour ce projet, le mode `:memory:` a été choisi pour garantir que l'application se réinitialise à un état propre à chaque démarrage. C'est un avantage majeur pour les tests et la démonstration, car cela assure une expérience utilisateur prévisible sans avoir à gérer des données persistantes entre les sessions.

---

## 2. Architecture et Structure du Projet

L'application repose sur une architecture client-serveur standard, avec une séparation claire entre la logique de présentation (frontend) et la logique métier (backend).

### 2.1. Structure Détaillée des Fichiers
```
/
|-- css/                  # Styles (Bootstrap, template custom)
|-- fonts/                # Polices web
|-- img/                  # Images statiques et produits
|-- js/                   # Scripts JS client (plugins, main.js)
|-- node_modules/         # Dépendances (géré par npm)
|-- video/                # Vidéos des produits (dossier standardisé)
|
|-- .gitignore            # Fichier pour ignorer les fichiers non versionnés
|-- admin.html            # Panneau d'administration (interface CRUD)
|-- index.html            # Page principale (vitrine des produits)
|-- about.html            # Page statique "À propos"
|-- server.js             # Cœur du backend (Express, API, DB)
|-- package.json          # Fichier de configuration du projet npm
|-- package-lock.json     # Versions exactes des dépendances
|-- MEMENTO_TECHNIQUE.md  # Ce document
...
```

### 2.2. Architecture Backend (server.js)

Le fichier `server.js` est le point d'entrée et le contrôleur central de toute l'application.

1.  **Serveur Express :** Il initialise le serveur, configure les middlewares (comme `express.json()` pour parser le JSON) et met l'application en écoute sur le port 3000.
2.  **Base de Données SQLite :** Il établit la connexion à la base de données en mémoire.
3.  **Initialisation et Seeding :** Au lancement, il exécute un script `db.serialize()` qui :
    -   Crée les tables `products` et `messages` avec les schémas appropriés.
    -   Vérifie si la table `products` est vide. Si c'est le cas, il la peuple avec 9 produits par défaut. Ce processus de "seeding" automatique garantit que l'application est toujours fonctionnelle et présentable dès le démarrage.
4.  **API RESTful :** Une API complète est définie pour permettre au frontend de manipuler les données.

#### Points de Terminaison de l'API (détaillés)

-   `GET /api/products`: Récupère tous les produits.
-   `POST /api/contact`: Enregistre un message de contact dans la DB.
-   `POST /api/products`: Ajoute un produit (protégé).
-   `PUT /api/products/:id`: Met à jour un produit (protégé).
-   `DELETE /api/products/:id`: Supprime un produit (protégé).

#### Mécanisme de Sécurité
La sécurité des routes d'administration est assurée par le middleware `checkAdmin`. À chaque requête sur une route protégée, ce middleware intercepte la requête et vérifie la présence de l'en-tête `Authorization`. Si la valeur est `admin`, il passe le contrôle à la fonction suivante (`next()`). Sinon, il renvoie une erreur `401 Unauthorized`, bloquant ainsi l'accès.

### 2.3. Architecture Frontend

Le frontend utilise du JavaScript "vanilla" (pur) et jQuery pour interagir avec le backend via l'API.

1.  **`index.html` :** La page charge dynamiquement les produits via un appel `fetch('/api/products')`. Le JSON reçu est ensuite utilisé pour construire le HTML des cartes de produits et des modales correspondantes, qui sont injectés dans le DOM.
2.  **`admin.html` :** Cette page est une "Single Page Application" (SPA) miniature. Après une simple authentification par mot de passe (gérée côté client), l'interface de gestion est affichée. L'intégralité des opérations (afficher, ajouter, modifier, supprimer) se fait via des appels `fetch` à l'API, sans jamais recharger la page. Le formulaire de la page change de comportement (passant de `POST` à `PUT`) en fonction du contexte (création ou modification).

---

## 3. Déploiement et Guide d'Utilisation

### 3.1. Prérequis
-   **Node.js :** Version 14.x ou supérieure.
-   **npm :** Généralement inclus avec Node.js.

### 3.2. Procédure d'Installation Détaillée

1.  **Clonage du Dépôt :**
    ```bash
    git clone <URL_DU_DEPOT>
    cd <NOM_DU_DEPOT>
    ```

2.  **Installation des Dépendances (`npm install`) :**
    Cette commande lit le fichier `package.json` et télécharge les dépendances requises dans le dossier `node_modules`.
    -   **`express` :** Le framework web pour construire le serveur et l'API.
    -   **`sqlite3` :** Le pilote Node.js pour interagir avec la base de données SQLite.
    La commande génère également le fichier `package-lock.json`, qui garantit que les mêmes versions des dépendances sont utilisées lors de futures installations, assurant ainsi la reproductibilité de l'environnement.

### 3.3. Démarrage de l'Application
```bash
node server.js
```
Une fois lancée, la console affichera :
-   `Server started on http://localhost:3000`
-   `Connected to the in-memory SQLite database.`
-   Des logs indiquant si la base de données a été pré-remplie.

### 3.4. Utilisation
-   **Site public :** Ouvrir `http://localhost:3000` dans un navigateur.
-   **Panneau Admin :** Naviguer vers `http://localhost:3000/admin.html`. Entrer le mot de passe `admin` pour accéder à l'interface de gestion.

---

## 4. Analyse du Code et Décisions d'Implémentation

### 4.1. `server.js` : Automatisation et Robustesse

#### Pré-remplissage de la Base de Données
```javascript
db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
  if (row.count === 0) {
    const stmt = db.prepare(...);
    productNames.forEach(name => stmt.run(...));
    stmt.finalize();
  }
});
```
L'utilisation d'une requête `COUNT(*)` avant l'insertion est une pratique robuste. Elle évite la duplication de données si le serveur est redémarré dans un contexte où la base de données serait persistante. L'utilisation de `db.prepare()` est une optimisation qui pré-compile la requête SQL, la rendant plus performante lors d'exécutions multiples (ici, dans une boucle).

### 4.2. `admin.html` : Interface Réactive sans Framework

La logique de `admin.html` démontre comment créer une interface dynamique sans dépendre d'un framework lourd comme React ou Vue.

#### Gestion d'État du Formulaire
```javascript
const isEditing = !!document.getElementById('product-id').value;
const url = isEditing ? `/api/products/${id}` : '/api/products';
const method = isEditing ? 'PUT' : 'POST';
```
Cette approche simple permet de réutiliser le même formulaire pour deux opérations distinctes. L'état est simplement stocké dans un champ `<input type="hidden">`. C'est une technique légère et efficace pour des applications de cette taille.

---

## 5. Appréciation et Auto-évaluation

### 5.1. Respect de l'Implémentation Professionnelle
Le projet adhère à plusieurs pratiques professionnelles :
-   **Séparation des préoccupations :** Le code backend (`server.js`) est clairement séparé de la présentation (`.html`).
-   **API RESTful :** L'utilisation de méthodes HTTP sémantiques (`GET`, `POST`, `PUT`, `DELETE`) suit les conventions REST.
-   **Gestion des dépendances :** L'utilisation de `package.json` permet une gestion propre et reproductible des dépendances.
-   **Code Asynchrone :** L'utilisation de `fetch` avec `async/await` dans le frontend modernise la gestion des requêtes asynchrones.

### 5.2. Auto-évaluation et Pistes d'Amélioration
Ce projet a été une excellente opportunité d'apprentissage. Il a permis de solidifier ma compréhension des architectures client-serveur, de la création d'API et de la manipulation dynamique du DOM.

**Points forts :**
-   La fonctionnalité CRUD complète et fonctionnelle.
-   L'automatisation du remplissage de la base de données.
-   La création d'une interface d'administration réactive.
-   **Architecture Responsive** : Grille adaptative (3, 2 ou 1 colonne) et modaux optimisés pour mobile.

**Axes d'amélioration possibles :**
1.  **Sécurité :** L'authentification actuelle est basique. Une amélioration majeure serait d'implémenter un système basé sur des jetons (JWT) ou des sessions avec des mots de passe hachés.
2.  **Validation des données :** Ajouter une validation plus stricte des données, à la fois côté client et côté serveur (par exemple, avec une bibliothèque comme `Joi` ou `express-validator`).
3.  **Gestion des erreurs :** Mettre en place un middleware de gestion des erreurs plus centralisé dans Express pour éviter la répétition de code.
4.  **Base de données persistante :** Remplacer la base de données en mémoire par une base de données sur fichier ou un serveur de base de données (comme PostgreSQL) pour une persistance réelle des données.
