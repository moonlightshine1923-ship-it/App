# Module Blacklist – OPA

Ajout complet d’une rubrique **Blacklist** pour l’administrateur / président.

## Ce qui a été ajouté

### Backend (Node / Express / MySQL)
1. **Table `blacklist`** (auto-créée au démarrage)
   - `id`, `adherent_id` (FK nullable), `nom`, `prenom`, `matricule`, `telephone`, `nin`, `wilaya_code`
   - `motif` TEXT
   - `niveau_risque` ENUM('faible','moyen','élevé','critique')
   - `date_blacklist` DATE
   - `created_by`, `created_at`, `updated_at`
   - Fichier : `backend/db.js`

2. **API REST** : `backend/routes/blacklist.js`
   - `GET /api/blacklist?q=&wilaya=&risque=` – liste
   - `GET /api/blacklist/:id` – détail
   - `POST /api/blacklist` – création manuelle ou via `adherent_id`
   - `PATCH /api/blacklist/:id` – modification
   - `DELETE /api/blacklist/:id` – retirer
   - `POST /api/blacklist/adherent/:adherentId` – blacklist en 1 clic
   - Sécurisé : `authenticate, authorize('admin','president')`

3. **Route enregistrée** dans `backend/server.js`
   ```js
   app.use('/api/blacklist', blacklistRoutes);
   ```

4. **Stats / Dashboard**
   - `backend/routes/stats.js` retourne maintenant :
     ```json
     "blacklist": { "total": 12, "recent": [...] }
     ```

### Frontend
- **API client** : `frontend/js/api.js`
  - `API.blacklist()`, `API.blacklistEntry()`, `API.createBlacklist()`, `API.updateBlacklist()`, `API.deleteBlacklist()`, `API.blacklistAdherent()`

- **Menu** : `frontend/js/app.js`
  - Nouvelle entrée : 🚫 **Blacklist**

- **Vue complète** : `frontend/js/views.js`
  - `Views.blacklistList()` – tableau filtrable (recherche, wilaya, risque), ajout manuel, ajout depuis un adhérent, édition, suppression
  - `blacklistForm()`, `blacklistDetail()`, `pickAdherentToBlacklist()`
  - **Dashboard enrichi** :
    - KPI rouge 🚫 Blacklist
    - Alerte rouge en haut si blacklist > 0
    - Panneau “Blacklist récente” avec les 8 derniers
    - Quick-action “Blacklist” dans les actions rapides
  - **Fiche adhérent** : bouton rouge “🚫 Blacklister” ajouté automatiquement dans la modale détail

## Utilisation

1. Redémarrer l’app :
   ```bash
   npm start
   ```
   La table `blacklist` se crée automatiquement.

2. Connexion admin :
   - admin@opa.dz / Admin@2026
   - president@opa.dz / President@2026

3. Menu **🚫 Blacklist**
   - “+ Ajouter à la blacklist” : saisie manuelle
   - “👥 Choisir un adhérent” : picker + motif + risque
   - Depuis une fiche adhérent : bouton **🚫 Blacklister** en bas à gauche

4. Dashboard
   - KPI Blacklist
   - Alerte rouge
   - Tableau “Blacklist récente”

## Sécurité / Droits
- Réservé **admin & président** uniquement.
- Les comptes “saisie” n’ont pas accès.

## Fichiers modifiés
- `backend/db.js`
- `backend/server.js`
- `backend/routes/stats.js`
- `backend/routes/blacklist.js` **(nouveau)**
- `frontend/js/api.js`
- `frontend/js/app.js`
- `frontend/js/views.js`

---
Prêt pour production XAMPP / MySQL.
