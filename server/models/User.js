const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false }, // bcrypt hash
  role: {
    type: DataTypes.ENUM('FleetManager', 'Driver', 'SafetyOfficer', 'FinancialAnalyst'),
    allowNull: false,
  },
  status: { type: DataTypes.ENUM('Active', 'Inactive'), defaultValue: 'Active' },
});

module.exports = User;
