import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connect } from './db.js';
import { ensureSeed } from './seed.js';
import { authenticate, authorize } from './middleware/auth.js';
import { scheduleAutoBackup, runBackup, listBackups, backupDir } from './backup.js';
import { verifyMailer } from './mailer.js';
import { CONFIG } from './config.js';

import authRoutes from './routes/auth.js';
import referenceRoutes from './routes/reference.js';
import adherentsRoutes from './routes/adherents.js';
import demandesRoutes from './routes/demandes.js';
import documentsRoutes from './routes/documents.js';
import statsRoutes from './routes/stats.js';
import usersRoutes from './routes/users.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API
app.use('/api/auth', authRoutes);
app.use('/api/reference', referenceRoutes);
app.use('/api/adherents', adherentsRoutes);
app.use('/api/demandes', demandesRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/users', usersRoutes);

// Sauvegarde manuelle de la base (admin & président)
app.post('/api/backup', authenticate, authorize('admin', 'president'), async (req, res) => {
  try {
    const { fileName } = await runBackup();
    res.json({ ok: true, file: fileName });
  } catch (e) {
    res.status(500).json({ error: 'Sauvegarde échouée : ' + e.message });
  }
});

// Liste des sauvegardes existantes
app.get('/api/backup', authenticate, authorize('admin', 'president'), (req, res) => {
  res.json(listBackups());
});

// Téléchargement d'une sauvegarde
app.get('/api/backup/download', authenticate, authorize('admin', 'president'), (req, res) => {
  const name = req.query.name || '';
  // Sécurité : empêche la traversée de répertoire
  if (!name.endsWith('.sql') || name.includes('/') || name.includes('\\') || name.includes('..')) {
    return res.status(400).json({ error: 'Nom de fichier invalide.' });
  }
  const file = path.join(backupDir(), name);
  if (!fs.existsSync(file)) return res.status(404).json({ error: 'Fichier introuvable.' });
  res.download(file, name);
});

// Fichiers uploadés (protégés)
app.use('/uploads', authenticate, express.static(path.join(ROOT, 'uploads')));

// Front-end statique
app.use(express.static(path.join(ROOT, 'frontend')));
app.use((req, res) => {
  res.sendFile(path.join(ROOT, 'frontend', 'index.html'));
});

// Gestion d'erreurs (uploads volumineux, etc.)
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ error: err.message || 'Erreur serveur.' });
});

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connect();
    await ensureSeed();
    await verifyMailer();          // vérifie la configuration email
    scheduleAutoBackup();         // sauvegarde automatique (jeudi 16h par défaut)
    app.listen(PORT, () => {
      console.log(`\n  OPA — Organisation des Patronats d'Algérie`);
      console.log(`  Base MySQL connectée (${CONFIG.db.name})`);
      console.log(`  Serveur démarré sur http://localhost:${PORT}\n`);
    });
  } catch (err) {
    console.error('\n  ❌ Impossible de se connecter à MySQL.');
    console.error('  Vérifiez que MySQL (XAMPP) est démarré et que la base est accessible.');
    console.error('  Détail :', err.message, '\n');
    process.exit(1);
  }
})();
