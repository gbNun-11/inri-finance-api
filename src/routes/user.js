import { Router } from 'express'
import { makeGetUserController } from '../factories/user.js'
import { authMiddleware } from '../middlewares/auth.js'

const router = new Router()
const userController = makeGetUserController()

// Routes
router.get('/me/balance', authMiddleware, (req, res) =>
  userController.index(req, res),
)
router.get('/me', authMiddleware, (req, res) => userController.show(req, res))
router.patch('/me', authMiddleware, (req, res) =>
  userController.update(req, res),
)
router.delete('/me', authMiddleware, (req, res) =>
  userController.delete(req, res),
)
router.post('/', (req, res) => userController.store(req, res))

export default router
