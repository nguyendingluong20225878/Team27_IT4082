const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Vehicle = sequelize.define('Vehicle', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    licensePlate: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'license_plate'
    },
    type: {
        type: DataTypes.ENUM('car', 'motorcycle', 'bicycle'),
        allowNull: false
    },
    apartmentId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'apartment_id',
        references: {
            model: 'apartments',
            key: 'id'
        }
    },
    amount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    }
}, {
    tableName: 'vehicles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Vehicle;
