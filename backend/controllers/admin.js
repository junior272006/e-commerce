const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 🔐 LOGIN ADMIN
exports.LoginAdmin = (req, res, next) => {
  const { email, password } = req.body;

  Admin.findOne({ email: email, role: 'admin' })
    .then(admin => {
      if (!admin) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
      }

      bcrypt.compare(password, admin.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
          }

          res.status(200).json({
            id: admin._id,
            email: admin.email,
            firstname: admin.firstname,
            lastname: admin.lastname,
            role: admin.role,
            token: jwt.sign(
              { id: admin._id, role: admin.role },
              process.env.JWT_SECRET,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(err => res.status(500).json({ message: 'Erreur serveur', error: err.message }));
    })
    .catch(err => res.status(500).json({ message: 'Erreur serveur', error: err.message }));
};

// 📊 GET ADMIN
exports.getAdmin = (req, res, next) => {
  try {
    res.json({
      admin: {
        id: req.admin._id,
        email: req.admin.email,
        firstname: req.admin.firstname,
        lastname: req.admin.lastname,
        role: req.admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
