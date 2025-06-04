// backend/models/User.js
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const db = require('../config/database');

const User = db.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('Tổ trưởng/Tổ phó', 'Kế toán'),
        allowNull: false,
    },
}, {
    timestamps: true, // Thêm createdAt và updatedAt
    // Hooks để hash mật khẩu trước khi tạo hoặc cập nhật
    hooks: {
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) { // Chỉ hash lại nếu mật khẩu thay đổi
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
    },
});

// Phương thức để so sánh mật khẩu
User.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;