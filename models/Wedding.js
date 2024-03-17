const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("wedding", {
    // The following specification of the 'id' attribute could be omitted
    // since it is the default.
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    themeColor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    buttonColor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weddingInfo: {
      type: DataTypes.STRING,
    },
    firstDescription: {
      type: DataTypes.STRING,
    },
    secondDescription: {
      type: DataTypes.STRING,
    },
    familyInfo: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    heartInfo: {
      type: DataTypes.STRING,
    },
    locationInfo: {
      type: DataTypes.STRING,
    },
    transportInfo: {
      type: DataTypes.TEXT,
    },
    accountInfo: {
      type: DataTypes.TEXT,
    },
    attendanceMessage: {
      type: DataTypes.STRING,
    },
    finalPhotoColor: {
      type: DataTypes.STRING,
    },
    finalPhotoText: {
      type: DataTypes.STRING,
    },
  });
