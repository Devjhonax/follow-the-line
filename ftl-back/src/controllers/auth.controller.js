import authService from '../services/auth.service.js'

const OPCOES_COOKIE = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

class AuthController {
  async registrar(req, res, next) {
    try {
      const { username, password } = req.body
      const usuario = await authService.registrar(username, password)
      res.status(201).json({ mensagem: 'Usuário criado com sucesso.', usuario })
    } catch (err) {
      next(err)
    }
  }

  async login(req, res, next) {
    try {
      const { username, password } = req.body
      const { token, usuario } = await authService.login(username, password)

      res.cookie('token', token, OPCOES_COOKIE)
      res.json({ mensagem: 'Login realizado com sucesso.', token, usuario })
    } catch (err) {
      next(err)
    }
  }

  async me(req, res, next) {
    try {
      const usuario = await authService.buscarPorId(req.userId)
      res.json({ autenticado: true, usuario })
    } catch (err) {
      next(err)
    }
  }
}

export default new AuthController()
