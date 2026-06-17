import express from 'express';
import { get, query, run } from '../db.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadDoc } from '../middleware/upload.js';

const router = express.Router();

// Liste (admin & président)
router.get('/', authenticate, authorize('admin', 'president'), async (req, res) => {
  try {
    let rows;
    if (req.query.adherent_id) {
      rows = await query('SELECT * FROM documents WHERE adherent_id = ? ORDER BY created_at DESC', [req.query.adherent_id]);
    } else {
      rows = await query('SELECT * FROM documents ORDER BY created_at DESC');
    }
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Ajout (admin & président)
router.post('/', authenticate, authorize('admin', 'president'), uploadDoc.single('fichier'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Fichier requis.' });
    const titre = req.body.titre || req.file.originalname;
    const adherent_id = req.body.adherent_id ? parseInt(req.body.adherent_id, 10) : null;
    const result = await run('INSERT INTO documents (adherent_id, titre, filename, original_name) VALUES (?,?,?,?)',
      [adherent_id, titre, `documents/${req.file.filename}`, req.file.originalname]);
    res.status(201).json(await get('SELECT * FROM documents WHERE id = ?', [result.insertId]));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', authenticate, authorize('admin', 'president'), async (req, res) => {
  try {
    const r = await run('DELETE FROM documents WHERE id = ?', [req.params.id]);
    if (!r.affectedRows) return res.status(404).json({ error: 'Document introuvable.' });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;
