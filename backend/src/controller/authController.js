const { User } = require('../models/index');
const { genAccessToken, genRefreshToken } = require('../util/jwt');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
    async register(req, res) {
        const { email, password, name, role, is_active } = req.body;
        try {
            // Validate input
            if (!email || !password || !name) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Email, password and name are required' 
                });
            }

            // Check if user exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Email already exists' 
                });
            }

            // Create user
            const user = await User.create({ 
                email, 
                password, // Password will be hashed by model hook
                name, 
                role: role || 'user',
                is_active: is_active || '1'
            });

            return res.status(201).json({ 
                success: true, 
                message: 'User created successfully',
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
                message: 'Server error', 
                error: error.message 
            });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            // Validate input
            if (!email || !password) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Email and password are required' 
                });
            }

            // Find user
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Invalid email or password' 
                });
            }

            // Check if user is active
            if (user.is_active !== '1') {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Account is inactive' 
                });
            }

            // Verify password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Invalid email or password' 
                });
            }

            // Generate tokens
            const accessToken = genAccessToken(user.id, user.role, user.name, user.email);
            const refreshToken = genRefreshToken(user.id);

            // Update refresh token in database
            await user.update({ refreshToken });

            // Set refresh token cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            // Set cache control headers
            res.set({
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });

            return res.status(200).json({
                success: true,
                message: 'Login successful',
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
                message: 'Server error', 
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
                    message: 'No refresh token found' 
                });
            }

            // Clear refresh token in database
            await User.update(
                { refreshToken: null },
                { where: { refreshToken } }
            );

            // Clear cookie
            res.clearCookie('refreshToken', { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            return res.status(200).json({ 
                success: true, 
                message: 'Logout successful' 
            });
        } catch (error) {
            console.error('Logout error:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Server error', 
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
                    message: 'Refresh token is missing' 
                });
            }

            // Verify refresh token
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            if (!decoded) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Invalid refresh token' 
                });
            }

            // Find user
            const user = await User.findOne({
                where: {
                    id: decoded.id,
                    refreshToken
                }
            });

            if (!user) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Invalid refresh token' 
                });
            }

            // Generate new access token
            const newAccessToken = genAccessToken(user.id, user.role, user.name, user.email);

            return res.status(200).json({
                success: true,
                message: 'Access token refreshed successfully',
                data: { accessToken: newAccessToken }
            });
        } catch (error) {
            console.error('Token refresh error:', error);
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid refresh token' 
            });
        }
    }

    async getUserInfo(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'User ID is required' 
                });
            }

            const user = await User.findByPk(userId, {
                attributes: { exclude: ['password', 'refreshToken'] }
            });

            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'User not found' 
                });
            }

            return res.status(200).json({ 
                success: true, 
                data: user 
            });
        } catch (error) {
            console.error('Get user info error:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Server error', 
                error: error.message 
            });
        }
    }

    async updateUserInfo(req, res) {
        try {
            const userId = req.user?.id;
            const { name, phoneNumber } = req.body;
            if (!userId) {
                return res.status(400).json({ success: false, message: 'Missing user id' });
            }
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            if (name) user.name = name;
            if (phoneNumber) user.phoneNumber = phoneNumber;
            await user.save();
            return res.status(200).json({ success: true, message: 'User info updated successfully', data: user });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error });
        }
    }

    async changeUserPassword(req, res) {
        try {
            const userId = req.user?.id || req.userId || req.body.userId || req.query.userId;
            const { oldPassword, newPassword } = req.body;
            if (!userId || !oldPassword || !newPassword) {
                return res.status(400).json({ success: false, message: 'Missing required fields' });
            }
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Old password is incorrect' });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            await user.save();
            return res.status(200).json({ success: true, message: 'Password changed successfully' });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error });
        }
    }
}

module.exports = new AuthController();