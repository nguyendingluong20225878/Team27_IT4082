// backend/routes/khoanThu.js
const express = require('express');
const KhoanThu = require('../models/KhoanThu');
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizeRoles');

const router = express.Router();

// @route   GET /api/khoan-thu
// @desc    Lấy tất cả khoản thu
// @access  Private (Chỉ Kế toán)
router.get('/', [auth, authorize('Kế toán')], async (req, res) => {
    try {
        const khoanThus = await KhoanThu.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(khoanThus);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
});

// @route   POST /api/khoan-thu
// @desc    Tạo mới khoản thu
// @access  Private (Chỉ Kế toán)
router.post('/', [auth, authorize('Kế toán')], async (req, res) => {
    const { tenKhoanThu, moTa, mucPhi, donVi, batBuoc } = req.body;

    try {
        let khoanThu = await KhoanThu.findOne({ where: { tenKhoanThu } });
        if (khoanThu) {
            return res.status(400).json({ msg: 'Tên khoản thu đã tồn tại' });
        }

        khoanThu = await KhoanThu.create({
            tenKhoanThu, moTa, mucPhi, donVi, batBuoc
        });
        res.status(201).json(khoanThu);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
});

// @route   PUT /api/khoan-thu/:id
// @desc    Cập nhật khoản thu
// @access  Private (Chỉ Kế toán)
router.put('/:id', [auth, authorize('Kế toán')], async (req, res) => {
    const { tenKhoanThu, moTa, mucPhi, donVi, batBuoc } = req.body;
    const khoanThuId = req.params.id;

    try {
        let khoanThu = await KhoanThu.findByPk(khoanThuId);
        if (!khoanThu) {
            return res.status(404).json({ msg: 'Khoản thu không tìm thấy' });
        }

        // Kiểm tra trùng tên khoản thu nếu có thay đổi
        if (tenKhoanThu && tenKhoanThu !== khoanThu.tenKhoanThu) {
            const existingKhoanThu = await KhoanThu.findOne({ where: { tenKhoanThu } });
            if (existingKhoanThu) {
                return res.status(400).json({ msg: 'Tên khoản thu đã tồn tại' });
            }
        }

        khoanThu.tenKhoanThu = tenKhoanThu || khoanThu.tenKhoanThu;
        khoanThu.moTa = moTa !== undefined ? moTa : khoanThu.moTa; // Cho phép cập nhật thành null/empty string
        khoanThu.mucPhi = mucPhi || khoanThu.mucPhi;
        khoanThu.donVi = donVi || khoanThu.donVi;
        khoanThu.batBuoc = batBuoc !== undefined ? batBuoc : khoanThu.batBuoc;

        await khoanThu.save();
        res.json(khoanThu);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
});

// @route   DELETE /api/khoan-thu/:id
// @desc    Xóa khoản thu
// @access  Private (Chỉ Kế toán)
router.delete('/:id', [auth, authorize('Kế toán')], async (req, res) => {
    const khoanThuId = req.params.id;

    try {
        const khoanThu = await KhoanThu.findByPk(khoanThuId);
        if (!khoanThu) {
            return res.status(404).json({ msg: 'Khoản thu không tìm thấy' });
        }

        // TODO: Thêm logic kiểm tra xem khoản thu này có đang được sử dụng trong Đợt thu phí nào không
        // Nếu có, có thể không cho xóa hoặc cảnh báo

        await khoanThu.destroy();
        res.json({ msg: 'Khoản thu đã được xóa' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
});

module.exports = router;