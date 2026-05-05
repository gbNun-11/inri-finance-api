import {
  UserNotFoundError,
  InvalidPasswordError,
  UnauthorizedError,
} from '../errors/user.js'

export class AuthController {
  constructor(loginUserUseCase, refreshTokenUseCase, getUserHelper) {
    this.loginUserUseCase = loginUserUseCase
    this.refreshTokenUseCase = refreshTokenUseCase
    this.getUserHelper = getUserHelper
  }

  async handle(req, res) {
    try {
      const params = req.body

      const validationError = this.validateLoginParams(params)

      if (validationError) {
        return this.getUserHelper.responseStatusError(
          res,
          validationError.statusCode,
          validationError.message,
        )
      }

      const user = await this.loginUserUseCase.execute(
        params.email,
        params.password,
      )

      return this.getUserHelper.responseStatusSuccess(res, 200, user)
    } catch (error) {
      if (
        error instanceof UserNotFoundError ||
        error instanceof InvalidPasswordError
      ) {
        return this.getUserHelper.responseStatusError(
          res,
          401,
          'Invalid email or password',
        )
      }

      console.error(error)

      return this.getUserHelper.responseStatusError(
        res,
        500,
        'Internal server error.',
      )
    }
  }

  validateLoginParams(params) {
    const requiredFields = this.getUserHelper.columnsTableLoginUsers()

    const someFieldIsNotAllowed = Object.keys(params).some(
      (field) => !requiredFields.includes(field),
    )

    if (someFieldIsNotAllowed) {
      return {
        statusCode: 400,
        message: 'Some provided field is not allowed',
      }
    }

    const someRequiredFieldIsMissing = requiredFields.some(
      (field) => !params[field],
    )

    if (someRequiredFieldIsMissing) {
      return {
        statusCode: 400,
        message: 'Missing required fields',
      }
    }

    return null
  }

  refreshToken(req, res) {
    try {
      const { refreshToken } = req.body

      if (!refreshToken) {
        return this.getUserHelper.responseStatusError(
          res,
          400,
          'Refresh token is required',
        )
      }

      const response = this.refreshTokenUseCase.execute(refreshToken)

      return this.getUserHelper.responseStatusSuccess(res, 200, response)
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        return this.getUserHelper.responseStatusError(res, 401, e.message)
      }

      console.error(e)
      return this.getUserHelper.responseStatusError(
        res,
        500,
        'Internal server error.',
      )
    }
  }
}
