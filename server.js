const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());

// --- Initialisation de la base de données en mémoire ---
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log('Connecté à la base de données SQLite en mémoire.');

  db.serialize(() => {
    // Créer la table "products"
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT NOT NULL,
      video TEXT NOT NULL,
      modal_id TEXT NOT NULL,
      video_preview_id TEXT NOT NULL
    )`);

    // Créer la table "messages"
    db.run(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Insérer les données initiales
    db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
      if (err) {
        console.error("Erreur lors de la vérification des produits existants:", err.message);
        return;
      }
      if (row.count === 0) {
        console.log("Aucun produit trouvé, insertion des produits par défaut.");
        const productNames = [
          'BladeRunner2049', 'BreakingBad', 'Connor', 'Dune', 'DuneV2',
          'Joe', 'JoeV2', 'Leon', 'SpiderMan'
        ];

        const stmt = db.prepare("INSERT INTO products (name, price, image, video, modal_id, video_preview_id) VALUES (?, ?, ?, ?, ?, ?)");

        for (const name of productNames) {
          const product = {
            name: name,
            price: 5.00,
            image: `img/${name}.png`,
            video: `Video/${name}.mp4`,
            modalId: `modal-${name}`,
            videoPreviewId: `video-preview-${name}`
          };
          stmt.run(product.name, product.price, product.image, product.video, product.modalId, product.videoPreviewId, (err) => {
            if (err) {
              console.error(`Erreur lors de l'insertion de ${name}:`, err.message);
            }
          });
        }

        stmt.finalize((err) => {
          if (err) {
            console.error("Erreur lors de la finalisation de l'instruction:", err.message);
          } else {
            console.log("Tous les produits par défaut ont été insérés avec succès.");
          }
        });
      } else {
        console.log("La base de données contient déjà des produits.");
      }
    });
  });
});

// Middleware d'authentification simple
const checkAdmin = (req, res, next) => {
    const password = req.headers['authorization'];
    if (password === 'admin') {
        next();
    } else {
        res.status(401).json({ error: 'Non autorisé' });
    }
};

// --- API Endpoints ---
app.get('/api/products', (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) res.status(500).json({ "error": err.message });
    else res.json(rows);
  });
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }
  const sql = 'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)';
  db.run(sql, [name, email, message], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Message envoyé avec succès!', id: this.lastID });
  });
});

// --- Endpoints d'Administration ---
app.post('/api/products', checkAdmin, (req, res) => {
    const { name, price, image, video } = req.body;
    if (!name || price === undefined || !image || !video) {
        return res.status(400).json({ error: 'Les champs nom, prix, image et vidéo sont requis.' });
    }

    const modal_id = `modal-${name}`;
    const video_preview_id = `video-preview-${name}`;

    const sql = 'INSERT INTO products (name, price, image, video, modal_id, video_preview_id) VALUES (?, ?, ?, ?, ?, ?)';
    db.run(sql, [name, price, image, video, modal_id, video_preview_id], function(err) {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ message: 'Produit ajouté avec succès!', id: this.lastID });
    });
});

app.put('/api/products/:id', checkAdmin, (req, res) => {
    const { id } = req.params;
    const { name, price, image, video } = req.body;

    if (!name || price === undefined || !image || !video) {
        return res.status(400).json({ error: 'Les champs nom, prix, image et vidéo sont requis.' });
    }

    const modal_id = `modal-${name}`;
    const video_preview_id = `video-preview-${name}`;

    const sql = `UPDATE products SET name = ?, price = ?, image = ?, video = ?, modal_id = ?, video_preview_id = ? WHERE id = ?`;

    db.run(sql, [name, price, image, video, modal_id, video_preview_id, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Produit non trouvé' });
            return;
        }
        res.json({ message: 'Produit mis à jour avec succès' });
    });
});

app.delete('/api/products/:id', checkAdmin, (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM products WHERE id = ?';
    db.run(sql, id, function(err) {
        if (err) res.status(500).json({ error: err.message });
        else if (this.changes === 0) res.status(404).json({ error: 'Produit non trouvé' });
        else res.json({ message: 'Produit supprimé avec succès!' });
    });
});

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '')));

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});

process.on('SIGINT', () => {
  db.close(() => {
    console.log('Connexion DB fermée.');
    process.exit(0);
  });
});
