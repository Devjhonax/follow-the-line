import topicService from '../services/topic.service.js'

class TopicController {
  async criar(req, res, next) {
    try {
      const topico = await topicService.criar(req.userId, req.body.name)
      res.status(201).json(topico)
    } catch (err) {
      next(err)
    }
  }

  async listar(req, res, next) {
    try {
      const resultado = await topicService.listar(req.userId, req.query)
      res.json(resultado)
    } catch (err) {
      next(err)
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const topico = await topicService.buscarPorId(req.userId, req.params.id)
      res.json(topico)
    } catch (err) {
      next(err)
    }
  }

  async deletar(req, res, next) {
    try {
      await topicService.deletar(req.userId, req.params.id)
      res.status(204).json({message: "topico delatado"})
    } catch (err) {
      next(err)
    }
  }

  async performance(req, res, next) {
    try {
      const dados = await topicService.calcularPerformance(req.userId, req.params.id)
      res.json(dados)
    } catch (err) {
      next(err)
    }
  }
}

export default new TopicController()
