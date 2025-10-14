const jwt = require("jsonwebtoken");
const AppError = require("../utilites/appError");
const statusText = require("../utilites/statusText");

const VertifyToken = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")){
    const error = AppError.create("Token is requires", 401, statusText.FAIL);
    return next(error);
  }

  const token = header.split(" ")[1];

  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECERT);
    req.currentUser = currentUser;
    next()
  } catch (e) {
    const error = AppError.create("Token is requires", 401, statusText.ERROR);
    return next(error);
  }
};

module.exports =VertifyToken
