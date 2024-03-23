const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("participant", {
    id: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    idx: {
      allowNull: true,
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    receiver: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    meal: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
