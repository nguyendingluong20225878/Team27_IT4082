const express = require('express')
const route = express.Router()
const authController = require('../controller/authController');
const {verifyTokenAdmin} = require('../middleware/veritify')
route.post('/register', authController.register)
route.post('/login', authController.login)
route.post('/logout', verifyTokenAdmin,authController.logout)
route.get('/admininfo', verifyTokenAdmin, authController.getUserInfo);
route.put('/updateAdminInfo', verifyTokenAdmin, authController.updateUserInfo);
route.post('/changePassword', verifyTokenAdmin, authController.changeUserPassword);

module.exports = route