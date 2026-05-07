export class CreateTransactionUseCase {
  constructor(postgresCreateTransactionRepository, UuidAdapter) {
    this.postgresCreateTransactionRepository =
      postgresCreateTransactionRepository
    this.uuidAdapter = UuidAdapter
  }
  async execute(createTransactionParams, userId) {
    const transactionId = this.uuidAdapter.generate()
    const transaction = await this.postgresCreateTransactionRepository.execute({
      ...createTransactionParams,
      id: transactionId,
      userId,
    })

    return transaction
  }
}
