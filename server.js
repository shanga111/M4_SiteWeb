const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// --- Database Initialization (Persistent) ---
const db = new sqlite3.Database('portfolio.db', (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log('Connected to the persistent SQLite database (portfolio.db).');

  db.serialize(() => {
    // Create "products" table (now used for portfolio items)
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      image TEXT NOT NULL,
      video TEXT NOT NULL,
      modal_id TEXT NOT NULL,
      video_preview_id TEXT NOT NULL,
      is_wide INTEGER DEFAULT 0,
      comments TEXT DEFAULT ''
    )`);

    // Create "messages" table (maintained for potential future contact needs)
    db.run(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Insert initial data (Portfolio ERACOM)
    db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
      if (err) {
        console.error("Error checking for existing products:", err.message);
        return;
      }
      if (row.count === 0) {
        console.log("No portfolio items found, inserting default items.");
        const items = [
          { name: 'Blade Runner 2049', file: 'BladeRunner2049', wide: 1, comments: 'Edit réalisé sur After Effects. Travail sur l\'ambiance colorimétrique et le sound design.' },
          { name: 'Breaking Bad', file: 'BreakingBad', wide: 0, comments: 'Montage dynamique sur After Effects explorant la tension de la série.' },
          { name: 'Connor (Detroit Become Human)', file: 'Connor', wide: 0, comments: 'Un de mes premiers projets After Effects, focus sur les transitions.' },
          { name: 'Dune', file: 'Dune', wide: 1, comments: 'Projet réalisé lors de ma transition vers After Effects. Utilisation intensive d\'effets visuels.' },
          { name: 'Dune Part Two', file: 'DuneV2', wide: 1, comments: 'Travail récent sur After Effects mettant en avant la cinématographie du film.' },
          { name: 'Joe (Blade Runner)', file: 'Joe', wide: 0, comments: 'Edit réalisé sur CapCut PC, focalisé sur le rythme et l\'émotion.' },
          { name: 'Joe V2', file: 'JoeV2', wide: 0, comments: 'Amélioration du premier edit Joe, perfectionnement du montage sur CapCut PC.' },
          { name: 'Léon', file: 'Leon', wide: 0, comments: 'Edit classique réalisé sur CapCut mobile à mes débuts.' },
          { name: 'Spider-Man', file: 'SpiderMan', wide: 0, comments: 'Montage rapide et rythmé réalisé sur CapCut mobile.' }
        ];

        const stmt = db.prepare("INSERT INTO products (name, image, video, modal_id, video_preview_id, is_wide, comments) VALUES (?, ?, ?, ?, ?, ?, ?)");

        for (const item of items) {
          const product = {
            name: item.name,
            image: `img/${item.file}.png`,
            video: `video/${item.file}.mp4`,
            modalId: `modal-${item.file}`,
            videoPreviewId: `video-preview-${item.file}`,
            isWide: item.wide,
            comments: item.comments
          };
          stmt.run(product.name, product.image, product.video, product.modalId, product.videoPreviewId, product.isWide, product.comments, (err) => {
            if (err) {
              console.error(`Error inserting ${item.name}:`, err.message);
            }
          });
        }

        stmt.finalize((err) => {
          if (err) {
            console.error("Error finalizing statement:", err.message);
          } else {
            console.log("All ERACOM portfolio items have been inserted successfully.");
          }
        });
      } else {
        console.log("Database already contains products.");
      }
    });
  });
});

// Simple authentication middleware
const checkAdmin = (req, res, next) => {
    const password = req.headers['authorization'];
    if (password === 'admin') {
        next();
    } else {
        res.status(401).json({ error: 'Accès non autorisé' });
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
    return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
  }
  const sql = 'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)';
  db.run(sql, [name, email, message], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Message envoyé avec succès !', id: this.lastID });
  });
});

// --- Admin Endpoints ---
app.post('/api/products', checkAdmin, (req, res) => {
    const { name, image, video, is_wide, comments } = req.body;
    if (!name || !video) {
        return res.status(400).json({ error: 'Les champs nom et vidéo sont obligatoires.' });
    }

    // Slugification simplifiée pour les IDs
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const modal_id = `modal-${slug}`;
    const video_preview_id = `video-preview-${slug}`;

    const sql = 'INSERT INTO products (name, image, video, modal_id, video_preview_id, is_wide, comments) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.run(sql, [name, image, video, modal_id, video_preview_id, is_wide || 0, comments || ''], function(err) {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ message: 'Projet ajouté avec succès!', id: this.lastID });
    });
});

app.put('/api/products/:id', checkAdmin, (req, res) => {
    const { id } = req.params;
    const { name, image, video, is_wide, comments } = req.body;

    if (!name || !video) {
        return res.status(400).json({ error: 'Les champs nom et vidéo sont obligatoires.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const modal_id = `modal-${slug}`;
    const video_preview_id = `video-preview-${slug}`;

    const sql = `UPDATE products SET name = ?, image = ?, video = ?, modal_id = ?, video_preview_id = ?, is_wide = ?, comments = ? WHERE id = ?`;

    db.run(sql, [name, image, video, modal_id, video_preview_id, is_wide || 0, comments || '', id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Projet non trouvé' });
            return;
        }
        res.json({ message: 'Projet mis à jour avec succès' });
    });
});

app.delete('/api/products/:id', checkAdmin, (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM products WHERE id = ?';
    db.run(sql, id, function(err) {
        if (err) res.status(500).json({ error: err.message });
        else if (this.changes === 0) res.status(404).json({ error: 'Projet non trouvé' });
        else res.json({ message: 'Projet supprimé avec succès !' });
    });
});

// Serve static files
app.use(express.static(path.join(__dirname, '')));

// Start the server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

process.on('SIGINT', () => {
  db.close(() => {
    console.log('DB connection closed.');
    process.exit(0);
  });
});
