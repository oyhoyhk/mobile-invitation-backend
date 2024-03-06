const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("image", {
    id: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
  });
