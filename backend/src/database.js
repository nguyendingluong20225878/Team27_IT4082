const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'ktpm_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || '251004',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Test database connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully.');
    } catch (err) {
        console.error('❌ Unable to connect to the database:', err);
        process.exit(1);
    }
};

testConnection();

module.exports = sequelize;
