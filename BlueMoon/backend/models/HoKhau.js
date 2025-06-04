// backend/models/HoKhau.js
const { DataTypes } = require('sequelize');
const db = require('../config/database');

const HoKhau = db.define('HoKhau', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    maHoKhau: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'ma_ho_khau' // Tên cột trong DB
    },
    diaChi: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'dia_chi'
    },
    chuHo: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'chu_ho'
    },
    soThanhVien: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'so_thanh_vien'
    },
    ngayLap: {
        type: DataTypes.DATEONLY, // Chỉ ngày, không có thời gian
        allowNull: false,
        field: 'ngay_lap'
    },
}, {
    tableName: 'ho_khau', // Đặt tên bảng trong DB
    timestamps: true, // `createdAt`, `updatedAt`
    underscored: true, // Use snake_case for automatically generated attributes
});

module.exports = HoKhau;