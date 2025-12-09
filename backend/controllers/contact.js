const Contact = require('../models/contact');

exports.CreateMessage = async (req, res) => {
  try {
    const { name, email, sujet, message } = req.body;

    console.log('Contenu du message:', req.body);

    const contact = new Contact({ name, email, sujet, message });

    await contact.save();

    res.status(200).json({ message: 'Message envoyé avec succès' });

  } catch (error) {
    console.error('Erreur CreateMessage:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors de l\'envoi du message',
      details: error.message 
    });
  }
};


exports.MessageList= async (req,res,next) =>{
  try{
const contacts= await Contact.find()
.lean()
res.status(200).json(contacts)
  }

  catch (error) {
 console.error("Erreur UserList:", error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération des utilisateurs", 
      error: error.message 
    });
  }
}