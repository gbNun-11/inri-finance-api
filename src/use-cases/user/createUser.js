import { EmailAlreadyInUseError } from '../../errors/user.js'

export class CreateUserUseCase {
  constructor(
    postgresGetUserByEmailRepository,
    postgresCreateUserRepository,
    passwordHasherAdapter,
    uuidAdapter,
    tokenGeneratorAdapter,
    accessTokenSecret,
    refreshTokenSecret,
  ) {
    this.postgresGetUserByEmailRepository = postgresGetUserByEmailRepository
    this.postgresCreateUserRepository = postgresCreateUserRepository
    this.passwordHasherAdapter = passwordHasherAdapter
    this.uuidAdapter = uuidAdapter
    this.tokenGeneratorAdapter = tokenGeneratorAdapter
    this.accessTokenSecret = accessTokenSecret
    this.refreshTokenSecret = refreshTokenSecret
  }

  async execute(createUserParams) {
    const userWithProvidedEmail =
      await this.postgresGetUserByEmailRepository.execute(
        createUserParams.email,
      )

    if (userWithProvidedEmail) {
      throw new EmailAlreadyInUseError(createUserParams.email)
    }

    const userId = this.uuidAdapter.generate()

    const hashedPassword = await this.passwordHasherAdapter.execute(
      createUserParams.password,
    )

    const user = {
      id: userId,
      first_name: createUserParams.first_name,
      last_name: createUserParams.last_name,
      email: createUserParams.email,
      password: hashedPassword,
    }

    const createdUser = await this.postgresCreateUserRepository.execute(user)

    const accessToken = this.tokenGeneratorAdapter.generate(
      { userId: createdUser.id },
      this.accessTokenSecret,
      '15m',
    )

    const refreshToken = this.tokenGeneratorAdapter.generate(
      { userId: createdUser.id },
      this.refreshTokenSecret,
      '30d',
    )

    return {
      user: {
        id: createdUser.id,
        first_name: createdUser.first_name,
        last_name: createdUser.last_name,
        email: createdUser.email,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    }
  }
}
