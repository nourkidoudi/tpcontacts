const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuration de la base de données
const dbConfig = {
  host: process.env.DB_HOST || 'db-container',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'contacts_db'
};

// Fonction pour créer la connexion
async function getConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    return connection;
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error.message);
    throw error;
  }
}

// Route pour obtenir tous les contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM contacts ORDER BY id DESC');
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des contacts:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour ajouter un contact
app.post('/api/contacts', async (req, res) => {
  try {
    const { nom, email } = req.body;
    
    if (!nom || !email) {
      return res.status(400).json({ error: 'Nom et email sont requis' });
    }

    const connection = await getConnection();
    const [result] = await connection.execute(
      'INSERT INTO contacts (nom, email) VALUES (?, ?)',
      [nom, email]
    );
    await connection.end();
    
    res.json({ id: result.insertId, nom, email });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du contact:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour supprimer un contact
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    await connection.execute('DELETE FROM contacts WHERE id = ?', [id]);
    await connection.end();
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur frontend démarré sur le port ${PORT}`);
  console.log(`Connexion DB: ${dbConfig.host}:${dbConfig.database}`);
});

