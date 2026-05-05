import { ForbiddenError } from '../../errors/user.js'

export class UpdateTransactionUseCase {
  constructor(
    postgresUpdateTransactionRepository,
    postgresGetTransactionByIdRepository,
  ) {
    this.postgresUpdateTransactionRepository =
      postgresUpdateTransactionRepository
    this.postgresGetTransactionByIdRepository =
      postgresGetTransactionByIdRepository
  }
  async execute(transactionId, userId, params) {
    const transaction =
      await this.postgresGetTransactionByIdRepository.execute(transactionId)

    if (transaction.user_id !== userId) {
      throw new ForbiddenError()
    }
    return await this.postgresUpdateTransactionRepository.execute(
      transactionId,
      params,
    )
  }
}
