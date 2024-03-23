const { Sequelize } = require("sequelize");
const weddingDefiner = require("../models/Wedding");
const imageDefiner = require("../models/Image");
const attendanceDefiner = require("../models/Attendance");
const participantsDefiner = require("../models/Participants");

require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    // host: process.env.DB_TEMP_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

const Wedding = weddingDefiner(sequelize);
const Image = imageDefiner(sequelize);
const Attendance = attendanceDefiner(sequelize);
const Participants = participantsDefiner(sequelize);

Wedding.hasMany(Image, { foreignKey: "id" });
Wedding.hasMany(Attendance, { foreignKey: "id" });
Wedding.hasMany(Participants, { foreignKey: "id" });

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((err) => {
    console.error("Database synchronization failed:", err);
  });

module.exports = sequelize;
