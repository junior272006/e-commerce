const path = require('path');
const bcrypt = require('bcryptjs');
const readline = require('readline');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Admin = require('../models/admin');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createAdmin = async () => {
  try {
    console.log('\n CRÉATION ADMINISTRATEUR\n');
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' Connecté à MongoDB\n');

    const email = await question(' Email : ');
    const firstName = await question(' Prénom : ');
    const lastName = await question(' Nom : ');
    const password = await question(' Mot de passe : ');

    if (!email || !firstName || !lastName || !password) {
      console.log('\n Tous les champs sont requis');
      rl.close();
      await mongoose.connection.close();
      process.exit(1);
    }

    if (password.length < 6) {
      console.log('\n Le mot de passe doit contenir au moins 6 caractères');
      rl.close();
      await mongoose.connection.close();
      process.exit(1);
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log('\n Cet email existe déjà');
      rl.close();
      await mongoose.connection.close();
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'admin'
    });

    console.log('\n Admin créé avec succès !');
    console.log(' Email:', email);
    console.log(' Nom:', `${firstName} ${lastName}\n`);

    rl.close();
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n Erreur:', error.message);
    rl.close();
    await mongoose.connection.close();
    process.exit(1);
  }
};

createAdmin();