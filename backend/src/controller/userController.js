const { User } = require('../models/index');
const bcrypt = require('bcrypt');

// Create a new user (Tạo mới tài khoản)
const createUser = async (req, res) => {
    try {
        const { email, password, name, role, phoneNumber } = req.body;

        if (!email || !password || !name || !role) {
            return res.status(400).json({ success: false, message: 'Missing required fields: email, password, name, role' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'User with this email already exists' });
        }

        // ❌ KHÔNG cần hash password ở đây nữa (vì model đã làm)
        const newUser = await User.create({
            email,
            password,
            name,
            role,
            phoneNumber: phoneNumber || null,
            is_active: '1' // dùng chuỗi ENUM đúng format
        });

        const userResponse = newUser.toJSON();
        delete userResponse.password;

        res.status(201).json({ success: true, message: 'User created successfully', data: userResponse });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get all users (Truy vấn tài khoản)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password', 'refreshToken'] }
        });
        res.status(200).json({ success: true, message: 'Users fetched successfully', data: users });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password', 'refreshToken'] }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'User fetched successfully', data: user });
    } catch (err) {
        console.error('Error fetching user by ID:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Update user (Chỉnh sửa tài khoản)
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phoneNumber, role, is_active } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (email && email !== user.email) {
            const existingUserWithEmail = await User.findOne({ where: { email } });
            if (existingUserWithEmail) {
                return res.status(409).json({ success: false, message: 'Email already exists for another user' });
            }
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.role = role || user.role;

        if (typeof is_active !== 'undefined') {
            user.is_active = is_active === true || is_active === 'true' || is_active === 1 ? '1' : '0';
        }

        await user.save();

        const userResponse = user.toJSON();
        delete userResponse.password;

        res.status(200).json({ success: true, message: 'User updated successfully', data: userResponse });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Delete user (Xoá tài khoản)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await user.destroy();
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Assign user role (Phân quyền tài khoản)
const assignUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({ success: false, message: 'Role is required' });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.role = role;
        await user.save();

        const userResponse = user.toJSON();
        delete userResponse.password;

        res.status(200).json({ success: true, message: `Role assigned to ${role} successfully`, data: userResponse });
    } catch (err) {
        console.error('Error assigning role:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    assignUserRole,
};
