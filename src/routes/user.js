import { Router } from 'express'
import { makeGetUserController } from '../factories/user.js'
import { authMiddleware } from '../middlewares/auth.js'

const router = new Router()
const userController = makeGetUserController()

// Routes
router.get('/:userId/balance', authMiddleware, (req, res) =>
  userController.index(req, res),
)
router.get('/:userId', authMiddleware, (req, res) =>
  userController.show(req, res),
)
router.patch('/:userId', authMiddleware, (req, res) =>
  userController.update(req, res),
)
router.delete('/:userId', authMiddleware, (req, res) =>
  userController.delete(req, res),
)
router.post('/', (req, res) => userController.store(req, res))

export default router
