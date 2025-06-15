const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const UtilityBillFee = sequelize.define('UtilityBillFee', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  utility_bill_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'utility_bill',
      key: 'id',
    },
  },
  fee_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'fees',
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('PAID', 'UNPAID'), // Assuming status for the link
    allowNull: false,
    defaultValue: 'UNPAID',
  },
}, {
  tableName: 'utility_bill_fees',
  timestamps: true,
});

module.exports = UtilityBillFee; 