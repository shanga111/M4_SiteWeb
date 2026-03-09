# Mémento Technique - Portfolio ERACOM

**Module:** EST - FOR - 004 - Technologie du WEB
**Auteur:** Shanga
**Date:** 06.03.2025

---

## 1. Introduction

Ce document constitue le mémento technique détaillé du projet de portfolio dynamique, réalisé dans le cadre du module "Technologie du WEB". L'objectif central était de faire évoluer un site portfolio statique en une application web complète et dynamique, en s'appuyant sur des technologies côté serveur pour la gestion de contenu, la persistance des données et les interactions.

Le projet final est un **Portfolio de candidature ERACOM** présentant des projets vidéo. Il dispose d'une interface d'administration sécurisée permettant une gestion complète des projets (Ajout, Modification, Suppression) et de fonctionnalités interactives avancées (son au survol, lecture automatique mobile).

### 1.1. Objectifs Pédagogiques et Techniques
Le cahier des charges du module imposait de remplir les objectifs suivants :
-   **Choix d'une stack technologique :** Sélectionner un serveur web (Node.js), un langage de programmation (JavaScript) et un framework (Express.js).
-   **Intégration d'une base de données :** Mettre en place une base de données persistante (SQLite) pour stocker les informations des projets.
-   **Développement d'une application fonctionnelle :** Créer une application web dynamique incluant une API RESTful et une interface de gestion.
-   **Rédaction d'un mémento technique :** Produire une documentation exhaustive détaillant tous les aspects techniques.

### 1.2. Justification des Technologies Choisies

-   **Node.js & Express.js :**
    -   **Performance :** Architecture non bloquante idéale pour gérer les requêtes simultanées.
    -   **Écosystème :** npm offre une vaste bibliothèque de modules (express, sqlite3).
    -   **Cohérence :** JavaScript utilisé pour le frontend et le backend.

-   **SQLite (Persistant) :**
    -   **Simplicité :** SGBD basé sur un fichier (`portfolio.db`), ne nécessitant pas de serveur dédié.
    -   **Persistance :** Contrairement à une base en mémoire, les modifications apportées via l'interface d'administration sont conservées après un redémarrage du serveur.
    -   **Légèreté :** Parfait pour un portfolio personnel avec un volume de données modéré.

---

## 2. Architecture et Structure du Projet

L'application repose sur une séparation claire entre la logique de présentation (frontend) et la logique métier (backend).

### 2.1. Structure Détaillée des Fichiers
```
/
|-- css/                  # Styles (Bootstrap, template custom, responsive grid)
|-- img/                  # Images (facultatif)
|-- js/                   # Scripts JS client
|-- video/                # Vidéos des projets (dossier standardisé)
|
|-- admin.html            # Panneau d'administration (interface CRUD en français)
|-- index.html            # Page principale (Portfolio dynamique)
|-- about.html            # Page "À propos" (Parcours ERACOM)
|-- server.js             # Backend (Express, API REST, SQLite)
|-- portfolio.db          # Base de données SQLite persistante
|-- package.json          # Configuration npm
|-- MEMENTO_TECHNIQUE.md  # Ce document
```

### 2.2. Architecture Backend (server.js)

Le fichier `server.js` est le contrôleur central de l'application.

1.  **Serveur Express :** Configure les middlewares et sert les fichiers statiques.
2.  **Base de Données SQLite :** Établit la connexion au fichier `portfolio.db`.
3.  **Initialisation et Seeding :** Au premier lancement (si la table est vide), il peuple la base avec 10 projets par défaut (dont un projet Lego au format 16:9).
4.  **API RESTful :**
    -   `GET /api/products`: Récupère la liste des projets.
    -   `POST /api/contact`: Enregistre les messages de contact.
    -   `POST /api/products`: Ajoute un projet (protégé par mot de passe).
    -   `PUT /api/products/:id`: Modifie un projet (protégé).
    -   `DELETE /api/products/:id`: Supprime un projet (protégé).

### 2.3. Architecture Frontend et Fonctionnalités

1.  **Grille Responsive Dynamique :** Utilisation de `vw` (viewport width) pour garantir des vignettes carrées (1:1) sur tous les écrans, avec une adaptation du nombre de colonnes (3 sur PC, 2 sur Tablette, 1 sur Mobile). Le site n'utilise pas d'images statiques de couverture (posters), s'appuyant directement sur la première frame de la vidéo.
2.  **Interactions Audio-Visuelles :**
    -   **Son au survol :** Sur Desktop, le survol d'une vignette active la vidéo avec le son (`muted = false`).
    -   **Autoplay Mobile Intelligent :** Utilisation de l'API `IntersectionObserver` avec un masque central (`rootMargin`) pour ne lancer que la vidéo située au milieu de l'écran sur mobile.
    -   **Modales de Projet :** Affichent la vidéo en grand avec une section de commentaires/notes techniques extraite de la base de données.
3.  **Interface d'Administration :** Permet de gérer les projets, de définir si un projet doit s'afficher en format large (16:9) et d'éditer les commentaires techniques.

---

## 3. Guide d'Installation et Utilisation

### 3.1. Prérequis
-   **Node.js** (v14+) et **npm**.

### 3.2. Installation
1.  Installer les dépendances : `npm install`
2.  Démarrer le serveur : `npm start` (ou `node server.js`)
3.  Accéder au site : `http://localhost:3000`

### 3.3. Administration
-   URL : `http://localhost:3000/admin.html`
-   Mot de passe par défaut : `admin`

---

## 4. Analyse et Auto-évaluation

### 4.1. Points Forts de l'Implémentation
-   **Expérience Utilisateur (UX) :** Le son au survol et l'autoplay intelligent sur mobile rendent le portfolio très dynamique.
-   **Robustesse Technique :** La base de données persistante permet une véritable gestion de contenu.
-   **Design Adaptatif :** La grille fluide gère parfaitement les différents formats (carré vs 16:9).

### 4.2. Pistes d'Amélioration
-   **Upload de fichiers :** Actuellement, les chemins d'images et vidéos sont saisis manuellement. L'ajout d'un système d'upload (`multer`) simplifierait la gestion.
-   **Sécurité :** Utiliser des variables d'environnement pour le mot de passe admin et implémenter des tokens JWT pour une session plus sécurisée.
-   **Commentaires Interactifs :** Permettre aux visiteurs de laisser des commentaires (après modération) directement sous les vidéos.
