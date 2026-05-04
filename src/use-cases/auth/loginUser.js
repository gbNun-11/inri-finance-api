import { UserNotFoundError, InvalidPasswordError } from '../../errors/user.js'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export class LoginUserUseCase {
  constructor(postgresGetUserByEmailRepository) {
    this.postgresGetUserByEmailRepository = postgresGetUserByEmailRepository
  }

  async execute(email, password) {
    const user = await this.postgresGetUserByEmailRepository.execute(email)

    if (!user) {
      throw new UserNotFoundError(email)
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new InvalidPasswordError()
    }

    if (
      !process.env.JWT_ACCESS_TOKEN_SECRET ||
      !process.env.JWT_REFRESH_TOKEN_SECRET
    ) {
      throw new Error('JWT secrets are not configured')
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' },
    )

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_TOKEN_SECRET,
      { expiresIn: '30d' },
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
