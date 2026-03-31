import sessionService from '../services/session.service.js'

class SessionController {
  async criar(req, res, next) {
    try {
      const {topicId} = req.params

      const sessao = await sessionService.criar(
        req.userId,
        topicId,
        req.body.plannedTime
      )
      res.status(201).json(sessao)
    } catch (err) {
      next(err)
    }
  }

  async listar(req, res, next) {
    try {
      const resultado = await sessionService.listar(req.userId, req.params.topicId, req.query)
      res.json(resultado)
    } catch (err) {
      next(err)
    }
  }

  async encerrar(req, res, next) {
    try {
      const sessao = await sessionService.encerrar(req.userId, req.params.id, req.body.realTime)
      res.json(sessao)
    } catch (err) {
      next(err)
    }
  }
}

export default new SessionController()
