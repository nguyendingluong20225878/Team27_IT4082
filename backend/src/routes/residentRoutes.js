const express = require('express');
const router = express.Router();
const residentController = require('../controller/residentController');
const { verifyTokenAdmin, verifyTokenKetoan, verifyToken } = require('../middleware/veritify');

// ✅ Lấy toàn bộ danh sách nhân khẩu (DÙNG CHO ResidentPage.jsx)
router.get('/all', verifyTokenAdmin, residentController.getAllResidents);

// Quản lý nhân khẩu (Resident Management)
router.post('/', verifyTokenAdmin, residentController.createResidents);                 // UC: Thêm nhân khẩu
router.get('/', verifyToken, residentController.getAllResidentsInApartment);           // UC: Truy vấn NK trong căn hộ
router.get('/:id', verifyToken, residentController.getResidentById);                   // UC: Truy vấn thông tin NK
router.put('/:id', verifyTokenAdmin, residentController.updateResident);               // UC: Sửa thông tin NK
router.delete('/:id', verifyTokenAdmin, residentController.deleteResident);            // UC: Xóa nhân khẩu
router.delete('/remove-from-apartment', verifyTokenAdmin, residentController.deleteMember); // UC: Xóa khỏi hộ khẩu
router.get('/:id/residence-info', verifyToken, residentController.getUserResidenceInfo);   // UC: Xem thông tin cư trú

module.exports = router;
