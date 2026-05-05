// Repository Factories
import {
  PostgresGetUserByEmailRepository,
  PostgresGetUserByIdRepository,
  PostgresGetTransactionByIdRepository,
} from '../repositories/postgres/index.js'
// Adapters Factories
import {
  TokenGeneratorAdapter,
  PasswordComparatorAdapter,
  TokenVerifierAdapter,
} from '../adapters/index.js'
// Use-Cases Factories
import {
  LoginUserUseCase,
  GetUserByIdUseCase,
  GetTransactionByIdUseCase,
  RefreshTokenUseCase,
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

  // Adapters
  const tokenGeneratorAdapter = new TokenGeneratorAdapter()
  const passwordComparatorAdapter = new PasswordComparatorAdapter()
  const tokenVerifierAdapter = new TokenVerifierAdapter()
  // Use-Cases
  const loginUserUseCase = new LoginUserUseCase(
    postgresGetUserByEmailRepository,
    passwordComparatorAdapter,
    tokenGeneratorAdapter,
    process.env.JWT_ACCESS_TOKEN_SECRET,
    process.env.JWT_REFRESH_TOKEN_SECRET,
  )
  const refreshTokenUseCase = new RefreshTokenUseCase(
    tokenGeneratorAdapter,
    tokenVerifierAdapter,
    process.env.JWT_ACCESS_TOKEN_SECRET,
    process.env.JWT_REFRESH_TOKEN_SECRET,
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
  const authController = new AuthController(
    loginUserUseCase,
    refreshTokenUseCase,
    getUserHelper,
  )

  return authController
}
