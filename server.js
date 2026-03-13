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
          {
            name: 'BladeRunnerEdit',
            wide: 0,
            comments: `Note d'intention (Concept) :

"Blade Runner Remaster – 'Im literally Him'

Musique : Tame Impala - Let It Happen (Slowed + Reverb).

Pourquoi cet édit ? : Inspiré par la tendance 'Literally Me'. L'idée est d'illustrer l'acceptation et le lâcher-prise à travers le personnage de K.

Pourquoi ce style ? : Ambiance libre et aérienne. Le drop symbolise le cadeau de la liberté."

Fiche Technique (VFX & Workflow) :

Effets utilisés : Color Correction (CC) personnalisée, Element 3D, Deep Glow & Drop Shadow sur les textes, Ripple Dissolve, CC Wide Time.`
          },
          {
            name: 'DarkEdit',
            wide: 0,
            comments: `Note d'intention (Concept) :

"Dark – 'The question is not where but when'

Musique : Crystal Castles - Suffocation (Instrumental).

Pourquoi cet édit ? : Illustrer la boucle temporelle infinie et la fatalité des personnages.

Pourquoi ce style ? : Froid et glitchy. Utilisation de l'aberration chromatique pour simuler une distorsion du temps."

Fiche Technique (VFX & Workflow) :

Effets utilisés : Color Correction (CC) bleutée, RGB Split, Film Grain, Deep Glow & Drop Shadow sur les textes, Masking.`
          },
          {
            name: 'DarkEdit2',
            wide: 0,
            comments: `Note d'intention (Concept) :

"Dark – 'I AM YOU'

Musique : Skins (Slowed).

Pourquoi cet édit ? : Focus sur le choc psychologique entre Jonas et son futur lui-même.

Pourquoi ce style ? : Pesant et dramatique. Le texte est l'élément central de la révélation."

Fiche Technique (VFX & Workflow) :

Effets utilisés : Color Correction (CC) dramatique, Typographie cinétique, Deep Glow & Drop Shadow sur les textes, S_BlurMoCurves.`
          },
          {
            name: 'DarthVaderEdit',
            wide: 0,
            comments: `Note d'intention (Concept) :

"Darth Vader – '#1 MC oat'

Musique : ZUMA JUMP (Super Slowed).

Pourquoi cet édit ? : Montrer la puissance brute et l'intimidation du Seigneur Sith.

Pourquoi ce style ? : Hardstyle / Phonk. Montage agressif centré sur la transition entre Anakin et Vader."

Fiche Technique (VFX & Workflow) :

Effets utilisés : Color Correction (CC) contrastée, Twitch, Flashs rythmés, Deep Glow & Drop Shadow sur les textes.`
          },
          {
            name: 'EllieEdit',
            wide: 0,
            comments: `Note d'intention (Concept) :

"Ellie (TLOU) – 'She's so Tuff'

Musique : MONTAGEM FANTÁSTICA.

Pourquoi cet édit ? : Raconter la perte d'innocence d'Ellie et sa transformation en survivante redoutable.

Pourquoi ce style ? : Brutal et contrasté. On passe d'un dialogue calme à une action nerveuse."

Fiche Technique (VFX & Workflow) :

Effets utilisés : Color Correction (CC) automnale, RSMB, Overlays de poussière, Deep Glow & Drop Shadow sur les textes.`
          },
          {
            name: 'GoldenBrownEdit',
            wide: 0,
            comments: `Note d'intention (Concept) :

"Knight Edit – 'Golden Brown'

Musique : The Stranglers - Golden Brown X Love Story (Slowed).

Pourquoi cet édit ? : Créer un décalage esthétique entre la musique vintage et l'imagerie médiévale.

Pourquoi ce style ? : 'Dreamy' et nostalgique. Focus sur la texture de l'armure et la lumière dorée."

Fiche Technique (VFX & Workflow) :

Effets utilisés : Color Correction (CC) dorée/sépia, Film Damage, Soft Glow, Deep Glow & Drop Shadow sur les textes.`
          },
          {
            name: 'Gun-WooEdit',
            wide: 0,
            comments: `Note d'intention (Concept) :

"Geon-Woo (Bloodhounds) – 'He's so tuff'

Musique : MONTAGEM AROMA (Slowed).

Pourquoi cet édit ? : Valoriser la technique de boxe et l'intensité des impacts dans la série.

Pourquoi ce style ? : Urbain et percutant. Le rythme suit chaque coup porté."

Fiche Technique (VFX & Workflow) :

Effets utilisés : Color Correction (CC) froide, RSMB, Zooms d'impact, Deep Glow & Drop Shadow sur les textes.`
          },
          {
            name: 'LaraEdit',
            wide: 0,
            comments: `Note d'intention (Concept) :

"Lara Croft – 'She's tuff asf'

Musique : MINHA NOITE (Ultra Slowed).

Pourquoi cet édit ? : Retracer l'évolution visuelle et le caractère de Lara Croft à travers le temps.

Pourquoi ce style ? : Fluide et dynamique. Utilisation de Match Cuts pour lier les différentes époques."

Fiche Technique (VFX & Workflow) :

Effets utilisés : Color Correction (CC) vive, Match Cuts, Slide transitions, Deep Glow & Drop Shadow sur les textes.`
          },
          {
            name: 'AizenEdit',
            wide: 0,
            comments: `Note d'intention (Concept) :

"Aizen (Bleach) – 'Too Much Spiritual Pressure'

Musique : LUA NA PRAÇA (Brazilian Funk).

Pourquoi cet édit ? : Capturer l'aura de supériorité et le charisme d'Aizen.

Pourquoi ce style ? : High Energy. Montage ultra-rapide synchronisé sur la basse pour un impact maximal."

Fiche Technique (VFX & Workflow) :

Effets utilisés : Color Correction (CC) saturée, Twixtor (slow-mo), Shakes, Deep Glow & Drop Shadow sur les textes.`
          },
          { name: 'LegoStopMotion(Brickfilm)', wide: 1 }
        ];

        const stmt = db.prepare("INSERT INTO products (name, image, video, modal_id, video_preview_id, is_wide, comments) VALUES (?, ?, ?, ?, ?, ?, ?)");

        for (const item of items) {
          const name = item.name;
          const product = {
            name: name,
            image: `img/${name}.png`,
            video: `video/${name}.mp4`,
            modalId: `modal-${name.replace(/[() ]/g, '')}`,
            videoPreviewId: `video-preview-${name.replace(/[() ]/g, '')}`,
            isWide: item.wide,
            comments: item.comments || 'Edit TikTok réalisé en autodidacte (After Effects / CapCut).'
          };
          stmt.run(product.name, product.image, product.video, product.modalId, product.videoPreviewId, product.isWide, product.comments, (err) => {
            if (err) {
              console.error(`Error inserting ${name}:`, err.message);
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
    const { name, image, video, is_wide, comments } = req.body;
    if (!name || !video) {
        return res.status(400).json({ error: 'Fields name and video are required.' });
    }

    const modal_id = `modal-${name.replace(/[()]/g, '')}`;
    const video_preview_id = `video-preview-${name.replace(/[()]/g, '')}`;

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
        return res.status(400).json({ error: 'Fields name and video are required.' });
    }

    const modal_id = `modal-${name.replace(/[()]/g, '')}`;
    const video_preview_id = `video-preview-${name.replace(/[()]/g, '')}`;

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
