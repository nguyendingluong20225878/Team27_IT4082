const express = require('express');
const router = express.Router();
const apartmentController = require('../controller/apartmentController');
const { verifyTokenAdmin, verifyTokenKetoan, verifyToken } = require('../middleware/veritify');

// Apartment (Hộ khẩu) Management (Tổ trưởng/Tổ phó)
router.get('/', verifyToken, apartmentController.getApartmentResidentsInfo);
router.post('/', verifyTokenAdmin, apartmentController.createApartment);
router.put('/:id', verifyTokenAdmin, apartmentController.updateApartment);
router.delete('/:id', verifyTokenAdmin, apartmentController.deleteApartment);
router.get('/unoccupied', verifyToken, apartmentController.getApartmentUnactive);
router.get('/active', verifyToken, apartmentController.getApartmentInuse);
router.post('/add-resident', verifyTokenAdmin, apartmentController.addApartmentAndResident); // UC: Thêm hộ khẩu
router.get('/total', verifyToken, apartmentController.getTotalApartments);

module.exports = router; 