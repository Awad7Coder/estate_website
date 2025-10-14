const multer = require("multer");
const uploadController = require("express").Router();
const asyncFn = require("../middlewares/asyncweapper");
const VertifyToken = require("../middlewares/VertifyToken");
const AppError = require("../utilites/appError");

const diskStorage = multer.diskStorage({
  // for define the path file upload in storage
  destination: function (req, file, cb) {
    console.log("file", file);
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    // for stop override repeated files name
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

uploadController.post(
  "/images",
  VertifyToken,
  upload.single("img"),
  asyncFn(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;

    return res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl,
    });
  })
);
module.exports = uploadController;
