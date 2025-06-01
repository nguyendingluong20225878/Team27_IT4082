const { DataTypes } = require('sequelize');

const ResidentType = { RESIDENT: 'Resident', BUSINESS: 'Business', VACANT: 'Vacant' };

module.exports = (sequelize) => {
  const Apartment = sequelize.define('Apartment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    address_number: { type: DataTypes.INTEGER, allowNull: false },
    area: DataTypes.FLOAT,
    status: { type: DataTypes.ENUM(...Object.values(ResidentType)), allowNull: false },
    owner_id: { type: DataTypes.INTEGER, allowNull: true },
    owner_phone_number: DataTypes.BIGINT,
    number_of_members: DataTypes.INTEGER,
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, { timestamps: false });

  return Apartment;
};

module.exports = Apartment;
