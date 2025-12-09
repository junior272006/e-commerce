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

exports.LoginUser= (req,res,next) =>{
    const {email,password}= req.body
  User.findOne({email:req.body.email})
  .then(user =>{
    if (user===null){
        return res.status(401).json({message:'Erreur de mot de passe'})
    }

    bcrypt.compare(req.body.password,user.password)
    .then(valid=>{
        if(!valid){
              return res.status(401).json({message:'Autorisation refusée'})
        }
        else{
            res.status(200).json({
              id:user._id,
             email:user.email,
             token:jwt.sign(
                   { id: user._id},
              process.env.JWT_SECRET,
              { expiresIn: '24h' }
             )
            })
        }
    })
    .catch(err => res.status(500).json({ message: 'Erreur serveur', error: err.message }))
  })
  .catch(err => res.status(500).json({ message: 'Erreur serveur', error: err.message }))
}



// 📊 GET USER
exports.getUser = (req, res, next) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        phone: req.user.phone,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.UserList = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password -__v")
      .lean(); // Améliore les performances en retournant des objets JS purs
    
    res.status(200).json(users);
  } catch (error) {
    console.error("Erreur UserList:", error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération des utilisateurs", 
      error: error.message 
    });
  }
};
