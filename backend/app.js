const express = require('express');
const cors = require('cors'); // Installez avec: npm install cors
const path = require('path')
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const AdminRoute=require('./routes/admin')
const UserRoute=require('./routes/user')
const ContactRoute=require('./routes/contact')
const ProductRoute=require('./routes/product')
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" Connexion à MongoDB réussie !"))
  .catch((err) => console.error(" Connexion à MongoDB échouée !", err));

// CORS avec le package cors (plus robuste)
app.use(cors({
  origin: '*', // En production, remplacez par votre domaine frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// backend/routes ou dans votre fichier principal (server.js/app.js)

// Endpoint de santé pour réveiller le serveur
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});



app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', UserRoute);
app.use('/api',AdminRoute)
app.use('/api',ContactRoute)
app.use('/api/product',ProductRoute)
module.exports = app;