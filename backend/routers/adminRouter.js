const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

// Household routes
router.post('/household', adminController.addHousehold);
router.put('/household/:householdId', adminController.updateHousehold);
router.delete('/household/:householdId', adminController.deleteHousehold);
router.get('/household', adminController.queryHouseholdInfo);
router.get('/household/statistics', adminController.getHouseholdStatistics);

module.exports = router;
