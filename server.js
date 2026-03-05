const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// --- Database Initialization (In-Memory) ---
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log('Connected to the in-memory SQLite database.');

  db.serialize(() => {
    // Create "products" table
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT NOT NULL,
      video TEXT NOT NULL,
      modal_id TEXT NOT NULL,
      video_preview_id TEXT NOT NULL
    )`);

    // Create "messages" table
    db.run(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Insert initial data
    db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
      if (err) {
        console.error("Error checking for existing products:", err.message);
        return;
      }
      if (row.count === 0) {
        console.log("No products found, inserting default products.");
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
              console.error(`Error inserting ${name}:`, err.message);
            }
          });
        }

        stmt.finalize((err) => {
          if (err) {
            console.error("Error finalizing statement:", err.message);
          } else {
            console.log("All default products have been inserted successfully.");
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
        res.status(401).json({ error: 'Unauthorized' });
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
    return res.status(400).json({ error: 'All fields are required.' });
  }
  const sql = 'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)';
  db.run(sql, [name, email, message], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Message sent successfully!', id: this.lastID });
  });
});

// --- Admin Endpoints ---
app.post('/api/products', checkAdmin, (req, res) => {
    const { name, price, image, video } = req.body;
    if (!name || price === undefined || !image || !video) {
        return res.status(400).json({ error: 'Fields name, price, image, and video are required.' });
    }

    const modal_id = `modal-${name}`;
    const video_preview_id = `video-preview-${name}`;

    const sql = 'INSERT INTO products (name, price, image, video, modal_id, video_preview_id) VALUES (?, ?, ?, ?, ?, ?)';
    db.run(sql, [name, price, image, video, modal_id, video_preview_id], function(err) {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ message: 'Product added successfully!', id: this.lastID });
    });
});

app.put('/api/products/:id', checkAdmin, (req, res) => {
    const { id } = req.params;
    const { name, price, image, video } = req.body;

    if (!name || price === undefined || !image || !video) {
        return res.status(400).json({ error: 'Fields name, price, image, and video are required.' });
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
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.json({ message: 'Product updated successfully' });
    });
});

app.delete('/api/products/:id', checkAdmin, (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM products WHERE id = ?';
    db.run(sql, id, function(err) {
        if (err) res.status(500).json({ error: err.message });
        else if (this.changes === 0) res.status(404).json({ error: 'Product not found' });
        else res.json({ message: 'Product deleted successfully!' });
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
