// backend/models/DotThuPhi.js
const { DataTypes } = require('sequelize');
const db = require('../config/database');
const KhoanThu = require('./KhoanThu'); // Import KhoanThu để định nghĩa quan hệ
const HoKhau = require('./HoKhau'); // Để quản lý chi tiết thu phí cho từng hộ khẩu

const DotThuPhi = db.define('DotThuPhi', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    tenDotThu: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'ten_dot_thu'
    },
    moTa: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'mo_ta'
    },
    ngayBatDau: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'ngay_bat_dau'
    },
    ngayKetThuc: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'ngay_ket_thuc'
    },
    trangThai: { // Ví dụ: Đang diễn ra, Đã kết thúc, Sắp tới
        type: DataTypes.ENUM('Sắp tới', 'Đang diễn ra', 'Đã kết thúc'),
        defaultValue: 'Sắp tới',
        allowNull: false,
        field: 'trang_thai'
    },
    tongTienDuKien: { // Tổng tiền dự kiến thu được (có thể tính toán sau)
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
        allowNull: false,
        field: 'tong_tien_du_kien'
    },
}, {
    tableName: 'dot_thu_phi',
    timestamps: true,
    underscored: true,
});

// Định nghĩa mối quan hệ 1-nhiều: Một Khoản thu có thể xuất hiện trong nhiều Đợt thu phí
// và một Đợt thu phí có thể có nhiều Khoản thu (quan hệ nhiều-nhiều qua bảng trung gian)
// Tuy nhiên, để đơn giản hóa, chúng ta sẽ gán một Khoản thu chính cho mỗi Đợt thu phí
// Hoặc mỗi Đợt thu phí sẽ chứa danh sách các khoản thu con.

// Để phục vụ use case "Lập danh sách thu (cho từng hộ khẩu)", chúng ta cần một bảng trung gian
// để lưu trữ chi tiết việc thu phí của mỗi hộ khẩu trong một đợt thu.

const ChiTietThuPhi = db.define('ChiTietThuPhi', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    soTienPhaiDong: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        field: 'so_tien_phai_dong'
    },
    soTienDaDong: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
        allowNull: false,
        field: 'so_tien_da_dong'
    },
    trangThaiDong: {
        type: DataTypes.ENUM('Chưa đóng', 'Đã đóng một phần', 'Đã đóng đủ'),
        defaultValue: 'Chưa đóng',
        allowNull: false,
        field: 'trang_thai_dong'
    },
    ngayDong: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'ngay_dong'
    },
    ghiChu: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'ghi_chu'
    }
}, {
    tableName: 'chi_tiet_thu_phi',
    timestamps: true,
    underscored: true,
});

// Quan hệ giữa DotThuPhi và KhoanThu: Một đợt thu phí có thể liên quan đến một hoặc nhiều khoản thu.
// Chúng ta sẽ dùng bảng trung gian DotThuPhiKhoanThu để thể hiện quan hệ nhiều-nhiều.
const DotThuPhiKhoanThu = db.define('DotThuPhiKhoanThu', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    giaTriApDung: { // Có thể là mức phí riêng cho đợt này nếu khác với KhoanThu.mucPhi
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'gia_tri_ap_dung'
    }
}, {
    tableName: 'dot_thu_phi_khoan_thu',
    timestamps: false, // Bảng này không cần timestamps
    underscored: true,
});


// Định nghĩa các mối quan hệ
// DotThuPhi có nhiều KhoanThu thông qua DotThuPhiKhoanThu
DotThuPhi.belongsToMany(KhoanThu, { through: DotThuPhiKhoanThu, foreignKey: 'dotThuPhiId', as: 'khoanThus' });
KhoanThu.belongsToMany(DotThuPhi, { through: DotThuPhiKhoanThu, foreignKey: 'khoanThuId', as: 'dotThuPhis' });

// DotThuPhi có nhiều ChiTietThuPhi
DotThuPhi.hasMany(ChiTietThuPhi, {
    foreignKey: 'dotThuPhiId',
    as: 'chiTietThuPhis',
    onDelete: 'CASCADE',
});
ChiTietThuPhi.belongsTo(DotThuPhi, {
    foreignKey: 'dotThuPhiId',
    as: 'dotThuPhi',
});

// HoKhau có nhiều ChiTietThuPhi
HoKhau.hasMany(ChiTietThuPhi, {
    foreignKey: 'hoKhauId',
    as: 'chiTietThuPhis',
    onDelete: 'CASCADE',
});
ChiTietThuPhi.belongsTo(HoKhau, {
    foreignKey: 'hoKhauId',
    as: 'hoKhau',
});

// KhoanThu có nhiều ChiTietThuPhi (để biết chi tiết thu phí này là của khoản thu nào)
KhoanThu.hasMany(ChiTietThuPhi, {
    foreignKey: 'khoanThuId',
    as: 'chiTietThuPhis',
    onDelete: 'CASCADE',
});
ChiTietThuPhi.belongsTo(KhoanThu, {
    foreignKey: 'khoanThuId',
    as: 'khoanThu',
});

module.exports = { DotThuPhi, ChiTietThuPhi, DotThuPhiKhoanThu };