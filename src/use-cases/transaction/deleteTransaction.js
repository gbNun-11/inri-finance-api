import { ForbiddenError } from '../../errors/user.js'

export class DeleteTransactionUseCase {
  constructor(
    postgresDeleteTransactionRepository,
    postgresGetTransactionByIdRepository,
  ) {
    this.postgresDeleteTransactionRepository =
      postgresDeleteTransactionRepository
    this.postgresGetTransactionByIdRepository =
      postgresGetTransactionByIdRepository
  }
  async execute(transactionId, userId) {
    const transaction =
      await this.postgresGetTransactionByIdRepository.execute(transactionId)

    if (transaction.user_id !== userId) {
      throw new ForbiddenError()
    }

    return await this.postgresDeleteTransactionRepository.execute(transactionId)
  }
}
