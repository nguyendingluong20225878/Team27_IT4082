const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Fee = sequelize.define('Fee', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name : { type: DataTypes.STRING(255), allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false,},
  type: { type: DataTypes.ENUM('monthly', 'one-time'),allowNull: false, },
    
  description: {type: DataTypes.STRING,allowNull: true,},
  dueDate: { type: DataTypes.DATE, allowNull: false, },
  status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'active', },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
}, {
  tableName: 'fees',
  timestamps: false, // Vì đã có createdAt tự định nghĩa
})

module.exports = Fee;
