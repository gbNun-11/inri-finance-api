// Repository Factory
import { CreateUserRepository } from '../repositories/postgres/index.js'

// Use-Case Factory
import { CreateUserUseCase } from '../use-cases/index.js'

// Helper Factory
// Controller Factory
import { UserController } from '../controllers/UserController.js'

export const makeGetUserController = () => {
  // Repositories
  const createUserRespository = new CreateUserRepository()
  // Use-Cases
  const createUserUseCase = new CreateUserUseCase(createUserRespository)
  // Controller
  const userController = new UserController(createUserUseCase)

  return userController
}
