const Admin = require("../models/admin");
const bcrypt= require('bcrypt')
const jwt=require('jsonwebtoken')
exports.CreateAdmin= (req,res,next) => {
console.log("Données recues:" ,req.body)
   const {firstname, lastname, email, phone, password, confirmPassword,shopName,siret, address} =req.body
bcrypt.hash(password,5)
.then((hash)=>{
    const admin= new Admin ({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email:req.body.email,
        phone:req.body.phone,
        password:hash,
        confirmPassword:req.body.confirmPassword,
        shopName:req.body.shopName,
        siret:req.body.siret,
        address:req.body.address

    })
    admin.save()
    .then(()=>{
        console.log("Administrateur enregistré")
        res.status(200).json({message:'Utilisateur créé'})
    })
     .catch(error => {
          console.log('Erreur:', error);
          if (error.code === 11000) {
            return res.status(400).json({ error: "Cet email existe déjà" });
          } //cela remplace le unique validator
          res.status(400).json({ error: error.message });
        });
})
.catch((error)=>{res.status(400).json(error)})
}
