const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const UtilityBill = sequelize.define('UtilityBill', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    address_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'apartments',
            key: 'id'
        }
    },
    date: {
        type: DataTypes.DATE
    },
    water: {
        type: DataTypes.DOUBLE
    },
    electricity: {
        type: DataTypes.DOUBLE
    },
    internet: {
        type: DataTypes.DOUBLE
    },
    payment_status: {
        type: DataTypes.ENUM('PAID', 'UNPAID'),
        defaultValue: 'UNPAID'
    }
}, {
    tableName: 'utility_bills',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = UtilityBill;