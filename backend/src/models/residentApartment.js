const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const ResidentApartment = sequelize.define('ResidentApartment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  residentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'residents',
      key: 'id',
    },
  },
  apartmentId: {
    type: DataTypes.STRING(6),
    allowNull: false,
    references: {
      model: 'apartments',
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