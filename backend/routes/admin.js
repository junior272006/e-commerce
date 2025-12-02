const express=require('express')
const router=express.Router()
const Ctrl= require('../controllers/admin')

router.post('/admin/signup',Ctrl.CreateAdmin)



module.exports=router