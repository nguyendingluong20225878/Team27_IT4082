const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Invoice = sequelize.define('Invoice', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'invoices',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: false
});

module.exports = Invoice; 