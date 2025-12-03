const User=require('../models/user')
const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken')

exports.CreateUser= (req,res,next)=>{
    const {firstname,lastname,email,phone,password,confirmPassword}=req.body
    console.log('Données recues:',req.body)
    
    // Validation
    if (!password || password !== confirmPassword) {
        return res.status(400).json({ error: 'Les mots de passe ne correspondent pas' });
    }
    
    bcrypt.hash(password,10)
    .then((hash)=>{
        const user=new User(
            {
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                phone:req.body.phone,
                password:hash,
            }
        )
        user.save()
        .then(()=>{res.status(200).json({message:'Utilisateur créé'})})
        .catch(error => {
          console.log('Erreur:', error);
          if (error.code === 11000) {
            return res.status(400).json({ error: "Cet email existe déjà" });
          }
          res.status(400).json({ error: error.message });
        });
    })
     .catch((error)=>{res.status(400).json({ error: error.message })})
}