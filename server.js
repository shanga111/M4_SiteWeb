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
      if (row.count === 0) {
        const products = [
          { name: 'Leon Edit', price: 5, image: 'img/LEON EDIT.png', video: 'LEON EDIT.mp4', modalId: 'product-modal-leon', videoPreviewId: 'leonVideoPreview' },
          { name: 'Breaking Bad Edit', price: 5, image: 'img/Breaking bad Edit.png', video: 'Breaking bad Edit.mp4', modalId: 'product-modal-bb', videoPreviewId: 'bbVideoPreview' },
          { name: 'Blade Runner 2049 Edit', price: 5, image: 'img/Blade Runner 2049 Edit.png', video: 'Blade Runner 2049 Edit.mp4', modalId: 'product-modal-br', videoPreviewId: 'brVideoPreview' },
          { name: 'Connor Edit', price: 5, image: 'img/Connor Edit.png', video: 'Connor Edit.mp4', modalId: 'product-modal-connor', videoPreviewId: 'connorVideoPreview' },
          { name: 'Joe Edit', price: 5, image: 'img/Joe Edit.png', video: 'Joe Edit.mp4', modalId: 'product-modal-joe', videoPreviewId: 'joeVideoPreview' },
          { name: 'Joe Edit V2', price: 5, image: 'img/Joe EditV2.png', video: 'Joe EditV2.mp4', modalId: 'product-modal-joeV2', videoPreviewId: 'joeV2VideoPreview' },
          { name: 'Dune Edit', price: 5, image: 'img/Dune Goat.png', video: 'Dune Goat.mp4', modalId: 'product-modal-dune', videoPreviewId: 'duneVideoPreview' },
          { name: 'Spider-Man Edit', price: 5, image: 'img/Spider-Man Edit.png', video: 'Spider-Man Edit.mp4', modalId: 'product-modal-spiderman', videoPreviewId: 'spidermanVideoPreview' },
          { name: 'Dune Edit V2', price: 5, image: 'img/Dune Edit.png', video: 'Dune Edit.mp4', modalId: 'product-modal-duneV2', videoPreviewId: 'duneV2VideoPreview' }
        ];
        const stmt = db.prepare("INSERT INTO products (name, price, image, video, modal_id, video_preview_id) VALUES (?, ?, ?, ?, ?, ?)");
        for (const product of products) {
          stmt.run(product.name, product.price, product.image, product.video, product.modalId, product.videoPreviewId);
        }
        stmt.finalize();
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
    const { name, price, image, video, modal_id, video_preview_id } = req.body;
    if (!name || !price || !image || !video || !modal_id || !video_preview_id) {
        return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }
    const sql = 'INSERT INTO products (name, price, image, video, modal_id, video_preview_id) VALUES (?, ?, ?, ?, ?, ?)';
    db.run(sql, [name, price, image, video, modal_id, video_preview_id], function(err) {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ message: 'Produit ajouté avec succès!', id: this.lastID });
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
