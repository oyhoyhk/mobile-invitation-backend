const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("attendance", {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
