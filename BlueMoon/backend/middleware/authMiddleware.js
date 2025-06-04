// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Lấy token từ header
    const token = req.header('x-auth-token');

    // Kiểm tra nếu không có token
    if (!token) {
        return res.status(401).json({ msg: 'Không có token, quyền truy cập bị từ chối' });
    }

    try {
        // Xác thực token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Gán user từ token vào req object
        req.user = decoded.user;
        next(); // Chuyển đến middleware hoặc route tiếp theo
    } catch (err) {
        res.status(401).json({ msg: 'Token không hợp lệ' });
    }
};