const express = require("express");
const app = express();
const cors = require("cors");
const port = 4000;
const { models } = require("./sequelize");
const multer = require("multer");
const formData = require("express-form-data");
const fs = require("fs");

const fileIndex = {};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fileIndex[req.body.id + "-" + file.fieldname]) {
      fileIndex[req.body.id + "-" + file.fieldname] = 1;
    }
    const uploadDir = "uploads/";
    // 디렉토리가 존재하지 않으면 생성
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    if (!fs.existsSync(uploadDir + req.body.id)) {
      fs.mkdirSync(uploadDir + req.body.id, { recursive: true });
    }
    cb(null, uploadDir + req.body.id);
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").pop();
    cb(
      null,
      req.body.id +
        "-" +
        file.fieldname +
        "-" +
        fileIndex[req.body.id + "-" + file.fieldname]++ +
        "." +
        ext
    );
  },
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const upload = multer({ storage: storage });
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", async (req, res) => {
  res.send("Hello World!");
});
app.post("/api/wedding", upload.any(), async (req, res) => {
  // FormData에 있는 데이터들을 꺼내어 console에 출력

  const {
    id,
    themeColor,
    name,
    weddingInfo,
    date,
    locationInfo,
    firstDescription,
    secondDescription,
    familyInfo,
    transportInfo,
    accountInfo,
    attendanceMessage,
    finalPhotoColor,
    finalPhotoText,
  } = req.body;

  await models.wedding.create({
    id,
    themeColor,
    name,
    weddingInfo,
    date,
    locationInfo,
    firstDescription,
    secondDescription,
    familyInfo,
    transportInfo,
    accountInfo,
    attendanceMessage,
    finalPhotoColor,
    finalPhotoText,
  });

  await models.image.bulkCreate(
    req.files.map((file) => ({
      id,
      url: file.path,
    }))
  );

  res.status(200).send("FormData received successfully.");
});

app.get("/api/wedding", async (req, res) => {
  const weddings = await models.wedding.findAll({
    attributes: ["id"],
  });
  console.log(weddings);
  res.status(200).send(weddings);
});

app.get("/api/wedding/:id", async (req, res) => {
  const wedding = await models.wedding.findOne({
    where: {
      id: req.params.id,
    },
    include: {
      model: models.image,
      attributes: ["url"],
    },
  });
  res.status(200).send(wedding);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
