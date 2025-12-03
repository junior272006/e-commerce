const express = require('express');
const cors = require('cors'); // Installez avec: npm install cors
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const AdminRoute = require('./routes/admin');
const UserRoute=require('./routes/user')
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" Connexion à MongoDB réussie !"))
  .catch((err) => console.error(" Connexion à MongoDB échouée !", err));

// CORS avec le package cors (plus robuste)
app.use(cors({
  origin: '*', // En production, remplacez par votre domaine frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/api', AdminRoute);
app.use('/api', UserRoute);

module.exports = app;