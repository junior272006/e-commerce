const express=require('express')
const router=express.Router()
const Ctrl=require('../controllers/user')
const auth=require('../middleware/auth').authUser


router.post('/user/signup',Ctrl.CreateUser)
router.post('/user/login',auth,Ctrl.LoginUser)
router.get('/user/me',Ctrl.getUser)

module.exports=router