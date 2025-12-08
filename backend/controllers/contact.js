const Contact= require('../models/contact')


exports.CreateMessage=(req,res,next) =>{
    const {name,email,sujet,message}= req.body
    console.log('Contenu du message:',req.body)
    .then(()=>{
        const message= new Message (
            {
                name:req.body.name,
                email:req.body.email,
                sujet:req.body.sujet,
                message:req.body.message,
            }
        )
        message.save()
        .then(()=>{res.status(200).json({message:'Message envoyé'})})
        .catch((error)=>{res.status(401).json({error})})
    })
    .catch((error)=>{res.status(401).json({error})})
}