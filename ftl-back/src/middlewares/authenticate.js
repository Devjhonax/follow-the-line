import jwt from 'jsonwebtoken'
import AppError from '../utils/AppError.js'

export default function autenticar(req, res, next) {
  try {
    let token = null

    const cabecalhoAuth = req.headers.authorization
    if (cabecalhoAuth && cabecalhoAuth.startsWith('Bearer ')) {
      token = cabecalhoAuth.split(' ')[1]
    } else if (req.cookies?.token) {
      token = req.cookies.token
    }

    if (!token) {
      throw new AppError('Token de autenticação não fornecido.', 401)
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = payload.userId
    next()
  } catch (err) {
    if (err.isOperational) return next(err)
    next(new AppError('Token inválido ou expirado.', 401))
  }
}
