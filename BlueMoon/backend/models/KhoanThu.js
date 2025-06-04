// backend/models/KhoanThu.js
const { DataTypes } = require('sequelize');
const db = require('../config/database');

const KhoanThu = db.define('KhoanThu', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    tenKhoanThu: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Tên khoản thu nên là duy nhất
        field: 'ten_khoan_thu'
    },
    moTa: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'mo_ta'
    },
    mucPhi: {
        type: DataTypes.DECIMAL(10, 2), // Ví dụ: 10 chữ số tổng, 2 chữ số sau dấu phẩy
        allowNull: false,
        defaultValue: 0,
        field: 'muc_phi'
    },
    donVi: { // Đơn vị tính: Ví dụ: /người, /hộ, /m2, /tháng
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'don_vi'
    },
    batBuoc: { // Là khoản thu bắt buộc hay không
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'bat_buoc'
    },
}, {
    tableName: 'khoan_thu',
    timestamps: true,
    underscored: true,
});

module.exports = KhoanThu;