// handle unsuported error
const pageNotFound = function (req, res, next) {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Erros
const errorHandler = function (error, req, res, next) {
  if (res.headerSent) {
    return next(error);
  }

  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknowing error is presented." });
};

module.exports = { pageNotFound, errorHandler };
