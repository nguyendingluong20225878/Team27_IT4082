const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('bluemoon', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Tắt log SQL để giảm thông tin đầu ra
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

connectDB();

module.exports = sequelize;