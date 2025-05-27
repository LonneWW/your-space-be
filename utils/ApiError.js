// Definisci una mappa di messaggi predefiniti per i codici HTTP che ti interessano
const DEFAULT_ERROR_MESSAGES = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
  500: "Internal Server Error",
};

export class ApiError extends Error {
  constructor(statusCode, message = DEFAULT_ERROR_MESSAGES[statusCode]) {
    super(message); // Invia il messaggio a Error
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.name = this.constructor.name;
    this.isOperational = true;
    // Questo metodo aiuta a mantenere pulito lo stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
