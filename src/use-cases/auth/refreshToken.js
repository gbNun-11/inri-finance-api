import { UnauthorizedError } from '../../errors/user.js'

export class RefreshTokenUseCase {
  constructor(
    tokenGeneratorAdapter,
    tokenVerifierAdapter,
    accessTokenSecret,
    refreshTokenSecret,
  ) {
    this.tokenGeneratorAdapter = tokenGeneratorAdapter
    this.tokenVerifierAdapter = tokenVerifierAdapter
    this.accessTokenSecret = accessTokenSecret
    this.refreshTokenSecret = refreshTokenSecret
  }

  execute(refreshToken) {
    try {
      const decodedToken = this.tokenVerifierAdapter.verify(
        refreshToken,
        this.refreshTokenSecret,
      )

      if (!decodedToken?.userId) {
        throw new UnauthorizedError('Invalid refresh token')
      }

      const accessToken = this.tokenGeneratorAdapter.generate(
        { userId: decodedToken.userId },
        this.accessTokenSecret,
        '15m',
      )

      return {
        accessToken,
      }
    } catch (e) {
      console.error('Refresh token error:', e.name, e.message)
      throw new UnauthorizedError('Invalid refresh token')
    }
  }
}
