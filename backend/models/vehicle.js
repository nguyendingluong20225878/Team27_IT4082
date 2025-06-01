const { DataTypes } = require('sequelize');
const sequelize = require('./db'); // kết nối Sequelize

const Vehicle = sequelize.define('Vehicle', {
  licensePlate: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  type: {
    type: DataTypes.ENUM('car', 'motorcycle', 'bicycle'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'vehicles',
  timestamps: false // Vì tự khai báo createdAt
});

module.exports = Vehicle;
