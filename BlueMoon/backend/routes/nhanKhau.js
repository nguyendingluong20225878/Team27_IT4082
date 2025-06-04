// backend/routes/nhanKhau.js
const express = require('express');
const NhanKhau = require('../models/NhanKhau');
const HoKhau = require('../models/HoKhau'); // Cần để kiểm tra hoKhauId
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizeRoles');

const router = express.Router();

// @route   GET /api/nhan-khau/:hoKhauId
// @desc    Lấy tất cả nhân khẩu của một hộ khẩu cụ thể
// @access  Private (Chỉ Tổ trưởng/Tổ phó)
router.get('/:hoKhauId', [auth, authorize('Tổ trưởng/Tổ phó')], async (req, res) => {
    try {
        const nhanKhaus = await NhanKhau.findAll({
            where: { hoKhauId: req.params.hoKhauId },
            order: [['hoVaTen', 'ASC']]
        });
        res.json(nhanKhaus);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
});

// @route   GET /api/nhan-khau/detail/:id
// @desc    Lấy chi tiết một nhân khẩu theo ID của nhân khẩu
// @access  Private (Chỉ Tổ trưởng/Tổ phó)
router.get('/detail/:id', [auth, authorize('Tổ trưởng/Tổ phó')], async (req, res) => {
    try {
        const nhanKhau = await NhanKhau.findByPk(req.params.id);
        if (!nhanKhau) {
            return res.status(404).json({ msg: 'Nhân khẩu không tìm thấy' });
        }
        res.json(nhanKhau);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
});

// @route   POST /api/nhan-khau
// @desc    Tạo mới nhân khẩu cho một hộ khẩu
// @access  Private (Chỉ Tổ trưởng/Tổ phó)
router.post('/', [auth, authorize('Tổ trưởng/Tổ phó')], async (req, res) => {
    const { hoKhauId, hoVaTen, gioiTinh, ngaySinh, cmndCcid, quanHeVoiChuHo, noiLamViec, ngayChuyenDen } = req.body;

    try {
        // Kiểm tra xem HoKhauId có tồn tại không
        const hoKhau = await HoKhau.findByPk(hoKhauId);
        if (!hoKhau) {
            return res.status(404).json({ msg: 'Hộ khẩu không tìm thấy' });
        }

        // Kiểm tra trùng CMND/CCCD nếu có
        if (cmndCcid) {
            const existingNhanKhau = await NhanKhau.findOne({ where: { cmndCcid } });
            if (existingNhanKhau) {
                return res.status(400).json({ msg: 'CMND/CCCD đã tồn tại' });
            }
        }

        const nhanKhau = await NhanKhau.create({
            hoKhauId, hoVaTen, gioiTinh, ngaySinh, cmndCcid, quanHeVoiChuHo, noiLamViec, ngayChuyenDen
        });
        // Hook `afterCreate` trong model NhanKhau sẽ tự động cập nhật soThanhVien của HoKhau
        res.status(201).json(nhanKhau);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
});

// @route   PUT /api/nhan-khau/:id
// @desc    Cập nhật nhân khẩu
// @access  Private (Chỉ Tổ trưởng/Tổ phó)
router.put('/:id', [auth, authorize('Tổ trưởng/Tổ phó')], async (req, res) => {
    const { hoVaTen, gioiTinh, ngaySinh, cmndCcid, quanHeVoiChuHo, noiLamViec, ngayChuyenDen } = req.body;
    const nhanKhauId = req.params.id;

    try {
        let nhanKhau = await NhanKhau.findByPk(nhanKhauId);
        if (!nhanKhau) {
            return res.status(404).json({ msg: 'Nhân khẩu không tìm thấy' });
        }

        // Kiểm tra trùng CMND/CCCD nếu có thay đổi
        if (cmndCcid && cmndCcid !== nhanKhau.cmndCcid) {
            const existingNhanKhau = await NhanKhau.findOne({ where: { cmndCcid } });
            if (existingNhanKhau) {
                return res.status(400).json({ msg: 'CMND/CCCD đã tồn tại' });
            }
        }

        nhanKhau.hoVaTen = hoVaTen || nhanKhau.hoVaTen;
        nhanKhau.gioiTinh = gioiTinh || nhanKhau.gioiTinh;
        nhanKhau.ngaySinh = ngaySinh || nhanKhau.ngaySinh;
        nhanKhau.cmndCcid = cmndCcid || nhanKhau.cmndCcid;
        nhanKhau.quanHeVoiChuHo = quanHeVoiChuHo || nhanKhau.quanHeVoiChuHo;
        nhanKhau.noiLamViec = noiLamViec || nhanKhau.noiLamViec;
        nhanKhau.ngayChuyenDen = ngayChuyenDen || nhanKhau.ngayChuyenDen;

        await nhanKhau.save();
        res.json(nhanKhau);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
});

// @route   DELETE /api/nhan-khau/:id
// @desc    Xóa nhân khẩu
// @access  Private (Chỉ Tổ trưởng/Tổ phó)
router.delete('/:id', [auth, authorize('Tổ trưởng/Tổ phó')], async (req, res) => {
    const nhanKhauId = req.params.id;

    try {
        const nhanKhau = await NhanKhau.findByPk(nhanKhauId);
        if (!nhanKhau) {
            return res.status(404).json({ msg: 'Nhân khẩu không tìm thấy' });
        }

        await nhanKhau.destroy(); // Hook `afterDestroy` trong model NhanKhau sẽ tự động cập nhật soThanhVien của HoKhau
        res.json({ msg: 'Nhân khẩu đã được xóa' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
});

module.exports = router;