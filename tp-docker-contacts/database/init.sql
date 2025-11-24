-- Créer la base de données (déjà créée par MYSQL_DATABASE, mais on s'assure qu'elle existe)
CREATE DATABASE IF NOT EXISTS contacts_db;

USE contacts_db;

-- Créer la table contacts
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

