const express = require('express');
const router = express.Router();
const residentController = require('../controller/residentController');
const { verifyTokenAdmin, verifyTokenKetoan, verifyToken } = require('../middleware/veritify');

// Resident (Nhân khẩu) Management (Tổ trưởng/Tổ phó)
router.post('/', verifyTokenAdmin, residentController.createResidents); // UC: Thêm nhân khẩu
router.get('/', verifyToken, residentController.getAllResidentsInApartment); // UC: Truy vấn thông tin NK, Thống kê hộ khẩu (partially)
router.get('/:id', verifyToken, residentController.getResidentById); // UC: Truy vấn thông tin NK
router.put('/:id', verifyTokenAdmin, residentController.updateResident); // UC: Sửa thông tin NK
router.delete('/:id', verifyTokenAdmin, residentController.deleteResident); // UC: Xóa thông tin NK
router.delete('/remove-from-apartment', verifyTokenAdmin, residentController.deleteMember); // UC: Xóa thành viên khỏi căn hộ
router.get('/:id/residence-info', verifyToken, residentController.getUserResidenceInfo);

module.exports = router; 