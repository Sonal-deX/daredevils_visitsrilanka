const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('visit_srilanka_db', 'root', '', {
  host: process.env.DB_HOST,
  dialect: 'mysql', // or any other dialect
  port:4000
});

module.exports = sequelize;