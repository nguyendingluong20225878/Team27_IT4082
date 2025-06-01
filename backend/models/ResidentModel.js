const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Resident = sequelize.define('Resident', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    dob: DataTypes.DATE,
    gender: DataTypes.STRING(255),
    cic: DataTypes.STRING(255),
    address_number: { type: DataTypes.INTEGER, allowNull: false },
    status: DataTypes.STRING(255),
    status_date: DataTypes.DATE,
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, { timestamps: false });

  return Resident;
};

module.exports = Resident;
