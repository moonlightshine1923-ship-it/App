import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connect } from './db.js';
import { ensureSeed } from './seed.js';
import { authenticate, authorize } from './middleware/auth.js';
import { scheduleAutoBackup, runBackup, listBackups, backupDir } from './backup.js';
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
app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy', "default-src 'self' data: blob:; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'; connect-src 'self'; frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'");
  next();
});

// CORS pour autoriser le site React Site-2
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ];

  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

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

// Front-end statique (avec désactivation complète du cache navigateur)
app.use(express.static(path.join(ROOT, 'frontend'), {
  etag: false,
  maxAge: 0,
  setHeaders: (res, filePath) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));
app.use((req, res) => {
  res.sendFile(path.join(ROOT, 'frontend', 'index.html'));
});

// Gestion d'erreurs (uploads volumineux, etc.)
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ error: err.message || 'Erreur serveur.' });
});

const PORT = process.env.PORT || 3002;

(async () => {
  try {
    await connect();
    await ensureSeed();
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