const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const InvoicePayment = sequelize.define('InvoicePayment', {
    invoice_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        references: {
            model: 'invoices',
            key: 'id'
        }
    },
    apartment_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        references: {
            model: 'apartments',
            key: 'id'
        }
    },
    fund_amount: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('PAID', 'UNPAID'),
        defaultValue: 'UNPAID'
    }
}, {
    tableName: 'invoice_payment',
    timestamps: false
});

module.exports = InvoicePayment;