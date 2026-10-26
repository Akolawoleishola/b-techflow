function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong.";

  if (statusCode >= 500) {
    console.error("Server error:", err);
  }

  const response = {
    success: false,
    message,
  };

  if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
    response.errors = err.errors;
  }

  return res.status(statusCode).json(response);
}

module.exports = errorHandler;
