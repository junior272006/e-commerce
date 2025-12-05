const jwt=require('jsonwebtoken')
const Admin=require('../models/admin')

exports.auth = async(req,res,next) => {

    try{
const token=req.header('Authorization')?.replace('Bearer','')

if (!token){
    return res.status(401).json({message:'Accès non autorisé'})

}

const decoded=jwt.verify(token,process.env.JWT_SECRET)
const admin= await Admin.findById(decoded.id)

if (!admin) {
      return res.status(401).json({ message: 'Admin non trouvé.' });
    }

    req.admin=admin
    req.token=token
    next()
    }
    catch{
 res.status(401).json({ message: 'Token invalide ou expiré.' });
    }
}