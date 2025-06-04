// backend/middleware/authorizeRoles.js
module.exports = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ msg: 'Không có thông tin vai trò, quyền truy cập bị từ chối' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ msg: 'Bạn không có quyền truy cập chức năng này' });
        }
        next();
    };
};