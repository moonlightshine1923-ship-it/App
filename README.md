# OPA — Application de gestion des adhérents (MySQL / XAMPP)

Application web **full-stack** de l'**Organisation des Patronats d'Algérie (OPA)**.
Deux profils connectés — **Administrateur** et **Président** — qui ont **exactement les mêmes droits**.
Les **adhérents ne se connectent pas** : ils déposent leurs demandes depuis le **site web public**.

---

## 🔑 Identifiants de connexion

| Rôle           | Email                | Mot de passe     |
|----------------|----------------------|------------------|
| Administrateur | `admin@opa.dz`       | `Admin@2026`     |
| Président      | `president@opa.dz`   | `President@2026` |

> Vous pouvez changer ces mots de passe dans **Paramètres** une fois connecté.

---

## 🧰 Prérequis
- **Node.js** 18+
- **XAMPP** avec **MySQL/MariaDB** démarré (port 3306)

## 🚀 Démarrage
```bash
# 1) Démarrer MySQL dans le panneau XAMPP
cd opa-app
npm install
npm start            # http://localhost:3000
```
La base `opa_db` se crée automatiquement, avec les tables et des données de démonstration au premier lancement.

### Réinitialiser
Supprimez la base `opa_db` dans phpMyAdmin (ou `DROP DATABASE opa_db;`) puis relancez `npm start`.

---

