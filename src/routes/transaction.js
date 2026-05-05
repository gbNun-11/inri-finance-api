import { Router } from 'express'
import { makeGetTransactionController } from '../factories/transaction.js'
import { authMiddleware } from '../middlewares/auth.js'

const router = new Router()
const transactionController = makeGetTransactionController()

router.get('/', authMiddleware, (req, res) =>
  transactionController.show(req, res),
)
router.post('/', authMiddleware, (req, res) =>
  transactionController.store(req, res),
)
router.patch('/:transactionId', authMiddleware, (req, res) =>
  transactionController.update(req, res),
)
router.delete('/:transactionId', authMiddleware, (req, res) =>
  transactionController.delete(req, res),
)

export default router
