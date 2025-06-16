const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Apartment = sequelize.define('Apartment', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    address_number: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true
    },
    area: {
        type: DataTypes.DOUBLE
    },
    status: {
        type: DataTypes.ENUM('Resident', 'Business', 'Vacant'),
        allowNull: false
    },
    owner_id: {
        type: DataTypes.BIGINT
    },
    owner_phone_number: {
        type: DataTypes.BIGINT
    },
    number_of_members: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'apartments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Apartment;