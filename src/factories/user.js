// Repository Factories
import {
  PostgresCreateUserRepository,
  PostgresDeleteUserRepository,
  PostgresUpdateUserRepository,
  PostgresGetUserByEmailRepository,
  PostgresGetUserByIdRepository,
  PostgresGetUserBalanceRepository,
} from '../repositories/postgres/index.js'

// Adapter Factories
import {
  PasswordHasherAdapter,
  UuidAdapter,
  TokenGeneratorAdapter,
} from '../adapters/index.js'

// Use-Cases Factories
import {
  GetUserByIdUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
  UpdateUserUseCase,
  GetUserBalanceUseCase,
} from '../use-cases/index.js'

// Helpers Factories
import { GetUserHelper } from '../helpers/http.js'

// Controllers Factories
import { UserController } from '../controllers/UserController.js'

export const makeGetUserController = () => {
  // Repositorys
  const postgresGetUserByIdRepository = new PostgresGetUserByIdRepository()
  const postgresGetUserByEmailRepository =
    new PostgresGetUserByEmailRepository()
  const postgresUpdateUserRepository = new PostgresUpdateUserRepository()
  const postgresDeleteUserRepository = new PostgresDeleteUserRepository()
  const postgresCreateUserRepository = new PostgresCreateUserRepository()
  const postgresGetUserBalanceRepository =
    new PostgresGetUserBalanceRepository()

  // Adapters
  const passwordHasherAdapter = new PasswordHasherAdapter()
  const uuidAdapter = new UuidAdapter()
  const tokenGeneratorAdapter = new TokenGeneratorAdapter()
  if (
    !process.env.JWT_ACCESS_TOKEN_SECRET ||
    !process.env.JWT_REFRESH_TOKEN_SECRET
  ) {
    throw new Error('JWT secrets are not configured')
  }

  // Use-Cases
  const getUserByIdUseCase = new GetUserByIdUseCase(
    postgresGetUserByIdRepository,
  )

  const updateUserUseCase = new UpdateUserUseCase(
    postgresGetUserByEmailRepository,
    postgresUpdateUserRepository,
    passwordHasherAdapter,
  )

  const deleteUserUseCase = new DeleteUserUseCase(postgresDeleteUserRepository)

  const createUserUseCase = new CreateUserUseCase(
    postgresGetUserByEmailRepository,
    postgresCreateUserRepository,
    passwordHasherAdapter,
    uuidAdapter,
    tokenGeneratorAdapter,
    process.env.JWT_ACCESS_TOKEN_SECRET,
    process.env.JWT_REFRESH_TOKEN_SECRET,
  )

  const getUserBalanceUseCase = new GetUserBalanceUseCase(
    postgresGetUserBalanceRepository,
  )

  // Helpers
  const getUserHelper = new GetUserHelper(getUserByIdUseCase)

  // Controllers
  const userController = new UserController(
    getUserHelper,
    updateUserUseCase,
    createUserUseCase,
    deleteUserUseCase,
    getUserBalanceUseCase,
  )

  return userController
}
