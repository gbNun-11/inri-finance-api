import { Router } from 'express'
import { makeGetTransactionController } from '../factories/transaction.js'
import { authMiddleware } from '../middlewares/auth.js'

const router = new Router()
const transactionController = makeGetTransactionController()

router.get('/me', authMiddleware, (req, res) =>
  transactionController.show(req, res),
)
router.post('/me', authMiddleware, (req, res) =>
  transactionController.store(req, res),
)
router.patch('/me/:transactionId', authMiddleware, (req, res) =>
  transactionController.update(req, res),
)
router.delete('/me/:transactionId', authMiddleware, (req, res) =>
  transactionController.delete(req, res),
)

export default router
