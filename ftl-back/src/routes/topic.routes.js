import { Router } from 'express'
import topicController from '../controllers/topic.controller.js'
import sessionController from '../controllers/session.controller.js'
import autenticar from '../middlewares/authenticate.js'

const router = Router()

router.use(autenticar)

router.post('/', (req, res, next) => topicController.criar(req, res, next))
router.get('/', (req, res, next) => topicController.listar(req, res, next))
router.get('/:id', (req, res, next) => topicController.buscarPorId(req, res, next))
router.delete('/:id', (req, res, next) => topicController.deletar(req, res, next))
router.get('/:id/performance', (req, res, next) => topicController.performance(req, res, next))

router.post('/:topicId/sessions', (req, res, next) => sessionController.criar(req, res, next))
router.get('/:topicId/sessions', (req, res, next) => sessionController.listar(req, res, next))

export default router
