const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const InvoiceFee = sequelize.define('InvoiceFee', {
    invoice_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        references: {
            model: 'invoices',
            key: 'id'
        }
    },
    fee_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        references: {
            model: 'fees',
            key: 'id'
        }
    }
}, {
    tableName: 'invoice_fee',
    timestamps: false
});

module.exports = InvoiceFee; 