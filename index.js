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
    const id = req.body.id;
    if (!fileIndex[req.body.id + "-" + file.fieldname]) {
      fileIndex[req.body.id + "-" + file.fieldname] = 1;
    }
    const uploadDir = "uploads/";
    // 디렉토리가 존재하지 않으면 생성
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    if (!fs.existsSync(uploadDir + id)) {
      fs.mkdirSync(uploadDir + id, { recursive: true });
    }
    cb(null, uploadDir + id);
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
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
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
    themeColor,
    buttonColor,
    name,
    weddingInfo,
    date,
    heartInfo,
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

  let id = generateKey();

  let result = await models.wedding.findOne({
    where: {
      id,
    },
  });

  while (result.length !== 0) {
    id = generateKey();
    result = await models.wedding.findOne({
      where: {
        id,
      },
    });
  }

  await models.wedding.create({
    id,
    themeColor: themeColor || "#cccccc",
    buttonColor,
    name,
    weddingInfo,
    date,
    heartInfo,
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
    attributes: ["id", "name", "createdAt"],
  });
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
  return res.status(200).send(wedding);
});

app.post("/api/attendance", async (req, res) => {
  const { id, receiver, name, tel, memo, meal, count } = req.body;
  try {
    await models.participant.create({
      id,
      receiver,
      name,
      tel,
      memo,
      meal,
      count: Number(count),
    });
    return res.status(200).send("ok");
  } catch (e) {
    console.log(e);
    return res.status(400).send("error");
  }
});

app.post("/api/guestBook", async (req, res) => {
  const { id, name, password, message } = req.body;

  try {
    await models.attendance.create({
      id,
      name,
      password,
      title: message,
    });

    const guestBooks = await models.attendance.findAll({
      where: {
        id,
      },
      attributes: ["idx", "name", "title", "createdAt"],
      limit: 2,
      offset: 0,
      order: [["createdAt", "DESC"]],
    });

    const totalLength = await models.attendance.count({
      where: {
        id,
      },
    });
    res.status(200).send({ guestBooks, totalLength });
  } catch (e) {
    res.status(400).send({ guestBooks: [], totalLength: 0 });
  }
});

app.get("/api/guestBook", async (req, res) => {
  const guestBooks = await models.attendance.findAll({
    where: {
      id: req.query.id,
    },
    attributes: ["idx", "name", "title", "createdAt"],
    limit: 2 * Number(req.query.page),
    offset: 0,
    order: [["createdAt", "DESC"]],
  });
  const totalLength = await models.attendance.count({
    where: {
      id: req.query.id,
    },
  });
  res.status(200).send({ guestBooks, totalLength });
});

app.delete("/api/guestBook", async (req, res) => {
  const { id, idx, password } = req.body;
  const guestBook = await models.attendance.findOne({
    where: {
      id,
      idx,
    },
  });
  if (guestBook && guestBook.password === password) {
    await guestBook.destroy();
    const guestBooks = await models.attendance.findAll({
      where: {
        id,
      },
      attributes: ["idx", "name", "title", "createdAt"],
      limit: 2,
      offset: 0,
      order: [["createdAt", "DESC"]],
    });

    const totalLength = await models.attendance.count({
      where: {
        id,
      },
    });
    return res.status(200).send({ guestBooks, totalLength });
  } else {
    return res.status(400).send("잘못된 정보입니다.");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function generateKey() {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const length = 6;

  let key = "";
  for (let i = 0; i < length; i++) {
    key += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return key;
}
