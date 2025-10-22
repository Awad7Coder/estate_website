const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const app = express();
const path = require("path");
const db = require("./config/db");
const authController = require("./controllers/authController");
const propertyController = require("./controllers/propertyController");
const uploadController = require("./controllers/uploadController");
const statusText = require("./utilites/statusText");

//mongo connect  we have 2 lines missing ??
db();
app.use("/images",express.static("public/images"));

// routes and middleware
app.use(cors());
app.use(express.json());
app.use("/auth", authController);
app.use("/property", propertyController);
app.use("/upload", uploadController);
const uploadPath = path.join(__dirname, "../images");

app.use((req, res) => {
  // console.log(`404 Error: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    status: statusText.ERROR,
    message: "this resource is not available",
  });
});

// global error handler
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || statusText.ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

app.listen(process.env.PORT, () => console.log("Server run ✔"));
