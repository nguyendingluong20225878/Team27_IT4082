const express = require('express');
const router = express.Router();
const vehicleController = require('../controller/vehicleController');
const { verifyTokenAdmin, verifyToken } = require('../middleware/veritify');

// Vehicle Management (Tổ trưởng/Tổ phó)
router.post('/', verifyTokenAdmin, vehicleController.addVehicle); // UC: Thêm phương tiện
router.get('/', verifyToken, vehicleController.getVehicles); // UC: Truy vấn phí gửi xe (get all vehicles)
router.put('/:id', verifyTokenAdmin, vehicleController.updateVehicle); // UC: Chỉnh sửa loại phương tiện
router.delete('/:id', verifyTokenAdmin, vehicleController.deleteVehicle); // UC: Xóa phương tiện

module.exports = router; 