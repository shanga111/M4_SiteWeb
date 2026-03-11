const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('portfolio.db');

const bladeRunnerComment = `Note d'intention (Concept) :

"Inspiré par la culture web entourant la figure de Ryan Gosling, cet édit détourne l'esthétique mélancolique habituelle du film pour une approche plus optimiste. J'ai choisi le titre Let It Happen de Tame Impala pour illustrer une leçon de vie : l'acceptation et le lâcher-prise. L'intro souligne le passage où K offre la liberté à Joi, transformant un moment intime en une explosion de vitalité lors du drop musical, reflétant ma propre sensibilité artistique."

Fiche Technique (VFX & Workflow) :

Composition 3D : Utilisation du plugin Element 3D pour intégrer des textes en relief dans l'espace cinématique.

Animation de texte : Travail sur la typographie avec Deep Glow pour une incrustation lumineuse réaliste.

Transitions & Dynamisme :

CC Wide Time pour créer des traînées de mouvement fluides.

S_BlurMoCurves (Boris FX) pour des mouvements de caméra organiques.

Ripple Dissolve : Transition synchronisée sur le drop pour simuler une onde de choc visuelle qui "brise" le texte et libère l'image.

Étalonnage : Color Correction (CC) personnalisée pour saturer les bleus et oranges iconiques du film tout en gardant une clarté "joyeuse".`;

db.run("UPDATE products SET comments = ? WHERE name = 'BladeRunnerEdit'", [bladeRunnerComment], function(err) {
  if (err) {
    console.error(err.message);
  } else {
    console.log(`Updated BladeRunnerEdit comments. Changes: ${this.changes}`);
  }
  db.close();
});
