# Mémo Technique - Projet de Site Dynamique

## 1. Introduction

Ce document détaille les choix techniques et les procédures pour le projet de transformation du site "0banai Shop" d'un site statique à un site dynamique.

Le but était de mettre en place une architecture serveur simple et moderne pour gérer le contenu du site (produits, messages) de manière dynamique, conformément aux exigences du module "Technologie du WEB".

## 2. Choix Technologiques

### 2.1. Environnement Serveur : Node.js

*   **Node.js** a été choisi comme environnement d'exécution côté serveur. C'est une technologie très populaire, performante et basée sur le langage JavaScript, ce qui permet une cohérence avec le code côté client.

### 2.2. Framework Web : Express.js

*   **Express.js** a été utilisé comme framework pour Node.js. Il simplifie grandement la création de serveurs web et d'API RESTful. Sa légèreté et sa flexibilité en font un excellent choix pour ce type de projet.

### 2.3. Base de Données : SQLite (en mémoire)

*   **SQLite** a été sélectionné pour la gestion des données. C'est un moteur de base de données très léger qui ne nécessite pas de serveur séparé.
*   Pour des raisons de simplicité et pour contourner des limitations de l'environnement de développement, nous avons opté pour une **base de données en mémoire**. Cela signifie que la base de données est créée, peuplée et utilisée directement dans la mémoire vive du serveur.
*   **Conséquence** : Les données (produits ajoutés/supprimés, messages de contact) sont réinitialisées à chaque redémarrage du serveur. Pour un projet scolaire, cette approche est tout à fait viable et fonctionnelle.

## 3. Structure du Projet

*   `server.js`: Fichier principal contenant l'application Express, les routes de l'API et la logique de la base de données.
*   `index.html`: Page d'accueil dynamique qui charge les produits via l'API.
*   `admin.html`: Page d'administration pour gérer les produits.
*   `package.json`: Fichier de configuration du projet Node.js, listant les dépendances.
*   `css/`, `js/`, `img/`, `fonts/`: Répertoires contenant les ressources statiques du site.

## 4. Procédures d'Utilisation

### 4.1. Prérequis

*   Avoir **Node.js** et **npm** (le gestionnaire de paquets de Node.js) installés sur votre machine.

### 4.2. Installation

1.  Ouvrez un terminal à la racine du projet.
2.  Exécutez la commande suivante pour installer les dépendances (Express et SQLite) :
    ```bash
    npm install
    ```

### 4.3. Lancement du Serveur

1.  Toujours dans le terminal à la racine du projet, exécutez la commande :
    ```bash
    node server.js
    ```
2.  Le terminal devrait afficher un message confirmant que le serveur a démarré, généralement sur `http://localhost:3000`.

### 4.4. Accès au Site

*   **Site principal** : Ouvrez votre navigateur web et allez à l'adresse `http://localhost:3000`.
*   **Page d'administration** : Allez à l'adresse `http://localhost:3000/admin.html`.
    *   Un mot de passe vous sera demandé. Le mot de passe est : `admin`.

## 5. Fonctionnalités Implémentées

*   **Affichage dynamique des produits** : La page d'accueil charge les produits depuis la base de données via une API REST.
*   **Formulaire de contact fonctionnel** : Les messages envoyés sont stockés dans la base de données (en mémoire).
*   **Administration des produits** : La page `admin.html` permet d'ajouter et de supprimer des produits. Les modifications sont immédiatement visibles sur le site.
