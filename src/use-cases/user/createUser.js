import { EmailAlreadyInUseError } from '../../errors/user.js'

export class CreateUserUseCase {
  constructor(
    postgresGetUserByEmailReposity,
    postgresCreateUserRepository,
    passwordHasherAdapter,
    UuidAdapter,
  ) {
    this.postgresGetUserByEmailRepository = postgresGetUserByEmailReposity
    this.postgresCreateUserRepository = postgresCreateUserRepository
    this.passwordHasherAdapter = passwordHasherAdapter
    this.uuidAdapter = UuidAdapter
  }
  async execute(createUserParams) {
    const userWithProvidedEmail =
      await this.postgresGetUserByEmailRepository.execute(
        createUserParams.email,
      )

    if (userWithProvidedEmail) {
      throw new EmailAlreadyInUseError(createUserParams.email)
    }

    const userID = this.uuidAdapter.generate()

    const hashedPassword = await this.passwordHasherAdapter.execute(
      createUserParams.password,
    )

    const user = {
      first_name: createUserParams.first_name,
      last_name: createUserParams.last_name,
      email: createUserParams.email,
      id: userID,
      password: hashedPassword,
    }

    const createdUser = await this.postgresCreateUserRepository.execute(user)

    return createdUser
  }
}
