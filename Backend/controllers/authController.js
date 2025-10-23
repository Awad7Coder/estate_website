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
  asyncFn(async (req, res, next) => {
    try {
      console.log("Registration request body:", req.body);
      const JWT_SECRET = process.env.JWT_SECRET;

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

      const newuser = await User.create({
        ...req.body,
        password: hashPassword,
      });

      console.log("User created:", newuser);

      const { password, ...others } = newuser.toObject();
      const token = jwt.sign({ id: newuser._id }, JWT_SECRET, {
        expiresIn: "4h",
      });

      return res.status(201).json({ others, token });
    } catch (error) {
      console.error("Registration error:", error);
      next(error);
    }
  })
);

authController.post(
  "/login",
  asyncFn(async (req, res, next) => {
    const JWT_SECRET = process.env.JWT_SECRET;
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

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "4h",
    });

    const { password, ...others } = user._doc;

    return res.status(200).json({ others, token });
  })
);

module.exports = authController;
