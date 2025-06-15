const express = require('express');
const router = express.Router();
const invoiceController = require('../controller/invoiceController');
const { verifyTokenKetoan, verifyToken } = require('../middleware/veritify');

// Invoice (Đợt thu phí) Management (Kế toán)
router.post('/', verifyTokenKetoan, invoiceController.createInvoice); // UC: Tạo mới đợt thu
router.get('/', verifyTokenKetoan, invoiceController.getAllInvoices); // UC: Truy vấn đợt thu
router.get('/:id', verifyTokenKetoan, invoiceController.getInvoiceById);
router.put('/:id', verifyTokenKetoan, invoiceController.updateInvoice);
router.delete('/:id', verifyTokenKetoan, invoiceController.deleteInvoice);
router.post('/payments', verifyTokenKetoan, invoiceController.createInvoicePayment); // UC: Tạo khoản nộp của hộ
router.get('/payments', verifyTokenKetoan, invoiceController.getAllInvoicePayments); // UC: Truy vấn đợt thu (payments)
router.put('/payments/:id', verifyTokenKetoan, invoiceController.updateInvoicePayment); // UC: Chỉnh sửa khoản nộp của hộ
router.delete('/payments/:id', verifyTokenKetoan, invoiceController.deleteInvoicePayment); // UC: Xóa khoản nộp của hộ
router.get('/unpaid-apartments', verifyTokenKetoan, invoiceController.getUnpaidApartments); // UC: Thống kê đợt thu (unpaid)
router.get('/unpaid-apartment-details', verifyTokenKetoan, invoiceController.getUnpaidApartmentDetails); // UC: Thống kê đợt thu (details)
router.post('/generate-monthly-fees', verifyTokenKetoan, invoiceController.createRequiredFeeServiceForMonth); // UC: Tạo đợt thu phí
router.put('/payments/update-status', verifyTokenKetoan, invoiceController.updatePayment); // UC: Cập nhật trạng thái thanh toán

module.exports = router; 