## 🆕 Changements de cette version
- 📊 **Dashboard** : la « Évolution des adhésions » a été retirée (pas assez d'historique). Restent : répartition par type, traitement des demandes, répartition par wilaya.
- 🆔 **Matricule** : le numéro d'ordre de l'adhérent dans sa wilaya est désormais sur **3 chiffres** → `AGN19-16-045-MA-2026`.
- 📅 **Année d'adhésion** : remplie **automatiquement** à partir de la date d'adhésion (non modifiable).
- ✅ **Tous les champs sont obligatoires** à la création d'un adhérent.
- 🔢 **Contrôles de format** :
  - **NIN** : exactement **18 chiffres**.
  - **Document d'identification** : liste déroulante (à choisir avant le numéro) :
    - **Numéro RC** → exactement **12** caractères
    - **Carte Artisan** → exactement **11** caractères
    - **Numéro d'Agrément** → **10 à 15** caractères
- 🔒 **Unicité** : deux adhérents ne peuvent pas partager le même **NIN**, **téléphone** ou **numéro de document**. (Le nom + prénom identiques restent autorisés.)
- 🌐 **Demandes via le site web** : un formulaire public permet de déposer une demande (nom, prénom, matricule, objet, description, fichiers). La demande est :
  1. **envoyée par email** à la direction,
  2. enregistrée avec le statut **« En attente »**,
  3. **affichée dans l'app** pour l'admin et le président, qui peuvent changer le statut ou supprimer.
- 👥 **Président = Administrateur** : mêmes fonctionnalités pour les deux.
- 💾 **Sauvegarde automatique chaque jeudi à 16h** + bouton de sauvegarde manuelle + téléchargement des sauvegardes.

---

## 🌐 Formulaire de demande pour votre site web

Une page prête à l'emploi est fournie : **`frontend/demande.html`**
(accessible sur `http://localhost:3000/demande.html`).

Pour l'intégrer à **votre site existant**, deux options :

1. **Lien / iframe** vers `http://VOTRE_SERVEUR:3000/demande.html`.
2. **Copier le `<form>`** de `demande.html` dans une page de votre site et faire pointer l'envoi vers l'API :

```js
// Le formulaire envoie un POST multipart vers :
fetch('http://VOTRE_SERVEUR:3000/api/demandes/public', { method: 'POST', body: new FormData(form) });
```
Champs attendus : `nom`, `prenom`, `matricule` (optionnel), `objet`, `description`, `priorite`, `pieces` (fichiers).
> Cette route est **publique** (sans authentification) — c'est volontaire pour le dépôt depuis le site.

### ✉️ Configurer l'envoi des emails (Gmail)
Tout se règle dans **un seul fichier** : `backend/config.js`, section `mail`.

1. Sur le **compte Gmail** qui enverra les emails :
   - Activez la **validation en 2 étapes** (https://myaccount.google.com/security).
   - Créez un **mot de passe d'application** : https://myaccount.google.com/apppasswords
     (choisissez « Autre » → nommez-le « OPA » → Google donne un code de **16 caractères**).
2. Ouvrez `backend/config.js` et renseignez :
```js
mail: {
  enabled: true,
  directionEmail: 'direction.opa@gmail.com',     // boîte qui REÇOIT les demandes
  gmailUser: 'compte.envoi@gmail.com',           // compte Gmail qui ENVOIE
  gmailAppPassword: 'abcd efgh ijkl mnop',       // le mot de passe d'application (16 car.)
},
```
3. Relancez `npm start`. Au démarrage le message **« ✉️ Email prêt … »** confirme que tout fonctionne.
   Si vous voyez un avertissement, vérifiez l'adresse et le mot de passe d'application.

> La demande est **toujours enregistrée** même si l'email échoue ; la réponse du formulaire
> contient `emailSent: true/false` pour indiquer l'état de l'envoi.

---

## 💾 Sauvegarde de la base (anti-perte de données)

- **Automatique** : une sauvegarde est créée **chaque jeudi à 16h00** (réglable dans `backend/config.js` → `backup`).
- **Manuelle** : bouton « 💾 Sauvegarder maintenant » dans **Paramètres** — sauvegarde immédiate à tout moment.
- Chaque sauvegarde crée un fichier nommé **`Sauvegarde bdd opa - AAAA-MM-JJ_HHhMM.sql`** (avec la date) dans le dossier **`opa-app/backups/`**.
- Les **30 dernières** sauvegardes sont conservées (réglable).
- Vous pouvez **télécharger** chaque sauvegarde directement depuis l'écran **Paramètres**.
- La sauvegarde est **100 % autonome** (générée par l'application, sans dépendre de `mysqldump`) → fonctionne tel quel sur XAMPP/Windows.

**Restaurer une sauvegarde** (depuis phpMyAdmin → Importer, ou en ligne de commande) :
```bash
mysql -u root opa_db < "backups/Sauvegarde bdd opa - AAAA-MM-JJ_HHhMM.sql"
```

> 💡 Conseil : copiez régulièrement le dossier `backups/` sur un disque externe ou un cloud pour une vraie sécurité hors-site.

---

## 🆔 Génération du matricule
`AGN19-[CODE_WILAYA]-[NUM_ORDRE 3 chiffres]-[TYPE]-[ANNEE]`
Exemple : `AGN19-31-005-CR-2025`
- Numéro d'ordre **propre à chaque wilaya**, calculé automatiquement.
- Recalculé si wilaya / type / année changent.

---
## 🗄️ Synchronisation avec phpMyAdmin
- **Ajout depuis l'app** → enregistré immédiatement dans MySQL.
- **Ajout direct dans phpMyAdmin** → indiquez au minimum `nom`, `prenom`, `wilaya_code`, `type_code`, `date_adhesion`. À l'ouverture/rafraîchissement de la liste, l'app génère le **matricule** manquant automatiquement.
---

## 🏗️ Architecture
```
opa-app/
├── backend/
│   ├── server.js          # Express + MySQL + sauvegarde + route publique
│   ├── db.js              # pool MySQL + schéma + migrations
│   ├── matricule.js       # génération du matricule (num ordre sur 3 chiffres)
│   ├── mailer.js          # envoi des demandes à la direction
│   ├── backup.js          # sauvegarde hebdomadaire / manuelle
│   ├── seed.js            # données de démonstration
│   ├── data/wilayas.js    # référentiels (wilayas, types, doc types…)
│   ├── middleware/        # auth (JWT), upload (multer)
│   └── routes/            # auth, reference, adherents, demandes, documents, stats
├── frontend/
│   ├── index.html         # application (admin/président)
│   ├── demande.html       # formulaire public pour le site web
│   ├── css/ js/ assets/
├── database/opa_db.sql    # export SQL pour phpMyAdmin
├── backups/               # sauvegardes automatiques (.sql)
└── uploads/               # photos & pièces jointes
```
**Stack** : Node.js + Express 5 · MySQL (mysql2) · JWT + bcrypt · Multer · PDFKit · Nodemailer · Front SPA vanilla JS.
