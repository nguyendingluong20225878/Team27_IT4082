const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Resident = sequelize.define('Resident', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    permanentResidence: {
        type: DataTypes.STRING,
        allowNull: true
    },
    temporaryResidence: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dob: {
        type: DataTypes.DATEONLY
    },
    gender: {
        type: DataTypes.STRING
    },
    cic: {
        type: DataTypes.STRING
    },
    address_number: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'apartments',
            key: 'address_number'
        }
    },
    status: {
        type: DataTypes.STRING
    },
    status_date: {
        type: DataTypes.DATEONLY
    }
}, {
    tableName: 'residents',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Resident;