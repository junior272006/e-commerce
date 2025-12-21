const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" Connexion à MongoDB réussie !"))
  .catch((err) => console.error(" Connexion à MongoDB échouée !", err));

// CORS - TOUJOURS EN PREMIER
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares json/urlencoded EN PREMIER (sauf pour les routes avec Multer)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Imports des routes
const AdminRoute = require('./routes/admin');
const UserRoute = require('./routes/user');
const ContactRoute = require('./routes/contact');
const ProductRoute = require('./routes/product');

// Routes
app.use('/api', UserRoute);
app.use('/api', AdminRoute);
app.use('/api', ContactRoute);
app.use('/api/product', ProductRoute);

module.exports = app;