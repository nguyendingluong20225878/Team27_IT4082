const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const FeedbackUser = sequelize.define('FeedbackUser', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    reportType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Pending'
    },
    response: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    residentId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'residents',
            key: 'id'
        }
    },
    apartmentId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'apartments',
            key: 'id'
        }
    }
}, {
    tableName: 'feedback_users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    schema: 'public'
});

module.exports = FeedbackUser; 