class AppError extends Error {
  constructor(mensagem, statusCode) {
    super(mensagem)
    this.statusCode = statusCode
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

export default AppError
