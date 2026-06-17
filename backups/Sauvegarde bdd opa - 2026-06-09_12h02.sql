-- ============================================
--  Sauvegarde de la base de données OPA
--  Base : opa_db
--  Date : 09/06/2026 12:02:53
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `matricule` (`matricule`),
  UNIQUE KEY `telephone` (`telephone`),
  UNIQUE KEY `nin` (`nin`),
  UNIQUE KEY `doc_numero` (`doc_numero`),
  UNIQUE KEY `uq_adh_nin` (`nin`),
  UNIQUE KEY `uq_adh_tel` (`telephone`),
  UNIQUE KEY `uq_adh_doc` (`doc_numero`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `adherents` (`id`, `matricule`, `nom`, `prenom`, `nom_ar`, `prenom_ar`, `telephone`, `nin`, `doc_type`, `doc_numero`, `photo`, `wilaya_code`, `type_code`, `niveau`, `num_ordre`, `annee`, `date_adhesion`, `created_at`) VALUES
(49, 'AGN19-16-002-MA-2026', 'belkacmi', 'lamia', 'بوضياف', 'محمد', '0776567446', '642542456546545756', 'RC', '445634563456', 'photos/1780844923873-474259484.jpg', '16', 'MA', 'Adhérent Simple', 2, 2026, '2026-06-05 23:00:00', '2026-06-07 15:08:43'),
(50, 'AGN19-15-001-MA-2026', 'boukhedouma', 'saida', 'بوخدومة', 'سعيدة', '0776567433', '123456789098765445', 'RC', '123456789023', 'photos/1780998656480-807945207.jpg', '15', 'MA', 'Adhérent Simple', 1, 2026, '2026-06-08 23:00:00', '2026-06-09 09:50:56');

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
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero` (`numero`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(1, 'admin@opa.dz', '$2b$10$M1ARDwtwk3OsNAXf7Mct0uaSB3Zx264y5nO6o3fRWJaxe9PEQxe3W', 'admin', '2026-06-03 09:41:14'),
(2, 'president@opa.dz', '$2b$10$uCEO/CNxiDj.pC6Ko1DCKexVodLYtG8XDLtfTmeWokWg7Po6WWi4C', 'president', '2026-06-03 09:41:14'),
(3, 'agent@opa.dz', '$2b$10$iECk6s7jVAXdpnNCCiwhuuP2hGbeGIgo7GApspDiyFrotLn4fkGoO', 'saisie', '2026-06-09 09:48:04');

SET FOREIGN_KEY_CHECKS=1;
