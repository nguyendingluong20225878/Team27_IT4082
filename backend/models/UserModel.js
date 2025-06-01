const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const ActiveStatus = { ACTIVE: 1, INACTIVE: 0 };

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(255), unique: true, allowNull: false },
    password: { type: DataTypes.STRING(255), allowNull: false },
    is_active: { type: DataTypes.ENUM(...Object.values(ActiveStatus)), defaultValue: ActiveStatus.ACTIVE },
    role: { type: DataTypes.ENUM('admin', 'accountant'), allowNull: false },
  }, { timestamps: false });

  return User;
}
module.exports = User;