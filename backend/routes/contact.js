const express=require('express')
const router=express.Router()
const Ctrl= require('../controllers/contact')

router.post('/message',Ctrl.CreateMessage)




module.exports= router