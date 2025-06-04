const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('ten_db', 'postgres', 'your_password', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432, // mặc định của PostgreSQL
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Household = require('../models/Household')(sequelize, DataTypes);
db.Resident = require('../models/Resident')(sequelize, DataTypes);
db.Account = require('../models/Account')(sequelize, DataTypes);


module.exports = db;
