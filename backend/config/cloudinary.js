const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Configuration du storage Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    resource_type: 'image', // Spécifie que c'est une image
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }] // Optionnel: limite la taille
  },
});

// Configuration de multer avec limites
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite à 5MB par fichier
  },
  fileFilter: (req, file, cb) => {
    // Vérification du type MIME
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Le fichier doit être une image'), false);
    }
  }
});

module.exports = upload;