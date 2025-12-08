const Contact = require('../models/contact');

exports.CreateMessage = (req, res, next) => {
    const { name, email, sujet, message } = req.body;
    console.log('Contenu du message:', req.body);
    
    
    const newContact = new Contact({
        name: name,
        email: email,
        sujet: sujet,
        message: message
    });
    
   
    newContact.save()
        .then(() => {
            res.status(200).json({ message: 'Message envoyé avec succès' });
        })
        .catch((error) => {
            console.error('Erreur lors de la sauvegarde:', error);
            res.status(500).json({ 
                error: 'Erreur lors de l\'envoi du message',
                details: error.message 
            });
        });
};