import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../prisma/client.js'
import AppError from '../utils/AppError.js'

const RODADAS_SALT = 10
const JWT_EXPIRA_EM = '1h'

class AuthService {
  async registrar(username, password) {
    if (!username || !password) {
      throw new AppError('Username e password são obrigatórios.', 400)
    }

    if (password.length < 6) {
      throw new AppError('A senha deve ter no mínimo 6 caracteres.', 400)
    }

    const usuarioExistente = await prisma.user.findUnique({ where: { username } })
    if (usuarioExistente) {
      throw new AppError('Username já está em uso.', 409)
    }

    const senhaCriptografada = await bcrypt.hash(password, RODADAS_SALT)

    const usuario = await prisma.user.create({
      data: { username, password: senhaCriptografada },
      select: { id: true, username: true, createdAt: true },
    })

    return usuario
  }

  async login(username, password) {
    if (!username || !password) {
      throw new AppError('Username e password são obrigatórios.', 400)
    }

    const usuario = await prisma.user.findUnique({ where: { username } })

    if (!usuario) {
      throw new AppError('Credenciais inválidas.', 401)
    }

    const senhaCorreta = await bcrypt.compare(password, usuario.password)
    if (!senhaCorreta) {
      throw new AppError('Credenciais inválidas.', 401)
    }

    const token = jwt.sign({ userId: usuario.id }, process.env.JWT_SECRET, {
      expiresIn: JWT_EXPIRA_EM,
    })

    return {
      token,
      usuario: { id: usuario.id, username: usuario.username, criadoEm: usuario.createdAt },
    }
  }

  async buscarPorId(userId) {
    const usuario = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, createdAt: true },
    })
    if (!usuario) throw new AppError('Usuário não encontrado.', 404)
    return usuario
  }
}

export default new AuthService()
