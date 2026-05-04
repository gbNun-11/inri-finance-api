import { UserNotFoundError, InvalidPasswordError } from '../../errors/user.js'

export class LoginUserUseCase {
  constructor(
    postgresGetUserByEmailRepository,
    passwordComparatorAdapter,
    tokenGeneratorAdapter,
    accessTokenSecret,
    refreshTokenSecret,
  ) {
    this.postgresGetUserByEmailRepository = postgresGetUserByEmailRepository
    this.passwordComparatorAdapter = passwordComparatorAdapter
    this.tokenGeneratorAdapter = tokenGeneratorAdapter
    this.accessTokenSecret = accessTokenSecret
    this.refreshTokenSecret = refreshTokenSecret
  }

  async execute(email, password) {
    const user = await this.postgresGetUserByEmailRepository.execute(email)

    if (!user) throw new UserNotFoundError(email)

    const isPasswordValid = await this.passwordComparatorAdapter.execute(
      password,
      user.password,
    )

    if (!isPasswordValid) throw new InvalidPasswordError()

    const accessToken = this.tokenGeneratorAdapter.generate(
      { userId: user.id },
      this.accessTokenSecret,
      '15m',
    )

    const refreshToken = this.tokenGeneratorAdapter.generate(
      { userId: user.id },
      this.refreshTokenSecret,
      '30d',
    )

    return {
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    }
  }
}
