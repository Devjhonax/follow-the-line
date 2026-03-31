import { Router } from 'express'
import authController from '../controllers/auth.controller.js'
import autenticar from '../middlewares/authenticate.js'

const router = Router()

router.post('/register', (req, res, next) => authController.registrar(req, res, next))
router.post('/login', (req, res, next) => authController.login(req, res, next))
router.get('/me', autenticar, (req, res, next) => authController.me(req, res, next))

export default router
