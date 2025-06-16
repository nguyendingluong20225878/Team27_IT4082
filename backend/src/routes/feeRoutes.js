const express = require('express');
const router = express.Router();
const feeController = require('../controller/feeController');
const { verifyTokenAdmin, verifyTokenKetoan, verifyToken } = require('../middleware/veritify');

// Fee Management
router.get('/', verifyToken, feeController.getFee);
router.post('/', verifyTokenKetoan, feeController.createFee);          // ✅ Cho kế toán thêm
router.put('/:id', verifyTokenKetoan, feeController.updateFee);       // ✅ Cho kế toán sửa
router.delete('/:id', verifyTokenKetoan, feeController.deleteFee);    // ✅ Cho kế toán xóa
router.get('/collection', verifyToken, feeController.getFeeCollectionData);
router.get('/distribution', verifyToken, feeController.getFeeTypeDistribution);
router.get('/summary', verifyToken, feeController.getFeeSummary);
router.post('/import', verifyTokenKetoan, feeController.importFeeFromExcel); // ✅ Import Excel cũng dành cho kế toán

module.exports = router;
