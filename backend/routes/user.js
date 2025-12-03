const express=require('express')
const router=express.Router()
const Ctrl=require('../controllers/user')

router.post('/user/signup',Ctrl.CreateUser)



module.exports=router