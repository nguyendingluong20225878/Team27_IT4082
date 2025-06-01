const express = require('express');
const router = express.Router();
const AccountantController = require('../controllers/AccountantController');

router.get('/fees/:id', AccountantController.getFee);
router.post('/fees', AccountantController.createFee);

module.exports = router;