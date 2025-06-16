const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { verifyTokenAdmin, verifyTokenKetoan, verifyToken } = require('../middleware/veritify');

// User Management
router.get('/', verifyTokenAdmin, userController.getAllUsers);
router.post('/', verifyTokenAdmin, userController.createUser);
router.put('/:id', verifyTokenAdmin, userController.updateUser);
router.delete('/:id', verifyTokenAdmin, userController.deleteUser);
router.get('/:id', verifyTokenAdmin, userController.getUserById);

module.exports = router; 