import { Router } from 'express'
import sessionController from '../controllers/session.controller.js'
import reflectionController from '../controllers/reflection.controller.js'
import autenticar from '../middlewares/authenticate.js'

const router = Router()

router.use(autenticar)

router.put('/:id/end', (req, res, next) => sessionController.encerrar(req, res, next))
router.post('/create', sessionController.criar)
router.post('/:id/reflection', (req, res, next) => reflectionController.criar(req, res, next))
router.get('/:id/reflection', (req, res, next) => reflectionController.buscar(req, res, next))
router.get('/:id/session', sessionController.listar)

export default router