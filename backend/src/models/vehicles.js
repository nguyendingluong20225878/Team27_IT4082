const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Vehicle = sequelize.define('Vehicle', {
    license_plate: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    type: {
        type: DataTypes.ENUM('car', 'motorcycle', 'bicycle'),
        allowNull: false
    },
    apartment_id: {
        type: DataTypes.BIGINT,
        references: {
            model: 'apartments',
            key: 'id'
        }
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