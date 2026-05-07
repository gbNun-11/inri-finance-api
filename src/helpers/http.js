import validator from 'validator'

export class GetUserHelper {
  constructor(getUserByIdUseCase, getTransactionByIdUseCase) {
    this.getUserByIdUseCase = getUserByIdUseCase
    this.getTransactionByIdUseCase = getTransactionByIdUseCase
  }

  columnsTableUsers() {
    return ['first_name', 'last_name', 'email', 'password']
  }

  columnsTableLoginUsers() {
    return ['email', 'password']
  }

  columnsTableTransaction() {
    return ['name', 'date', 'amount', 'type']
  }

  columnsTableTransactionUpdate() {
    return ['name', 'date', 'amount', 'type']
  }

  typesTransaction() {
    return ['EARNING', 'EXPENSE', 'INVESTMENT']
  }

  responseStatusError = (res, code, text) => {
    return res.status(code).json({
      errorMessage: text,
    })
  }

  responseStatusSuccess(res, code, data) {
    return res.status(code).json(data)
  }

  validationDate(res, date) {
    if (typeof date !== 'string' || date.trim() === '') {
      this.responseStatusError(res, 400, 'Date query is required')
      return false
    }

    const isValidDate = validator.isDate(date, {
      format: 'YYYY-MM-DD',
      strictMode: true,
    })

    if (!isValidDate) {
      this.responseStatusError(res, 400, 'Date must be in format YYYY-MM-DD')
      return false
    }

    return true
  }

  validationEmail(res, email) {
    if (typeof email !== 'string' || email.trim() === '') {
      this.responseStatusError(
        res,
        400,
        'E-mail is required. Please provide a valid one',
      )
      return false
    }

    if (!validator.isEmail(email)) {
      this.responseStatusError(
        res,
        400,
        'Invalid e-mail. Please provide a valid one',
      )
      return false
    }

    return true
  }

  validationPassword(res, password) {
    if (typeof password !== 'string' || password.trim() === '') {
      this.responseStatusError(res, 400, 'Password is required')
      return false
    }

    if (password.length < 6) {
      this.responseStatusError(
        res,
        400,
        'Password must be at least 6 characters',
      )
      return false
    }

    return true
  }

  validationAmount(res, amount) {
    if (typeof amount !== 'number') {
      this.responseStatusError(res, 400, 'The type amount must be number.')
      return false
    }

    if (Number.isNaN(amount)) {
      this.responseStatusError(res, 400, 'The amount must be a valid number.')
      return false
    }

    if (amount <= 0) {
      this.responseStatusError(res, 400, 'The amount must be greater than 0.')
      return false
    }

    if (
      !validator.isCurrency(amount.toFixed(2), {
        digits_after_decimal: [2],
        allow_negatives: false,
        decimal_separator: '.',
      })
    ) {
      this.responseStatusError(res, 400, 'The amount must be a valid currency.')
      return false
    }

    return true
  }

  async validationTransactionId(res, id) {
    if (typeof id !== 'string' || id.trim() === '') {
      this.responseStatusError(res, 400, 'Transaction ID is required')
      return false
    }

    if (!validator.isUUID(id)) {
      this.responseStatusError(res, 400, 'Transaction ID is not valid')
      return false
    }

    const transaction = await this.getTransactionByIdUseCase.execute(id)

    if (!transaction) {
      this.responseStatusError(res, 404, 'Transaction not found.')
      return false
    }

    return transaction
  }

  async validationUserId(res, userId) {
    if (typeof userId !== 'string' || userId.trim() === '') {
      this.responseStatusError(res, 400, 'User ID is required')
      return false
    }

    if (!validator.isUUID(userId)) {
      this.responseStatusError(res, 400, 'User ID is not valid')
      return false
    }

    const user = await this.getUserByIdUseCase.execute(userId)

    if (!user) {
      this.responseStatusError(res, 404, 'User not found.')
      return false
    }

    return user
  }

  validatRequiredFields(res, params, requiredFields) {
    for (const field of requiredFields) {
      const value = params[field]

      if (value === undefined || value === null) {
        this.responseStatusError(res, 400, `Missing param: ${field}`)
        return false
      }

      if (typeof value === 'string' && validator.isEmpty(value.trim())) {
        this.responseStatusError(res, 400, `Missing param: ${field}`)
        return false
      }

      if (typeof value === 'number' && Number.isNaN(value)) {
        this.responseStatusError(res, 400, `Invalid numeric param: ${field}`)
        return false
      }
    }

    return true
  }

  validateFieldsNull(res, params) {
    if (!params || Object.keys(params).length === 0) {
      this.responseStatusError(
        res,
        400,
        'At least one field must be provided to update the transaction',
      )
      return false
    }

    return true
  }

  validationTypeParams(res, type) {
    if (typeof type !== 'string') {
      this.responseStatusError(
        res,
        400,
        'The type must be EARNING, EXPENSE or INVESTMENT.',
      )
      return false
    }

    const types = type.trim().toUpperCase()
    const allowedTypes = this.typesTransaction()

    if (!allowedTypes.includes(types)) {
      this.responseStatusError(
        res,
        400,
        'The type must be EARNING, EXPENSE or INVESTMENT',
      )
      return false
    }

    return types
  }
}
