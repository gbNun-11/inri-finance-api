import { EmailAlreadyInUseError } from '../../errors/user.js'

export class UpdateUserUseCase {
  constructor(
    postgresGetUserByEmailReposity,
    postgresUpdateUserRepository,
    passwordHasherAdapter,
  ) {
    this.postgresGetUserByEmailReposity = postgresGetUserByEmailReposity
    this.postgresUpdateUserRepository = postgresUpdateUserRepository
    this.passwordHasherAdapter = passwordHasherAdapter
  }
  async execute(userId, updateUserParams) {
    if (updateUserParams.email) {
      const userWithProvidedEmail =
        await this.postgresGetUserByEmailReposity.execute(
          updateUserParams.email,
        )

      console.log(userWithProvidedEmail)
      console.log(userId)

      if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
        throw new EmailAlreadyInUseError(updateUserParams.email)
      }
    }

    const user = {
      ...updateUserParams,
    }

    if (updateUserParams.password) {
      const hashedPassword = await this.passwordHasherAdapter.execute(
        updateUserParams.password,
      )
      user.password = hashedPassword
    }

    const updatedUser = await this.postgresUpdateUserRepository.execute(
      userId,
      user,
    )

    return updatedUser
  }
}
