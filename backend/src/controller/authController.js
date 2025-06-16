const { User } = require('../models/index');
const { genAccessToken, genRefreshToken } = require('../util/jwt');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
    async register(req, res) {
        const { email, password, name, role, is_active } = req.body;
        try {
            if (!email || !password || !name) {
                return res.status(400).json({
                    success: false,
                    message: 'Email, password và name là bắt buộc'
                });
            }

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email đã tồn tại'
                });
            }

            // KHÔNG hash ở đây nữa → để model xử lý qua beforeCreate
            const user = await User.create({
                email,
                password,
                name,
                role: role || 'user',
                is_active: is_active === true || is_active === '1' ? '1' : '0'
            });

            return res.status(201).json({
                success: true,
                message: 'Tạo tài khoản thành công',
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Register error:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi máy chủ',
                error: error.message
            });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email và mật khẩu là bắt buộc'
                });
            }

            // --- DEBUG LOGS START ---
            console.log(`[LOGIN DEBUG] Request Body - Email: "${email}", Password (raw): "${password}"`);
            // --- DEBUG LOGS END ---

            const user = await User.findOne({ where: { email } });
            if (!user) {
                console.log(`[LOGIN DEBUG] User with email "${email}" not found.`);
                return res.status(401).json({
                    success: false,
                    message: 'Email hoặc mật khẩu không đúng'
                });
            }

            // --- DEBUG LOGS START ---
            console.log(`[LOGIN DEBUG] User found: ${user.email}`);
            console.log(`[LOGIN DEBUG] Stored Hashed Password: "${user.password}"`);
            // --- DEBUG LOGS END ---

            if (String(user.is_active) !== '1') {
                console.log(`[LOGIN DEBUG] User ${user.email} is inactive.`);
                return res.status(401).json({
                    success: false,
                    message: 'Tài khoản đã bị vô hiệu hóa'
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            // --- DEBUG LOGS START ---
            console.log(`[LOGIN DEBUG] bcrypt.compare result for "${email}": ${isMatch}`);
            // --- DEBUG LOGS END ---

            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Email hoặc mật khẩu không đúng'
                });
            }

            const accessToken = genAccessToken(user.id, user.role, user.name, user.email);
            const refreshToken = genRefreshToken(user.id);

            await user.update({ refreshToken });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.set({
                'Cache-Control': 'no-store',
                'Pragma': 'no-cache',
                'Expires': '0'
            });

            return res.status(200).json({
                success: true,
                message: 'Đăng nhập thành công',
                data: {
                    accessToken,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi máy chủ',
                error: error.message
            });
        }
    }

    async logout(req, res) {
        try {
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    message: 'Không tìm thấy refresh token'
                });
            }

            await User.update({ refreshToken: null }, { where: { refreshToken } });

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            return res.status(200).json({
                success: true,
                message: 'Đăng xuất thành công'
            });
        } catch (error) {
            console.error('Logout error:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi máy chủ',
                error: error.message
            });
        }
    }

    async resetAccessToken(req, res) {
        try {
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({
                    success: false,
                    message: 'Thiếu refresh token'
                });
            }

            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const user = await User.findOne({
                where: { id: decoded.id, refreshToken }
            });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Refresh token không hợp lệ'
                });
            }

            const newAccessToken = genAccessToken(user.id, user.role, user.name, user.email);

            return res.status(200).json({
                success: true,
                message: 'Tạo mới access token thành công',
                data: { accessToken: newAccessToken }
            });
        } catch (error) {
            console.error('Token refresh error:', error);
            return res.status(401).json({
                success: false,
                message: 'Refresh token không hợp lệ'
            });
        }
    }

    async getUserInfo(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin người dùng'
                });
            }

            const user = await User.findByPk(userId, {
                attributes: { exclude: ['password', 'refreshToken'] }
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy người dùng'
                });
            }

            return res.status(200).json({ success: true, data: user });
        } catch (error) {
            console.error('Get user info error:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi máy chủ',
                error: error.message
            });
        }
    }

    async updateUserInfo(req, res) {
        try {
            const userId = req.user?.id;
            const { name, phoneNumber } = req.body;

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
            }

            if (name) user.name = name;
            if (phoneNumber) user.phoneNumber = phoneNumber;
            await user.save();

            return res.status(200).json({ success: true, message: 'Cập nhật thông tin thành công', data: user });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Lỗi máy chủ', error });
        }
    }

    async changeUserPassword(req, res) {
        try {
            const userId = req.user?.id || req.userId || req.body.userId || req.query.userId;
            const { oldPassword, newPassword } = req.body;

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
            }

            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Mật khẩu cũ không đúng' });
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedNewPassword;
            await user.save();

            return res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công' });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Lỗi máy chủ', error });
        }
    }
}

module.exports = new AuthController();