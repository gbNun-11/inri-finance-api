// Repository Factories
import {
  PostgresCreateUserRepository,
  PostgresDeleteUserRepository,
  PostgresUpdateUserRepository,
  PostgresGetUserByEmailRepository,
  PostgresGetUserByIdRepository,
  PostgresGetUserBalanceRepository,
} from '../repositories/postgres/index.js'
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

  // Use-Cases
  const getUserByIdUseCase = new GetUserByIdUseCase(
    postgresGetUserByIdRepository,
  )
  const updateUserUseCase = new UpdateUserUseCase(
    postgresGetUserByEmailRepository,
    postgresUpdateUserRepository,
  )
  const deleteUserUseCase = new DeleteUserUseCase(postgresDeleteUserRepository)
  const createUserUseCase = new CreateUserUseCase(
    postgresGetUserByEmailRepository,
    postgresCreateUserRepository,
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
