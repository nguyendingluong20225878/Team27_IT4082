const express = require('express');
const router = express.Router();
const feeController = require('../controller/feeController');
const { verifyTokenAdmin, verifyTokenKetoan, verifyToken } = require('../middleware/veritify');

// Fee Management
router.get('/', verifyToken, feeController.getFee);
router.post('/', verifyTokenAdmin, feeController.createFee);
router.put('/:id', verifyTokenAdmin, feeController.updateFee);
router.delete('/:id', verifyTokenAdmin, feeController.deleteFee);
router.get('/collection', verifyToken, feeController.getFeeCollectionData);
router.get('/distribution', verifyToken, feeController.getFeeTypeDistribution);
router.get('/summary', verifyToken, feeController.getFeeSummary);
router.post('/import', verifyTokenAdmin, feeController.importFeeFromExcel);

module.exports = router; 