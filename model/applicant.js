// user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Applicant = sequelize.define('applicant', {
  applicantId: {
    type: DataTypes.INTEGER,
    primaryKey: true, // setting userId as primary key
    autoIncrement: true, // if you want it to auto-increment
  },
  honorifics: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  phoneNo: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  passNo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  passCountry: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dateOfExpiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  dateOfIssue: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  passImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  visaType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  visaPeriod: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  entryType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  previouslyVisited: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  extendAssistance: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  docReady: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  TandCAgree: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  passBio: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  interPolCheck: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  adminApproveStatus: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  submitEmailSentStatus:{
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  approveEmailSentStatus:{
    type: DataTypes.INTEGER,
    allowNull: true,
  }
});

module.exports = Applicant;