import { ForbiddenError } from '../errors/user.js'

export class TransactionController {
  constructor(
    getUserHelper,
    createTransactionUseCase,
    getTransactionByUserIdUseCase,
    updateTransactionUseCase,
    deleteTransactionUseCase,
  ) {
    this.getUserHelper = getUserHelper
    this.createTransactionUseCase = createTransactionUseCase
    this.getTransactionByUserIdUseCase = getTransactionByUserIdUseCase
    this.updateTransactionUseCase = updateTransactionUseCase
    this.deleteTransactionUseCase = deleteTransactionUseCase
  }

  async show(req, res) {
    try {
      const userId = req.userId
      const { from, to } = req.query

      if (from) {
        const isValidFromDate = this.getUserHelper.validationDate(res, from)
        if (!isValidFromDate) return
      }

      if (to) {
        const isValidToDate = this.getUserHelper.validationDate(res, to)
        if (!isValidToDate) return
      }

      if (from && to && new Date(from) > new Date(to)) {
        return this.getUserHelper.responseStatusError(
          res,
          400,
          '"from" date cannot be greater than "to" date',
        )
      }

      const transactions = await this.getTransactionByUserIdUseCase.execute({
        userId,
        from,
        to,
      })

      return this.getUserHelper.responseStatusSuccess(res, 200, transactions)
    } catch (e) {
      console.error(e)
      return this.getUserHelper.responseStatusError(
        res,
        500,
        'Internal server error',
      )
    }
  }

  async update(req, res) {
    try {
      const params = req.body
      const userId = req.userId
      const fieldsBody = this.getUserHelper.validateFieldsNull(res, params)

      if (!fieldsBody) return

      const transactionId = req.params.transactionId

      const transaction = await this.getUserHelper.validationTransactionId(
        res,
        transactionId,
      )
      if (!transaction) return

      const allowedFields = this.getUserHelper.columnsTableTransactionUpdate()

      const someFieldIsNotAllowed = Object.keys(params).some(
        (field) => !allowedFields.includes(field),
      )

      if (someFieldIsNotAllowed) {
        return this.getUserHelper.responseStatusError(
          res,
          400,
          'Some provided field is not allowed',
        )
      }

      if (params.amount !== undefined) {
        const amountIsValid = this.getUserHelper.validationAmount(
          res,
          params.amount,
        )

        if (!amountIsValid) return
      }

      if (params.type !== undefined) {
        const isValidType = this.getUserHelper.validationTypeParams(
          res,
          params.type,
        )

        if (!isValidType) return
        params.type = isValidType
      }

      const updatedTransaction = await this.updateTransactionUseCase.execute(
        transactionId,
        userId,
        params,
      )

      return this.getUserHelper.responseStatusSuccess(
        res,
        200,
        updatedTransaction,
      )
    } catch (e) {
      if (e instanceof ForbiddenError) {
        return this.getUserHelper.responseStatusError(res, 403, e.message)
      }
      console.error(e)
      return this.getUserHelper.responseStatusError(
        res,
        500,
        'Internal server error',
      )
    }
  }

  async store(req, res) {
    try {
      const params = req.body
      const userId = req.userId

      const requiredFields = this.getUserHelper.columnsTableTransaction()

      const validatFields = this.getUserHelper.validatRequiredFields(
        res,
        params,
        requiredFields,
      )
      if (!validatFields) return

      const user = await this.getUserHelper.validationUserId(res, userId)
      if (!user) return

      const isValidationAmount = this.getUserHelper.validationAmount(
        res,
        params.amount,
      )
      if (!isValidationAmount) return

      if (params.type !== undefined) {
        const isValidType = this.getUserHelper.validationTypeParams(
          res,
          params.type,
        )
        if (!isValidType) return
        params.type = isValidType
      }

      const createdTransaction =
        await this.createTransactionUseCase.execute(params)

      return this.getUserHelper.responseStatusSuccess(
        res,
        201,
        createdTransaction,
      )
    } catch (e) {
      console.error(e)
      return this.getUserHelper.responseStatusError(
        res,
        500,
        'Internal server error',
      )
    }
  }

  async delete(req, res) {
    try {
      const transactionId = req.params.transactionId
      const userId = req.userId

      const transaction = await this.getUserHelper.validationTransactionId(
        res,
        transactionId,
      )
      if (!transaction) return

      const deletedTransaction = await this.deleteTransactionUseCase.execute(
        transactionId,
        userId,
      )

      return this.getUserHelper.responseStatusSuccess(
        res,
        200,
        deletedTransaction,
      )
    } catch (e) {
      if (e instanceof ForbiddenError) {
        return this.getUserHelper.responseStatusError(res, 403, e.message)
      }
      console.error(e)
      return this.getUserHelper.responseStatusError(
        res,
        500,
        'Internal server error',
      )
    }
  }
}
