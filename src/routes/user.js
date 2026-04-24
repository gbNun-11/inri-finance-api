import { Router } from 'express'
import { makeGetUserController } from '../factories/user.js'

const router = new Router()
const userController = makeGetUserController()

// Routes
router.get('/:userId/balance', (req, res) => userController.index(req, res))
router.get('/:userId', (req, res) => userController.show(req, res))
router.patch('/:userId', (req, res) => userController.update(req, res))
router.delete('/:userId', (req, res) => userController.delete(req, res))
router.post('/', (req, res) => userController.store(req, res))

export default router
