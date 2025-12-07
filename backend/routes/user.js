const express = require('express');
const router = express.Router();
const Ctrl = require('../controllers/user');
const { authUser } = require('../middleware/auth');

router.post('/user/signup', Ctrl.CreateUser);
router.post('/user/login', Ctrl.LoginUser); 
router.get('/user/me', authUser, Ctrl.getUser);

module.exports = router;