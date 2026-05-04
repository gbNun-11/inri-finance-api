// Repository Factories
import {
  PostgresGetUserByEmailRepository,
  PostgresGetUserByIdRepository,
  PostgresGetTransactionByIdRepository,
} from '../repositories/postgres/index.js'
// Use-Cases Factories
import {
  LoginUserUseCase,
  GetUserByIdUseCase,
  GetTransactionByIdUseCase,
} from '../use-cases/index.js'
// Helpers Factories
import { GetUserHelper } from '../helpers/http.js'
// Controllers Factories
import { AuthController } from '../controllers/AuthController.js'

export const makeGetAuthController = () => {
  // Repository
  const postgresGetUserByEmailRepository =
    new PostgresGetUserByEmailRepository()
  const postgresGetUserByIdRepository = new PostgresGetUserByIdRepository()
  const postgresGetTransactionByIdRepository =
    new PostgresGetTransactionByIdRepository()

  // Use-Cases
  const loginUserUseCase = new LoginUserUseCase(
    postgresGetUserByEmailRepository,
  )
  const getUserByIdUseCase = new GetUserByIdUseCase(
    postgresGetUserByIdRepository,
  )
  const getTransactionByIdUseCase = new GetTransactionByIdUseCase(
    postgresGetTransactionByIdRepository,
  )
  // Helpers
  const getUserHelper = new GetUserHelper(
    getUserByIdUseCase,
    getTransactionByIdUseCase,
  )

  // Controllers
  const authController = new AuthController(loginUserUseCase, getUserHelper)

  return authController
}
