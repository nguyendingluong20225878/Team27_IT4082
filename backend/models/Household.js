// models/Household.js
module.exports = (sequelize, DataTypes) => {
  const Household = sequelize.define('Household', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    address_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
    },
  });

  return Household;
};
