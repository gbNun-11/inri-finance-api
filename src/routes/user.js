import { Router } from 'express'
import { makeGetUserController } from '../factories/user.js'
import { authMiddleware } from '../middlewares/auth.js'

const router = new Router()
const userController = makeGetUserController()

// Routes
router.get('/balance', authMiddleware, (req, res) =>
  userController.index(req, res),
)
router.get('/', authMiddleware, (req, res) => userController.show(req, res))
router.patch('/', authMiddleware, (req, res) => userController.update(req, res))
router.delete('/', authMiddleware, (req, res) =>
  userController.delete(req, res),
)
router.post('/', (req, res) => userController.store(req, res))

export default router
