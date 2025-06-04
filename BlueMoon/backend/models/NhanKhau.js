// backend/models/NhanKhau.js
const { DataTypes } = require('sequelize');
const db = require('../config/database');
const HoKhau = require('./HoKhau'); // Import HoKhau model để định nghĩa quan hệ

const NhanKhau = db.define('NhanKhau', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    hoVaTen: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'ho_va_ten'
    },
    gioiTinh: {
        type: DataTypes.ENUM('Nam', 'Nữ', 'Khác'),
        allowNull: false,
        field: 'gioi_tinh'
    },
    ngaySinh: {
        type: DataTypes.DATEONLY, // Chỉ ngày
        allowNull: false,
        field: 'ngay_sinh'
    },
    cmndCcid: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true, // Có thể null nếu chưa có CMND/CCCD
        field: 'cmnd_cccd'
    },
    quanHeVoiChuHo: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'quan_he_voi_chu_ho'
    },
    noiLamViec: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'noi_lam_viec'
    },
    ngayChuyenDen: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'ngay_chuyen_den'
    },
}, {
    tableName: 'nhan_khau',
    timestamps: true,
    underscored: true,
    hooks: {
        afterCreate: async (nhanKhau, options) => {
            // Tăng số lượng thành viên trong HoKhau khi một NhanKhau được tạo
            await HoKhau.increment('soThanhVien', { by: 1, where: { id: nhanKhau.hoKhauId }, transaction: options.transaction });
        },
        afterDestroy: async (nhanKhau, options) => {
            // Giảm số lượng thành viên trong HoKhau khi một NhanKhau bị xóa
            await HoKhau.decrement('soThanhVien', { by: 1, where: { id: nhanKhau.hoKhauId }, transaction: options.transaction });
        },
    }
});

// Định nghĩa mối quan hệ 1-nhiều: Một Hộ khẩu có nhiều Nhân khẩu
HoKhau.hasMany(NhanKhau, {
    foreignKey: 'hoKhauId', // Tên cột khóa ngoại trong bảng NhanKhau
    as: 'nhanKhaus', // Alias khi include (e.g., HoKhau.findAll({ include: 'nhanKhaus' }))
    onDelete: 'CASCADE', // Khi HoKhau bị xóa, các NhanKhau liên quan cũng bị xóa
});
NhanKhau.belongsTo(HoKhau, {
    foreignKey: 'hoKhauId',
    as: 'hoKhau',
});

module.exports = NhanKhau;