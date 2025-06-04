// backend/routes/hoKhau.js
const express = require('express');
const HoKhau = require('../models/HoKhau');
const NhanKhau = require('../models/NhanKhau'); // Cần để include khi lấy dữ liệu
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizeRoles');

const router = express.Router();

// @route   GET /api/ho-khau
// @desc    Lấy tất cả hộ khẩu
// @access  Private (Chỉ Tổ trưởng/Tổ phó)
router.get('/', [auth, authorize('Tổ trưởng/Tổ phó')], async (req, res) => {
    try {
        // Bao gồm cả danh sách nhân khẩu của từng hộ khẩu
        const hoKhaus = await HoKhau.findAll({
            include: [{
                model: NhanKhau,
                as: 'nhanKhaus',
                attributes: { exclude: ['createdAt', 'updatedAt'] } // Loại bỏ các trường này nếu không cần
            }],
            order: [['ngayLap', 'DESC']] // Sắp xếp theo ngày lập mới nhất
        });
        res.json(hoKhaus);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
});

// @route   GET /api/ho-khau/:id
// @desc    Lấy một hộ khẩu theo ID
// @access  Private (Chỉ Tổ trưởng/Tổ phó)
router.get('/:id', [auth, authorize('Tổ trưởng/Tổ phó')], async (req, res) => {
    try {
        const hoKhau = await HoKhau.findByPk(req.params.id, {
            include: [{
                model: NhanKhau,
                as: 'nhanKhaus',
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            }]
        });
        if (!hoKhau) {
            return res.status(404).json({ msg: 'Hộ khẩu không tìm thấy' });
        }
        res.json(hoKhau);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
});

// @route   POST /api/ho-khau
// @desc    Tạo mới hộ khẩu
// @access  Private (Chỉ Tổ trưởng/Tổ phó)
router.post('/', [auth, authorize('Tổ trưởng/Tổ phó')], async (req, res) => {
    const { maHoKhau, diaChi, chuHo, ngayLap } = req.body; // soThanhVien sẽ được tự động tính

    try {
        let hoKhau = await HoKhau.findOne({ where: { maHoKhau } });
        if (hoKhau) {
            return res.status(400).json({ msg: 'Mã hộ khẩu đã tồn tại' });
        }

        hoKhau = await HoKhau.create({
            maHoKhau,
            diaChi,
            chuHo,
            ngayLap,
            soThanhVien: 0 // Khởi tạo 0, sẽ được cập nhật khi thêm nhân khẩu
        });
        res.status(201).json(hoKhau);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
});

// @route   PUT /api/ho-khau/:id
// @desc    Cập nhật hộ khẩu
// @access  Private (Chỉ Tổ trưởng/Tổ phó)
router.put('/:id', [auth, authorize('Tổ trưởng/Tổ phó')], async (req, res) => {
    const { maHoKhau, diaChi, chuHo, ngayLap } = req.body;
    const hoKhauId = req.params.id;

    try {
        let hoKhau = await HoKhau.findByPk(hoKhauId);
        if (!hoKhau) {
            return res.status(404).json({ msg: 'Hộ khẩu không tìm thấy' });
        }

        // Kiểm tra trùng mã hộ khẩu nếu có thay đổi
        if (maHoKhau && maHoKhau !== hoKhau.maHoKhau) {
            const existingHoKhau = await HoKhau.findOne({ where: { maHoKhau } });
            if (existingHoKhau) {
                return res.status(400).json({ msg: 'Mã hộ khẩu đã tồn tại' });
            }
        }

        hoKhau.maHoKhau = maHoKhau || hoKhau.maHoKhau;
        hoKhau.diaChi = diaChi || hoKhau.diaChi;
        hoKhau.chuHo = chuHo || hoKhau.chuHo;
        hoKhau.ngayLap = ngayLap || hoKhau.ngayLap;

        await hoKhau.save();
        res.json(hoKhau);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
});

// @route   DELETE /api/ho-khau/:id
// @desc    Xóa hộ khẩu
// @access  Private (Chỉ Tổ trưởng/Tổ phó)
router.delete('/:id', [auth, authorize('Tổ trưởng/Tổ phó')], async (req, res) => {
    const hoKhauId = req.params.id;

    try {
        const hoKhau = await HoKhau.findByPk(hoKhauId);
        if (!hoKhau) {
            return res.status(404).json({ msg: 'Hộ khẩu không tìm thấy' });
        }

        await hoKhau.destroy(); // NhanKhau liên quan sẽ tự động bị xóa do onDelete: CASCADE
        res.json({ msg: 'Hộ khẩu đã được xóa' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
});

module.exports = router;