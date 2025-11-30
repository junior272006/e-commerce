const express=require('express')
const app=express()
const mongoose=require('mongoose')

mongoose
  .connect('mongodb+srv://junior27nguetta_db_user:kGXspdJtecbU7m7t@cluster0.fjm9rei.mongodb.net/juniorDB?retryWrites=true&w=majority')
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((err) => console.error("Connexion à MongoDB échouée !", err));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json())




module.exports=app