const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Fee = require('./FeeModel');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  feeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Fee,
      key: 'id',
    },
  },
  amountPaid: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  method: {
    type: DataTypes.ENUM('cash', 'bank', 'online'),
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'payments',
});

// Thiết lập quan hệ 1-n giữa Fee và Payment
Fee.hasMany(Payment, { foreignKey: 'feeId' });
Payment.belongsTo(Fee, { foreignKey: 'feeId' });

module.exports = Payment;