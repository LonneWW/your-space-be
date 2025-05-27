// errorHandler.js
export default function errorHandler(error, req, res, next) {
  console.log("mmmiddlewaaare");
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
  });
}
