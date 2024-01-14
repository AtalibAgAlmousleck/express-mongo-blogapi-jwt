const jwt = require("jsonwebtoken");
const HttpError = require("../models/error-model");

const authentication = async function (req, res, next) {
  const Authorization = req.headers.Authorization || req.headers.authorization;

  if (Authorization && Authorization.startsWith("Bearer")) {
    const token = Authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (error, info) => {
      if (error) {
        return next(new HttpError("Unauthorized. Invalid token.", 403));
      }
      req.user = info;
      next();
    });
  } else {
    return next(new HttpError("Unauthorized, no token found", 402));
  }
};

module.exports = authentication;
