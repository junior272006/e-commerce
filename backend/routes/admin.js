const express=require('express')
const router= express.Router()
const Ctrl=require('../controllers/admin')
const auth=require('../middleware/auth').auth
const isadmin=require('../middleware/isadmin').isAdmin
router.post('/admin/login',Ctrl.LoginAdmin)
router.get('/admin/me',auth,isadmin,Ctrl.getAdmin)


module.exports=router