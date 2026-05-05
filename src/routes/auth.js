import { Router } from 'express'
import { makeGetAuthController } from '../factories/auth.js'

const router = new Router()
const authController = makeGetAuthController()

// Routes
router.post('/login', (req, res) => authController.handle(req, res))
router.post('/refresh-token', (req, res) =>
  authController.refreshToken(req, res),
)

export default router
