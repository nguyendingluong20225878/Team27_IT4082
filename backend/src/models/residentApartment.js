const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const ResidentApartment = sequelize.define('ResidentApartment', {
  id: {
    type: DataTypes.BIGINT, // ĐÃ SỬA: Thay đổi từ UUID sang BIGINT
    primaryKey: true,
    autoIncrement: true, // Thêm autoIncrement
    // defaultValue: DataTypes.UUIDV4, // XÓA DÒNG NÀY (chỉ dành cho UUID)
  },
  residentId: {
    type: DataTypes.BIGINT, // ĐÃ SỬA: Thay đổi từ UUID sang BIGINT
    allowNull: false,
    references: {
      model: 'residents', // Tên bảng (lowercase, plural)
      key: 'id',
    },
  },
  apartmentId: {
    type: DataTypes.BIGINT, // ĐÃ SỬA: Thay đổi từ STRING(6) sang BIGINT
    allowNull: false,
    references: {
      model: 'apartments', // Tên bảng (lowercase, plural)
      key: 'id',
    },
  },
  role_in_family: {
    type: DataTypes.ENUM('Chủ hộ', 'Vợ', 'Chồng', 'Con', 'Ông', 'Bà', 'Khác'),
    allowNull: false,
  },
  is_owner: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  joined_at: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'resident_apartments',
  timestamps: true,
});

module.exports = ResidentApartment;