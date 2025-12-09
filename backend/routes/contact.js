const express=require('express')
const router=express.Router()
const Ctrl= require('../controllers/contact')

router.post('/message',Ctrl.CreateMessage)
router.get('/message/liste',Ctrl.MessageList)



module.exports= router