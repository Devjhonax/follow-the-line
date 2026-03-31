import reflectionService from '../services/reflection.service.js'

class ReflectionController {
  async criar(req, res, next) {
    try {
      const reflexao = await reflectionService.criar(req.userId, req.params.id, req.body)
      res.status(201).json(reflexao)
    } catch (err) {
      next(err)
    }
  }

  async buscar(req, res, next) {
    try {
      const reflexao = await reflectionService.buscar(req.userId, req.params.id)
      res.json(reflexao)
    } catch (err) {
      next(err)
    }
  }
}

export default new ReflectionController()
