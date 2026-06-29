-- ============================================
--  Sauvegarde de la base de données OPA
--  Base : opa_db
--  Date : 21/06/2026 15:49:47
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `matricule` (`matricule`),
  UNIQUE KEY `telephone` (`telephone`),
  UNIQUE KEY `nin` (`nin`),
  UNIQUE KEY `doc_numero` (`doc_numero`),
  UNIQUE KEY `uq_adh_nin` (`nin`),
  UNIQUE KEY `uq_adh_tel` (`telephone`),
  UNIQUE KEY `uq_adh_doc` (`doc_numero`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `adherents` (`id`, `matricule`, `nom`, `prenom`, `nom_ar`, `prenom_ar`, `telephone`, `nin`, `doc_type`, `doc_numero`, `photo`, `wilaya_code`, `type_code`, `niveau`, `num_ordre`, `annee`, `date_adhesion`, `created_at`, `description`) VALUES
(74, 'AGN1916001AD2026', 'Benali', 'Mohamed', 'بن علي', 'محمد', '0550123456', '102345678901234567', 'RC', '123456789101', 'photos/1781699210236-109583101.jpg', '16', 'AD', 'Adhérent Simple', 1, 2026, '2026-06-15', '2026-06-17 13:26:50', NULL),
(75, 'AGN1916002MA2026', 'ouzia', 'lamia', 'أوزية', 'لامية', '0556399369', '123456789101111111', 'RC', '111111111111', 'photos/1781699297434-902888623.jpg', '16', 'MA', 'Membre Actif', 2, 2026, '2026-06-17', '2026-06-17 13:28:17', NULL),
(76, 'AGN1931001AD2026', 'Mansouri', 'Amina', 'منصوري', 'أمينة', '0661987654', '203456789012345678', 'CA', '34567890348', 'photos/1781699538472-98405466.png', '31', 'AD', 'Adhérent Simple', 1, 2026, '2026-03-22', '2026-06-17 13:32:18', NULL),
(77, 'AGN1925002AD2025', 'Khaldi', 'Mourad', 'خالدي', 'مراد', '0770456123', '104567890123456789', 'AG', '456123123456666', 'photos/1781703079628-438642963.jpeg', '25', 'AD', 'Adhérent Simple', 2, 2025, '2025-11-05', '2026-06-17 13:33:54', NULL),
(78, 'AGN1916003AD2026', 'Khaldi', 'Amina', 'اللقب', 'الاسم', '0556230980', '123456789098765433', 'RC', '34567898345', 'photos/1782038016123-891270292.jpg', '16', 'AD', 'Adhérent Gold', 3, 2026, '2026-06-21', '2026-06-21 11:33:36', 'test');

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
  `description` text DEFAULT NULL,
  `type_demande` varchar(150) DEFAULT NULL,
  `priorite` varchar(50) DEFAULT NULL,
  `fichier_joint` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`fichier_joint`)),
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `numero` varchar(30) DEFAULT NULL,
  `statut` varchar(20) NOT NULL DEFAULT 'En attente',
  `affecte_a` varchar(150) DEFAULT NULL,
  `reponse` text DEFAULT NULL,
  `source` varchar(20) DEFAULT 'site',
  PRIMARY KEY (`id`),
  KEY `idx_demandes_site_date_creation` (`date_creation`),
  KEY `idx_demandes_site_matricule` (`matricule`),
  KEY `idx_demandes_site_wilaya` (`wilaya`),
  KEY `idx_demandes_site_type_demande` (`type_demande`),
  KEY `idx_demandes_site_priorite` (`priorite`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `demandes_site` (`id`, `nom`, `prenom`, `matricule`, `wilaya`, `titre_demande`, `description`, `type_demande`, `priorite`, `fichier_joint`, `date_creation`, `numero`, `statut`, `affecte_a`, `reponse`, `source`) VALUES
(1, 'lamia', 'lam', NULL, 'Tizi Ouzou', 'demande de certificat', 'abcde', 'Assistance juridique', 'Normale', '[{"nom_original":"Dossier-Complet.pdf","nom_stocke":"1781516267412-944548621-Dossier-Complet.pdf","mime_type":"application/pdf","taille_octets":3994736,"chemin":"uploads/demandes/1781516267412-944548621-Dossier-Complet.pdf","url":"/uploads/demandes/1781516267412-944548621-Dossier-Complet.pdf"}]', '2026-06-15 10:37:47', 'DEM-2026-0001', 'Clôturée', NULL, NULL, 'site'),
(4, 'Khaldi', 'Amina', NULL, '10 - Bouira', 'الانخراط', 'علبعغبعبنع', 'Assistance juridique', 'Normale', NULL, '2026-06-21 14:45:44', 'DEM-2026-0002', 'En attente', NULL, NULL, 'site'),
(5, 'ouzia', 'lamia', NULL, '09 - Blida', 'demande d''adhesion', NULL, 'Assistance juridique', 'Normale', NULL, '2026-06-21 14:59:22', 'DEM-2026-0003', 'En attente', NULL, NULL, 'site');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  PRIMARY KEY (`id`),
  KEY `fk_doc_adherent` (`adherent_id`),
  CONSTRAINT `fk_doc_adherent` FOREIGN KEY (`adherent_id`) REFERENCES `adherents` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `email`, `password_hash`, `role`, `created_at`) VALUES
(1, 'admin@opa.dz', '$2b$10$M1ARDwtwk3OsNAXf7Mct0uaSB3Zx264y5nO6o3fRWJaxe9PEQxe3W', 'admin', '2026-06-03 10:41:14'),
(2, 'president@opa.dz', '$2b$10$uCEO/CNxiDj.pC6Ko1DCKexVodLYtG8XDLtfTmeWokWg7Po6WWi4C', 'president', '2026-06-03 10:41:14'),
(3, 'agent@opa.dz', '$2b$10$iECk6s7jVAXdpnNCCiwhuuP2hGbeGIgo7GApspDiyFrotLn4fkGoO', 'saisie', '2026-06-09 10:48:04');

SET FOREIGN_KEY_CHECKS=1;
