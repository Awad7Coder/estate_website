const jwt = require("jsonwebtoken");
const AppError = require("../utilites/appError");
const statusText = require("../utilites/statusText");

const VerifyToken = (req, res, next) => {
  const header = req.headers.Authorization || req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    const error = AppError.create("Token is required", 401, statusText.FAIL);
    return next(error);
  }

  const token = header.split(" ")[1];

  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET);
    req.currentUser = currentUser;
    next();
  } catch (e) {
    const error = AppError.create("Invalid token", 401, statusText.ERROR);
    return next(error);
  }
};

module.exports = VerifyToken;
