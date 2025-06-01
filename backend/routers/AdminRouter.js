const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');

router.get('/households/:id', AdminController.getHousehold);
router.post('/households', AdminController.createHousehold);
router.put('/households/:id', AdminController.updateHousehold);
router.delete('/households/:id', AdminController.deleteHousehold);

module.exports = router;