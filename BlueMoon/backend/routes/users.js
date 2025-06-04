// backend/routes/users.js
const express = require('express');
const bcrypt = require('bcryptjs'); // Để hash mật khẩu nếu tạo/cập nhật thủ công
const User = require('../models/User'); // Import User model
const auth = require('../middleware/authMiddleware'); // Middleware xác thực
const authorize = require('../middleware/authorizeRoles'); // Middleware phân quyền

const router = express.Router();

// @route   GET /api/users
// @desc    Lấy tất cả tài khoản người dùng
// @access  Private (Chỉ Tổ trưởng/Tổ phó)
router.get('/', [auth, authorize('Tổ trưởng/Tổ phó')], async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] } // Không trả về mật khẩu
        });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
});

// @route   POST /api/users
// @desc    Tạo tài khoản người dùng mới
// @access  Private (Chỉ Tổ trưởng/Tổ phó)
router.post('/', [auth, authorize('Tổ trưởng/Tổ phó')], async (req, res) => {
    const { username, password, role } = req.body;

    try {
        let user = await User.findOne({ where: { username } });
        if (user) {
            return res.status(400).json({ msg: 'Tên đăng nhập đã tồn tại' });
        }

        user = await User.create({ username, password, role }); // Hooks trong model sẽ tự hash mật khẩu
        res.status(201).json({ msg: 'Tài khoản được tạo thành công', user: { id: user.id, username: user.username, role: user.role } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
});

// @route   PUT /api/users/:id
// @desc    Cập nhật tài khoản người dùng (bao gồm phân quyền)
// @access  Private (Chỉ Tổ trưởng/Tổ phó)
router.put('/:id', [auth, authorize('Tổ trưởng/Tổ phó')], async (req, res) => {
    const { username, password, role } = req.body;
    const userId = req.params.id;

    try {
        let user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ msg: 'Tài khoản không tìm thấy' });
        }

        // Cập nhật thông tin
        user.username = username || user.username;
        user.role = role || user.role;

        // Nếu có mật khẩu mới, hash nó
        if (password) {
            user.password = password; // Hook beforeUpdate trong model sẽ tự hash
        }

        await user.save(); // Lưu thay đổi

        res.json({ msg: 'Tài khoản đã được cập nhật', user: { id: user.id, username: user.username, role: user.role } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
});

// @route   DELETE /api/users/:id
// @desc    Xóa tài khoản người dùng
// @access  Private (Chỉ Tổ trưởng/Tổ phó)
router.delete('/:id', [auth, authorize('Tổ trưởng/Tổ phó')], async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ msg: 'Tài khoản không tìm thấy' });
        }

        // Không cho phép tài khoản đang đăng nhập tự xóa mình
        if (req.user.id === userId) {
            return res.status(400).json({ msg: 'Không thể xóa tài khoản đang đăng nhập' });
        }

        await user.destroy(); // Xóa người dùng

        res.json({ msg: 'Tài khoản đã được xóa' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
});

module.exports = router;