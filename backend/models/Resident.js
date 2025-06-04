module.exports = (sequelize, DataTypes) => {
  const Resident = sequelize.define('Resident', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
    },
    householdId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Resident;
};