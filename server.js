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
            comments: `1. Blade Runner Remaster – 'Im literally Him'

Musique : Tame Impala - Let It Happen (Slowed + Reverb).

Concept : Basé sur la trend 'Literally Me'. L'intro souligne le cadeau de liberté offert à Joi.

Style : Vibe 'chill' et libératrice. Le drop symbolise l'acceptation : 'Let it happen'.

Technique : Element 3D (textes), Deep Glow & Drop Shadow, Ripple Dissolve, CC Wide Time, S_BlurMoCurves.`
          },
          {
            name: 'DarthVaderEdit',
            wide: 0,
            comments: `2. Darth Vader – '#1 MC oat'

Musique : ZUMA JUMP (Super Slowed).

Concept : La figure de l'ange déchu (réf. à Cabanel). La chute d'Anakin vers l'obscurité.

Style : Sombre et puissant. Utilisation du Face Tracking pour renforcer l'intensité du regard.

Technique : CC Crimson, Ripple Dissolve au drop, CC Wide Time, S_BlurMoCurves, Deep Glow & Drop Shadow.`
          },
          {
            name: 'DarkEdit',
            wide: 0,
            comments: `3. Dark – 'The question is not where but when'

Musique : Crystal Castles - Suffocation (Instrumental).

Concept : Retracer le 'cycle' temporel. Intégration du logo Triquetra (Sic Mundus Creatus Est).

Style : Mouvement de rotation style aiguille d'horloge. Sound design tic-tac pour marquer la fatalité.

Technique : Face Tracking, S_BlurMoCurves, Deep Glow & Drop Shadow, étalonnage froid.`
          },
          {
            name: 'DarkEdit2',
            wide: 0,
            comments: `4. Dark – 'I AM YOU'

Musique : Skins (Slowed).

Concept : La rencontre entre le Jonas du futur et celui du passé pour perpétuer la boucle.

Style : Dramatique et narratif. Focus sur la dualité du personnage.

Technique : Element 3D, CC Crimson, CC Wide Time, Slide transitions, Reverse, Face Tracking, S_BlurMoCurves.`
          },
          {
            name: 'EllieEdit',
            wide: 0,
            comments: `5. Ellie (TLOU) – 'She's so Tuff'

Musique : MONTAGEM FANTÁSTICA.

Concept : La survie brutale d'Ellie.

Style : Cinématographique (barres noires), flashs inversés et grain à l'image.

Technique : Shatter (verre brisé sur 'Quick'), Motion Design (compteur d'aura), Face Tracking, S_BlurMoCurves.`
          },
          {
            name: 'AizenEdit',
            wide: 0,
            comments: `6. Aizen (Bleach) – 'Too Much Spiritual Pressure'

Musique : LUA NA PRAÇA.

Concept : Capturer l'aura de supériorité absolue d'Aizen.

Style : Profondeur de champ artificielle pour un rendu professionnel.

Technique : Caméra 3D, Image Transformer, CC Crimson, S_BlurMoCurves, Deep Glow & Drop Shadow.`
          },
          {
            name: 'Gun-WooEdit',
            wide: 0,
            comments: `7. Geon-Woo (Bloodhounds) – 'He's so tuff'

Musique : MONTAGEM AROMA (Slowed).

Concept : Mettre en avant le côté 'badass' du protagoniste.

Style : Utilisation du Rotoscope pour placer des panoramiques derrière le personnage. Pas de RSMB.

Technique : S_BlurMoCurves (zooms/slides), Face Tracking, Deep Glow & Drop Shadow.`
          },
          {
            name: 'GoldenBrownEdit',
            wide: 0,
            comments: `8. Knight Edit – 'Golden Brown'

Musique : Golden Brown X Love Story (Slowed).

Concept : Succès viral (1.6M de vues). Esthétique médiévale sur un classique de 1981.

Style : 'Chill' et décontracté. Focus sur l'image et la watermark personnelle.

Technique : S_Shake pour le mouvement organique, CC dorée, S_BlurMoCurves.`
          },
          {
            name: 'LaraEdit',
            wide: 0,
            comments: `9. Lara Croft – 'She's tuff asf'

Musique : MINHA NOITE (Ultra Slowed).

Concept : L'évolution de l'héroïne à travers les époques.

Style : Dynamique. Rotoscope sur l'intro et watermark inversée sur banderole.

Technique : Slide transitions, Face Tracking, S_BlurMoCurves, Deep Glow & Drop Shadow.`
          },
          {
            name: 'LegoStopMotion(Brickfilm)',
            wide: 1,
            comments: `10. Brickfilm (2020) – 'Premiers pas en Stop-Motion'

Outils : Stop Motion Studio Pro.

Pourquoi l'inclure ? : Projet réalisé à 14 ans. C'est le point de départ de ma passion, prouvant ma détermination à créer avec les moyens du bord.

Style : Animation image par image (Stop-motion).`
          }
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
