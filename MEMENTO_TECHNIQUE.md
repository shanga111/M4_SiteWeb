# MEMENTO TECHNIQUE - Module M7

Ce document sert de documentation officielle pour le projet de transformation d'un site statique en site dynamique dans le cadre du module M7.

## 1. Explication technique

Le projet initial était un site web statique composé de fichiers HTML, CSS et JavaScript. Pour le rendre dynamique, une refonte complète de l'architecture a été réalisée en utilisant **Node.js** comme environnement d'exécution côté serveur et le framework **Express.js**.

Cette nouvelle architecture permet :
- De servir les fichiers statiques (HTML, CSS, images) de manière contrôlée.
- De créer une API RESTful pour gérer les données (produits, messages) de manière asynchrone.
- De communiquer avec une base de données pour stocker et récupérer des informations persistantes.
- De séparer clairement la logique métier (backend) de la présentation (frontend).

Le frontend communique avec le backend via des requêtes `fetch` (AJAX) vers les points de terminaison de l'API (par exemple, `/api/products`, `/api/contact`), rendant l'expérience utilisateur fluide et sans rechargement de page.

## 2. Déploiement des outils

Pour installer et lancer le projet en local, suivez ces étapes :

1.  **Prérequis :** Assurez-vous d'avoir installé [Node.js](https://nodejs.org/) sur votre machine.
2.  **Installation des dépendances :** Ouvrez un terminal à la racine du projet et exécutez la commande suivante pour installer les bibliothèques nécessaires (Express, SQLite3, etc.) définies dans le fichier `package.json`.
    ```bash
    npm install
    ```
3.  **Lancement du serveur :** Une fois les dépendances installées, lancez le serveur avec la commande :
    ```bash
    node server.js
    ```
4.  **Accès à l'application :** Le site est maintenant accessible localement à l'adresse `http://localhost:3000`.

## 3. Base de données

Pour la gestion des données, **SQLite** a été choisi comme système de gestion de base de données. Il s'agit d'une solution légère, basée sur des fichiers, qui ne nécessite pas de serveur de base de données dédié, ce qui la rend idéale pour des projets de cette envergure. C'est l'alternative qui a été retenue à une solution plus complexe comme MySQL.

La base de données gère deux tables principales :
-   `products` : pour stocker les informations sur les vidéos (nom, prix, chemin de l'image, chemin de la vidéo).
-   `contacts` : pour enregistrer les messages envoyés via le formulaire de contact.

La base de données est initialisée au premier lancement du serveur.

## 4. Fonctionnalités professionnelles

Le site intègre un panneau d'administration sécurisé pour la gestion des produits.

-   **Gestion Complète des Produits :**
    -   **Ajout :** Un formulaire permet d'ajouter un nouveau produit à la base de données.
    -   **Modification :** Chaque produit peut être modifié. Un clic sur le bouton "Modifier" pré-remplit le formulaire avec les données existantes, et le bouton de soumission passe en mode "Enregistrer les modifications".
    -   **Suppression :** Chaque produit peut être supprimé de la base de données.

-   **Initialisation Automatique :**
    -   Au démarrage du serveur, un script vérifie si la table des produits est vide. Si c'est le cas, il insère automatiquement une liste de 9 vidéos prédéfinies avec un prix par défaut, garantissant que le site dispose toujours d'un contenu initial.

## 5. Références

Liste des outils et technologies utilisés pour ce projet :

-   **IDE :** WebStorm
-   **Environnement d'exécution :** Node.js
-   **Framework backend :** Express.js
-   **Base de données :** SQLite
-   **Gestion de version :** Git et GitHub
-   **Support à la documentation :** L'intelligence artificielle Jules a été utilisée pour aider à la génération de ce document.
