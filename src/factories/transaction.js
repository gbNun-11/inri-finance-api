// Repository Factories
import {
  PostgresGetUserByIdRepository,
  PostgresCreateTransactionRepository,
  PostgresGetTransactionByUserIdRepository,
  PostgresUpdateTransactionRepository,
  PostgresGetTransactionByIdRepository,
  PostgresDeleteTransactionRepository,
} from '../repositories/postgres/index.js'
// Adapters Factories
import { UuidAdapter } from '../adapters/index.js'
// Use-Cases Factories
import {
  GetUserByIdUseCase,
  CreateTransactionUseCase,
  GetTransactionByUserIdUseCase,
  UpdateTransactionUseCase,
  GetTransactionByIdUseCase,
  DeleteTransactionUseCase,
} from '../use-cases/index.js'
// Helpers Factories
import { GetUserHelper } from '../helpers/http.js'
// Controllers Factories
import { TransactionController } from '../controllers/TransactionController.js'

export const makeGetTransactionController = () => {
  // Repository
  const postgresGetUserByIdRepository = new PostgresGetUserByIdRepository()
  const postgresCreateTransactionRepository =
    new PostgresCreateTransactionRepository()
  const postgresGetTransactionByUserIdRepository =
    new PostgresGetTransactionByUserIdRepository()
  const postgresUpdateTransactionRepository =
    new PostgresUpdateTransactionRepository()
  const postgresGetTransactionByIdRepository =
    new PostgresGetTransactionByIdRepository()
  const postgresDeleteTransactionRepository =
    new PostgresDeleteTransactionRepository()

  // Adapters
  const uuidAdapter = new UuidAdapter()

  // Use-Cases
  const getUserByIdUseCase = new GetUserByIdUseCase(
    postgresGetUserByIdRepository,
  )
  const createTransactionUseCase = new CreateTransactionUseCase(
    postgresCreateTransactionRepository,
    uuidAdapter,
  )
  const getTransactionByUserIdUseCase = new GetTransactionByUserIdUseCase(
    postgresGetTransactionByUserIdRepository,
  )
  const updateTransactionUseCase = new UpdateTransactionUseCase(
    postgresUpdateTransactionRepository,
    postgresGetTransactionByIdRepository,
  )
  const getTransactionByIdUseCase = new GetTransactionByIdUseCase(
    postgresGetTransactionByIdRepository,
  )
  const deleteTransactionUseCase = new DeleteTransactionUseCase(
    postgresDeleteTransactionRepository,
    postgresGetTransactionByIdRepository,
  )

  // Helpers
  const getUserHelper = new GetUserHelper(
    getUserByIdUseCase,
    getTransactionByIdUseCase,
  )

  // Controllers
  const transactionController = new TransactionController(
    getUserHelper,
    createTransactionUseCase,
    getTransactionByUserIdUseCase,
    updateTransactionUseCase,
    deleteTransactionUseCase,
  )

  return transactionController
}
