const { Sequelize } = require("sequelize");
const weddingDefiner = require("../models/Wedding");
const imageDefiner = require("../models/Image");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

const Wedding = weddingDefiner(sequelize);
const Image = imageDefiner(sequelize);

Wedding.hasMany(Image, { foreignKey: "id" });

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((err) => {
    console.error("Database synchronization failed:", err);
  });

module.exports = sequelize;
