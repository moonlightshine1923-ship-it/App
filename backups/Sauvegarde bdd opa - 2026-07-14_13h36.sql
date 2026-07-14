-- ============================================
--  Sauvegarde de la base de données OPA
--  Base : opa_db
--  Date : 14/07/2026 13:36:26
-- ============================================

SET FOREIGN_KEY_CHECKS=0;
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS `opa_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `opa_db`;

-- --------------------------------------------
-- Table : adherents
-- --------------------------------------------
DROP TABLE IF EXISTS `adherents`;
CREATE TABLE `adherents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `matricule` varchar(40) DEFAULT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `nom_ar` varchar(100) DEFAULT NULL,
  `prenom_ar` varchar(100) DEFAULT NULL,
  `telephone` varchar(30) DEFAULT NULL,
  `nin` varchar(18) DEFAULT NULL,
  `doc_type` varchar(2) DEFAULT 'RC',
  `doc_numero` varchar(20) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `wilaya_code` varchar(5) NOT NULL DEFAULT '16',
  `type_code` varchar(2) NOT NULL DEFAULT 'AD',
  `niveau` varchar(40) DEFAULT 'Adhérent Simple',
  `num_ordre` int(11) DEFAULT 0,
  `annee` int(11) DEFAULT 0,
  `date_adhesion` date DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `description` text DEFAULT NULL,
  `fichier_final` varchar(255) DEFAULT NULL,
  `dossier_pdf` varchar(255) DEFAULT NULL,
  `paiement_mode` text DEFAULT NULL,
  `paiement_banque` text DEFAULT NULL,
  `paiement_ref` text DEFAULT NULL,
  `bureau_code` varchar(3) DEFAULT NULL,
  `bureau_badge_type` varchar(100) DEFAULT NULL,
  `etoiles` tinyint(4) DEFAULT 0,
  `carte_remise` tinyint(1) DEFAULT 0,
  `top_month_rank` int(11) DEFAULT NULL,
  `top_year_rank` int(11) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `whatsapp` varchar(30) DEFAULT NULL,
  `viber` varchar(30) DEFAULT NULL,
  `adresse_personnelle` text DEFAULT NULL,
  `doc_numero_2` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `matricule` (`matricule`),
  UNIQUE KEY `telephone` (`telephone`),
  UNIQUE KEY `nin` (`nin`),
  UNIQUE KEY `doc_numero` (`doc_numero`),
  UNIQUE KEY `uq_adh_nin` (`nin`),
  UNIQUE KEY `uq_adh_tel` (`telephone`),
  UNIQUE KEY `uq_adh_doc` (`doc_numero`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `adherents` (`id`, `matricule`, `nom`, `prenom`, `nom_ar`, `prenom_ar`, `telephone`, `nin`, `doc_type`, `doc_numero`, `photo`, `wilaya_code`, `type_code`, `niveau`, `num_ordre`, `annee`, `date_adhesion`, `created_at`, `description`, `fichier_final`, `dossier_pdf`, `paiement_mode`, `paiement_banque`, `paiement_ref`, `bureau_code`, `bureau_badge_type`, `etoiles`, `carte_remise`, `top_month_rank`, `top_year_rank`, `email`, `whatsapp`, `viber`, `adresse_personnelle`, `doc_numero_2`) VALUES
(75, 'AGN1916002MA2026', 'ouzia', 'lamia', 'أوزية', 'لامية', '0556399369', '123456789101111111', 'RC', '111111111111', 'photos/1781699297434-902888623.jpg', '16', 'MA', 'Membre Actif', 2, 2026, '2026-06-17', '2026-06-17 13:28:17', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(79, 'AGN1916003AD2026', 'boukhedouma', 'saida', 'بوخدومة', 'سعيدة', '0556230980', '104567890123456789', 'RC', '345678903452', 'photos/1782647494928-577806717.jpg', '16', 'AD', 'Adhérent Simple', 3, 2026, '2026-06-28', '2026-06-28 12:51:34', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(80, 'AGN1916006AD2025', 'Mansouri', 'Mourad', 'اللقب', 'الاسم', '0661987654', '104567890123454546', 'RC', '34567898345', 'photos/1782830901132-832041729.jpeg', '16', 'AD', 'Adhérent Simple', 6, 2025, '2025-05-16', '2026-06-28 12:52:44', '', NULL, NULL, 'espece', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(82, 'AGN1916005MA2026', 'Benali', 'Amina', 'بن علي', 'أمينة', '0556230922', '657890453655556423', 'AG', '34567898345666', 'photos/1782648183975-874049994.png', '16', 'MA', 'Membre Actif', 5, 2026, '2026-06-28', '2026-06-28 12:53:49', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(83, 'AGN1913003AD2026', 'Khaldi', 'saida', 'خالدي', 'سعيدة', '0770456123', '123456789098765433', 'RC', '456123123459', 'photos/1783344385085-2482105.png', '13', 'AD', 'Adhérent Gold', 3, 2026, '2026-07-06', '2026-06-28 15:29:10', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(84, 'AGN1915003CR2026', 'ouzia', 'Amina', 'أوزية', 'أمينة', '0770456126', '657890453657896478', 'CA', '34567890346', 'photos/1783333872548-247874963.png', '15', 'CR', 'Conseiller', 3, 2026, '2026-07-14', '2026-06-28 15:43:26', 'this person is special', NULL, NULL, 'espece', NULL, NULL, NULL, NULL, 2, 1, 1, 1, NULL, NULL, NULL, NULL, NULL),
(85, 'AGN1915ABCBE2026', 'sidi said', 'abd erahmane', 'سيدي سعيد', 'عبد الرحمان', '0770456112', '200456789017345633', 'RC', '345678983466', 'photos/1782814839842-251509760.jpg', '15', 'BE', 'Bureau exécutif', 0, 2026, '2026-06-30', '2026-06-30 11:20:39', '', NULL, NULL, NULL, NULL, NULL, 'ABC', 'الاسم', 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(86, 'AGN1916007AD2026', 'ahmed', 'zarhouni', 'أحمد', 'زرهوني', '0556230988', '123456789098765445', 'RC', '345678903345', 'photos/1783512038950-795329334.png', '16', 'AD', 'Adhérent Simple', 7, 2026, '2026-07-08', '2026-07-08 13:00:38', 'hhhhhhhhhhhhhhhhhhhhhhhh', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, 0, NULL, NULL, 'ahmedzarhouni@gmail.com', '0556230980', NULL, 'abcdefg', NULL);

-- --------------------------------------------
-- Table : audit_logs
-- --------------------------------------------
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `user_email` varchar(150) DEFAULT NULL,
  `action_type` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `target_id` varchar(50) DEFAULT NULL,
  `target_type` varchar(50) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_audit_user` (`user_id`),
  CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `audit_logs` (`id`, `user_id`, `user_email`, `action_type`, `description`, `target_id`, `target_type`, `ip_address`, `created_at`) VALUES
(1, 2, 'president@opa.dz', 'PRINT_CARTE', 'Génération/Impression de la carte d''adhérent pour zarhouni ahmed (Matricule: AGN1916007AD2026)', '86', 'adherent', '::1', '2026-07-14 09:20:22'),
(2, 2, 'president@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour zarhouni ahmed (Matricule: AGN1916007AD2026)', '86', 'adherent', '::1', '2026-07-14 09:20:30'),
(3, 2, 'president@opa.dz', 'EDIT_USER_PASSWORD', 'Réinitialisation du mot de passe de l''utilisateur admin@opa.dz', '1', 'user', '::1', '2026-07-14 09:20:55'),
(4, 1, 'admin@opa.dz', 'LOGIN', 'Connexion de l''utilisateur admin@opa.dz', NULL, NULL, '::1', '2026-07-14 09:39:13'),
(5, 1, 'admin@opa.dz', 'EDIT_ADHERENT', 'Mise à jour de l''adhérent Amina ouzia (Matricule: AGN1915003CR2026)', '84', 'adherent', '::1', '2026-07-14 09:39:51'),
(6, 2, 'president@opa.dz', 'LOGIN', 'Connexion de l''utilisateur president@opa.dz', NULL, NULL, '::1', '2026-07-14 09:39:56'),
(7, 2, 'president@opa.dz', 'LOGIN', 'Connexion de l''utilisateur president@opa.dz', NULL, NULL, '::1', '2026-07-14 09:53:55'),
(8, 1, 'admin@opa.dz', 'LOGIN', 'Connexion de l''utilisateur admin@opa.dz', NULL, NULL, '::1', '2026-07-14 10:57:23'),
(9, 1, 'admin@opa.dz', 'EDIT_USER_PASSWORD', 'Réinitialisation du mot de passe de l''utilisateur agent2@opa.dz', '9', 'user', '::1', '2026-07-14 10:57:37'),
(10, 9, 'agent2@opa.dz', 'LOGIN', 'Connexion de l''utilisateur agent2@opa.dz', NULL, NULL, '::1', '2026-07-14 10:57:55'),
(11, 9, 'agent2@opa.dz', 'LOGIN', 'Connexion de l''utilisateur agent2@opa.dz', NULL, NULL, '::1', '2026-07-14 11:01:47'),
(12, 1, 'admin@opa.dz', 'LOGIN', 'Connexion de l''utilisateur admin@opa.dz', NULL, NULL, '::1', '2026-07-14 11:06:41'),
(13, 9, 'agent2@opa.dz', 'LOGIN', 'Connexion de l''utilisateur agent2@opa.dz', NULL, NULL, '::1', '2026-07-14 11:06:50'),
(14, 9, 'agent2@opa.dz', 'LOGIN', 'Connexion de l''utilisateur agent2@opa.dz', NULL, NULL, '::1', '2026-07-14 11:17:47'),
(15, 9, 'agent2@opa.dz', 'LOGIN', 'Connexion de l''utilisateur agent2@opa.dz', NULL, NULL, '::1', '2026-07-14 11:17:48'),
(16, 9, 'agent2@opa.dz', 'LOGIN', 'Connexion de l''utilisateur agent2@opa.dz', NULL, NULL, '::1', '2026-07-14 11:19:09'),
(17, 9, 'agent2@opa.dz', 'LOGIN', 'Connexion de l''utilisateur agent2@opa.dz', NULL, NULL, '::1', '2026-07-14 11:19:09'),
(18, 9, 'agent2@opa.dz', 'LOGIN', 'Connexion de l''utilisateur agent2@opa.dz', NULL, NULL, '::1', '2026-07-14 11:50:36'),
(19, 9, 'agent2@opa.dz', 'LOGIN', 'Connexion de l''utilisateur agent2@opa.dz', NULL, NULL, '::1', '2026-07-14 12:57:56'),
(20, 2, 'president@opa.dz', 'LOGIN', 'Connexion de l''utilisateur president@opa.dz', NULL, NULL, '::1', '2026-07-14 13:00:13');

-- --------------------------------------------
-- Table : blacklist
-- --------------------------------------------
DROP TABLE IF EXISTS `blacklist`;
CREATE TABLE `blacklist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `adherent_id` int(11) DEFAULT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `matricule` varchar(40) DEFAULT NULL,
  `telephone` varchar(30) DEFAULT NULL,
  `nin` varchar(18) DEFAULT NULL,
  `wilaya_code` varchar(5) DEFAULT NULL,
  `motif` text DEFAULT NULL,
  `niveau_risque` enum('faible','moyen','élevé','critique') DEFAULT 'moyen',
  `date_blacklist` date DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_blacklist_adherent` (`adherent_id`),
  KEY `fk_blacklist_user` (`created_by`),
  KEY `idx_blacklist_matricule` (`matricule`),
  KEY `idx_blacklist_nom` (`nom`,`prenom`),
  CONSTRAINT `fk_blacklist_adherent` FOREIGN KEY (`adherent_id`) REFERENCES `adherents` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_blacklist_user` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `blacklist` (`id`, `adherent_id`, `nom`, `prenom`, `matricule`, `telephone`, `nin`, `wilaya_code`, `motif`, `niveau_risque`, `date_blacklist`, `created_by`, `created_at`, `updated_at`) VALUES
(3, NULL, 'ahmed', 'zarhouni', NULL, NULL, NULL, NULL, NULL, 'moyen', '2026-07-09', 1, '2026-07-09 09:08:42', '2026-07-09 09:08:42');

-- --------------------------------------------
-- Table : demande_pieces
-- --------------------------------------------
DROP TABLE IF EXISTS `demande_pieces`;
CREATE TABLE `demande_pieces` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `demande_id` int(11) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_piece_dem` (`demande_id`),
  CONSTRAINT `fk_piece_dem` FOREIGN KEY (`demande_id`) REFERENCES `demandes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------
-- Table : demandes
-- --------------------------------------------
DROP TABLE IF EXISTS `demandes`;
CREATE TABLE `demandes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `numero` varchar(30) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `matricule` varchar(40) DEFAULT NULL,
  `objet` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `priorite` varchar(20) NOT NULL DEFAULT 'Normale',
  `statut` varchar(20) NOT NULL DEFAULT 'En attente',
  `affecte_a` varchar(150) DEFAULT NULL,
  `reponse` text DEFAULT NULL,
  `source` varchar(20) DEFAULT 'site',
  `adherent_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp(),
  `email` varchar(150) DEFAULT NULL,
  `telephone` varchar(30) DEFAULT NULL,
  `wilaya_code` varchar(5) DEFAULT NULL,
  `type_demande` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero` (`numero`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------
-- Table : demandes_site
-- --------------------------------------------
DROP TABLE IF EXISTS `demandes_site`;
CREATE TABLE `demandes_site` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(120) NOT NULL,
  `prenom` varchar(120) NOT NULL,
  `matricule` varchar(80) DEFAULT NULL,
  `wilaya` varchar(120) NOT NULL,
  `titre_demande` varchar(255) NOT NULL,
  `priorite` varchar(50) DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `numero` varchar(30) DEFAULT NULL,
  `statut` varchar(20) NOT NULL DEFAULT 'En attente',
  `reponse` text DEFAULT NULL,
  `source` varchar(20) DEFAULT 'site',
  `num_tel` varchar(20) DEFAULT NULL,
  `affecte_a` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_demandes_site_date_creation` (`date_creation`),
  KEY `idx_demandes_site_matricule` (`matricule`),
  KEY `idx_demandes_site_wilaya` (`wilaya`),
  KEY `idx_demandes_site_priorite` (`priorite`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `demandes_site` (`id`, `nom`, `prenom`, `matricule`, `wilaya`, `titre_demande`, `priorite`, `date_creation`, `numero`, `statut`, `reponse`, `source`, `num_tel`, `affecte_a`) VALUES
(4, 'Khaldi', 'Amina', NULL, '10 - Bouira', 'الانخراط', 'Normale', '2026-06-21 14:45:44', 'DEM-2026-0002', 'En attente', NULL, 'site', NULL, NULL),
(6, 'qqqq', 'qqqqqqqq', NULL, '10 - Bouira', 'qqqqqqqq', 'Normale', '2026-06-23 11:37:23', 'DEM-2026-0003', 'En attente', NULL, 'site', NULL, NULL),
(7, 'boukhedouma', 'saida', NULL, '10 - Bouira', 'qqqqqqqq', 'Normale', '2026-06-23 11:39:36', 'DEM-2026-0004', 'Résolue', NULL, 'site', NULL, NULL),
(13, 'lamia', 'lam', NULL, '15 - Tizi Ouzou', 'Demande de contact', 'Normale', '2026-06-24 16:40:14', 'DEM-2026-0004', 'En attente', NULL, 'site', '0553456789', NULL);

-- --------------------------------------------
-- Table : demandes_site_pieces
-- --------------------------------------------
DROP TABLE IF EXISTS `demandes_site_pieces`;
CREATE TABLE `demandes_site_pieces` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `demande_id` int(11) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_demande_site_id` (`demande_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `demandes_site_pieces` (`id`, `demande_id`, `filename`, `original_name`, `created_at`) VALUES
(1, 7, 'documents/1782211176567-747419740.png', 'default_square.png', '2026-06-23 11:39:36');

-- --------------------------------------------
-- Table : documents
-- --------------------------------------------
DROP TABLE IF EXISTS `documents`;
CREATE TABLE `documents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `adherent_id` int(11) DEFAULT NULL,
  `titre` varchar(200) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_adherent_doc` (`adherent_id`),
  CONSTRAINT `fk_doc_adherent` FOREIGN KEY (`adherent_id`) REFERENCES `adherents` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_documents_adherents` FOREIGN KEY (`adherent_id`) REFERENCES `adherents` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `documents` (`id`, `adherent_id`, `titre`, `filename`, `original_name`, `created_at`, `updated_at`) VALUES
(16, 80, 'Dossier Complet Fusionné', 'uploads/documents/complet_80_1782655874917.pdf', 'Commissions OPA.PDF, Dossier â AGN1916005MA2026.pdf', '2026-06-28 15:11:15', '2026-06-28 15:11:15'),
(17, 75, 'Dossier Complet Fusionné', 'uploads/documents/complet_75_1782655878188.pdf', 'Dossier â AGN1916005MA2026.pdf', '2026-06-28 15:11:18', '2026-06-28 15:11:18'),
(19, 83, 'Dossier Complet Fusionné', 'uploads/documents/complet_83_1782657216947.pdf', 'guide_hebergement_cpanel.pdf', '2026-06-28 15:33:36', '2026-06-28 15:33:36'),
(21, 79, 'Dossier Complet Fusionné', 'uploads/documents/complet_79_1782657552434.pdf', 'Dossier â AGN1916005MA2026.pdf', '2026-06-28 15:39:12', '2026-06-28 15:39:12'),
(22, 82, 'Dossier Complet Fusionné', 'uploads/documents/complet_82_1783334019530.pdf', 'Badge BE model.pdf, model carte gold.pdf, model carte simple.pdf', '2026-06-28 15:42:11', '2026-07-06 11:33:39');

-- --------------------------------------------
-- Table : pages
-- --------------------------------------------
DROP TABLE IF EXISTS `pages`;
CREATE TABLE `pages` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(160) NOT NULL,
  `nom_page` varchar(255) NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pages_slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=158 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `pages` (`id`, `slug`, `nom_page`, `date_creation`, `date_modification`) VALUES
(1, 'index', 'Accueil', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(2, 'actualites', 'Actualités', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(3, 'albums', 'Albums', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(4, 'article-1', 'Article 1', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(5, 'article-2', 'Article 2', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(6, 'article-3', 'Article 3', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(7, 'article-4', 'Article 4', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(8, 'article-5', 'Article 5', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(9, 'article-6', 'Article 6', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(10, 'article-7', 'Article 7', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(11, 'b2b', 'B2B', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(12, 'conference', 'Conférence', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(13, 'contribution-opa', 'Contribution OPA', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(14, 'loi-et-reglement', 'Loi et règlement', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(15, 'mot-president', 'Mot du président', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(16, 'seminaire', 'Séminaire', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(17, 'startup', 'Startup', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(18, 'statut', 'Statut', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(19, 'demandes', 'Demandes', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(20, 'devenir-membre', 'Devenir membre', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(21, 'organisation-opa', 'Organisation OPA', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(64, 'navbar', 'Navbar', '2026-06-15 10:53:24', '2026-06-15 10:53:24'),
(65, 'footer', 'Footer', '2026-06-15 10:53:24', '2026-06-15 10:53:24');

-- --------------------------------------------
-- Table : users
-- --------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL,
  `permissions` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `email`, `password_hash`, `role`, `permissions`, `created_at`) VALUES
(1, 'admin@opa.dz', '$2b$10$M5S37W5KZ4nM2i79dXpJCulnqc4jgYFpBXwdAc3QUsC9oDrpsPofm', 'admin', NULL, '2026-06-03 10:41:14'),
(2, 'president@opa.dz', '$2b$10$uCEO/CNxiDj.pC6Ko1DCKexVodLYtG8XDLtfTmeWokWg7Po6WWi4C', 'president', NULL, '2026-06-03 10:41:14'),
(9, 'agent2@opa.dz', '$2b$10$W/2F3c6GbaBPbi0MnmsgNu.p3FQZVLegV4UTOX26TEwxkfSwNuupS', 'saisie', '["adherents_add"]', '2026-07-12 15:09:14');

SET FOREIGN_KEY_CHECKS=1;
