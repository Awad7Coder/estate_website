const authController = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncFn = require("../middlewares/asyncweapper");
const AppError = require("../utilites/appError");
const statusText = require("../utilites/statusText");
const { json } = require("express");

authController.post(
  "/register",
  asyncFn(async (req, res,next) => {
    const isExisting = await User.findOne({ email: req.body.email });
    if (isExisting) {
      const error = AppError.create(
        "Email already exists",
        401,
        statusText.FAIL
      );
      return next(error);
    }

    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const newuser = await User.create({ ...req.body, password: hashPassword });

    const { password, ...others } = newuser.toObject();
    const token = jwt.sign({ id: newuser._id }, process.env.JWT_SECERT, {
      expiresIn: "4h",
    });

    return res.status(201).json({ others, token });
  })
);

authController.post(
  "/login",
  asyncFn(async (req, res,next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const error = AppError.create("User is not exist", 401, statusText.FAIL);
      return next(error);
    }

    const IsMatched = await bcrypt.compare(req.body.password, user.password);

    if (!IsMatched) {
      const error = AppError.create(
        "Password is not correct",
        401,
        statusText.FAIL
      );
      return next(error);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECERT, {
      expiresIn: "4h",
    });

    const {password,...others} = user._doc;

    return res.status(200).json({others,token})
  })
);

module.exports = authController;
