const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" Connexion à MongoDB réussie !"))
  .catch((err) => console.error(" Connexion à MongoDB échouée !", err));

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());

// Route racine - Important pour tester que le backend fonctionne
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend API fonctionne!',
    status: 'OK',
    endpoints: ['/api/test']
  });
});

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend fonctionne!' });
});

// Ajoutez vos autres routes API ici
// app.post('/api/users', (req, res) => { ... });
// app.get('/api/users', (req, res) => { ... });

module.exports = app;