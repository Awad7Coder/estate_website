const multer = require("multer");
const path = require("path");
const fs = require("fs");
const uploadController = require("express").Router();
const asyncFn = require("../middlewares/asyncweapper");
const VertifyToken = require("../middlewares/VertifyToken");
const AppError = require("../utilites/appError");

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../images");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const filename = `user-${Date.now()}.${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];
  if (imageType == "image") {
    return cb(null, true);
  } else {
    cb(new AppError("this is not image", 400), false);
  }
};

const upload = multer({
  storage: diskStorage,
  fileFilter, //both have same name so delete the value
});

uploadController.post("/image", upload.single("image"), async (req, res) => {
  try {
    console.log("File received:", req.file);
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
    console.log("Image URL:", imageUrl);

    res.status(200).json({
      message: "File uploaded successfully",
      filename: req.file.filename,
      imageUrl: `http://localhost:5000/image/${req.file.filename}`,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = uploadController;
