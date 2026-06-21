import express from 'express';
import { get, query } from '../db.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { wilayaNom } from '../data/wilayas.js';

const router = express.Router();

router.get('/', authenticate, authorize('admin', 'president'), async (req, res) => {
  try {
    const totalAdherents = (await get('SELECT COUNT(*) AS c FROM adherents')).c;

    const parType = await query('SELECT type_code, COUNT(*) AS c FROM adherents GROUP BY type_code');
    const typeCount = (code) => (parType.find((x) => x.type_code === code)?.c) || 0;

    const gold = (await get("SELECT COUNT(*) AS c FROM adherents WHERE niveau = 'Adhérent Gold'")).c;

    const parWilayaRaw = await query('SELECT wilaya_code, COUNT(*) AS c FROM adherents GROUP BY wilaya_code ORDER BY c DESC');
    const parWilaya = parWilayaRaw.map((r) => ({ code: r.wilaya_code, nom: wilayaNom(r.wilaya_code), count: r.c }));

    const mois = new Date().toISOString().slice(0, 7);
    const nouveauxMois = (await get("SELECT COUNT(*) AS c FROM adherents WHERE DATE_FORMAT(date_adhesion, '%Y-%m') = ?", [mois])).c;

    const demandesParStatut = await query('SELECT statut, COUNT(*) AS c FROM demandes_site GROUP BY statut');
    const totalDemandes = (await get('SELECT COUNT(*) AS c FROM demandes_site')).c;
    const demStatut = (s) => (demandesParStatut.find((x) => x.statut === s)?.c) || 0;
    const demandesOuvertes = demStatut('Nouvelle') + demStatut('En cours') + demStatut('En attente');
    const demandesCloturees = demStatut('Clôturée') + demStatut('Résolue');
    const tauxTraitement = totalDemandes ? Math.round((demandesCloturees / totalDemandes) * 100) : 0;

    res.json({
      totalAdherents,
      adherents: { AD: typeCount('AD'), MA: typeCount('MA'), CR: typeCount('CR'), gold },
      parWilaya, nouveauxMois,
      demandes: { total: totalDemandes, ouvertes: demandesOuvertes, cloturees: demandesCloturees, tauxTraitement, parStatut: demandesParStatut },
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;