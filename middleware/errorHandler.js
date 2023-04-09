const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../errors/index");

const errorHandler = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something went wrong. Try again later",
  };

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  res.status(customError.statusCode).json({ message: customError.message });
};

module.exports = errorHandler;
