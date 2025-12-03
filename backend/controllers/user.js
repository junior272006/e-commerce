const User=require('../models/user')
const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken')

exports.CreateUser= (req,res,next)=>{
    const {firstname,lastname,email,phone,password,confirmPassword}=req.body
    console.log('Données recues:',req.body)
    bcrypt.hash(password,5)
    .then((hash)=>{
        const user=new User(
            {
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                phone:req.body.phone,
                password:hash,
                confirmPassword:req.body.confirmPassword,
            }
        )
        user.Save()
        .then(()=>{res.status(200).json({message:'Utilisateur créé'})})
        .catch(error => {
          console.log('Erreur:', error);
          if (error.code === 11000) {
            return res.status(400).json({ error: "Cet email existe déjà" });
          } //cela remplace le unique validator
          res.status(400).json({ error: error.message });
        });
    })
     .cath((error)=>{res.status(400).json(error)})
}

