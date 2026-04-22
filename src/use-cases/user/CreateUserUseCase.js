import crypto from 'node:crypto'
import bcrypt from 'bcrypt'

export class CreateUserUseCase {
  constructor(CreateUserRepository) {
    this.createUserRepository = CreateUserRepository
  }
  async execute(createUserParams) {
    const userId = crypto.randomUUID()
    const hashedPassword = await bcrypt.hash(createUserParams.password, 10)

    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    }
    const createdUser = await this.createUserRepository.execute(user)
    return createdUser
  }
}
