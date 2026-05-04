export class AuthController {
  constructor(loginUserUseCase, getUserHelper) {
    this.loginUserUseCase = loginUserUseCase
    this.getUserHelper = getUserHelper
  }

  async handle(req, res) {
    try {
      const params = req.body

      const requiredFields = this.getUserHelper.columnsTableLoginUsers()

      const someFieldIsNotAllowed = Object.keys(params).some(
        (field) => !requiredFields.includes(field),
      )

      if (someFieldIsNotAllowed) {
        return this.getUserHelper.responseStatusError(
          res,
          400,
          'Some provided field is not allowed',
        )
      }

      const someRequiredFieldIsMissing = requiredFields.some(
        (field) => !params[field],
      )

      if (someRequiredFieldIsMissing) {
        return this.getUserHelper.responseStatusError(
          res,
          400,
          'Missing required fields',
        )
      }

      const isValidationEmail = this.getUserHelper.validationEmail(
        res,
        params.email,
      )

      if (!isValidationEmail) return

      const isValidationPassword = this.getUserHelper.validationPassword(
        res,
        params.password,
      )

      if (!isValidationPassword) return

      const user = await this.loginUserUseCase.execute(
        params.email,
        params.password,
      )

      return this.getUserHelper.responseStatusSuccess(res, 200, user)
    } catch (e) {
      console.error(e)

      return this.getUserHelper.responseStatusError(
        res,
        500,
        'Internal server error.',
      )
    }
  }
}
