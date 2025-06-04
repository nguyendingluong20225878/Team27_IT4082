// backend/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User model

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Kiểm tra username
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({ msg: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
        }

        // 2. So sánh mật khẩu
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
        }

        // 3. Tạo JWT Payload
        const payload = {
            user: {
                id: user.id,
                role: user.role, // Thêm vai trò vào payload
            },
        };

        // 4. Ký token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }, // Token hết hạn sau 1 giờ
            (err, token) => {
                if (err) throw err;
                // Trả về token, vai trò và username cho frontend
                res.json({ token, role: user.role, username: user.username });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi server');
    }
});

// @route   GET /api/auth/check-auth
// @desc    Check if user is authenticated and get user info (for frontend to verify token)
// @access  Private (middleware will be added later for other routes)
router.get('/check-auth', async (req, res) => {
    // This route is typically protected by a middleware that verifies the token.
    // For now, we'll just send a dummy response.
    // We'll add the actual middleware later.
    res.status(200).json({ msg: 'Authenticated', user: { id: req.user.id, role: req.user.role } });
});


module.exports = router;