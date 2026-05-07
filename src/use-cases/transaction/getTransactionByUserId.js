export class GetTransactionByUserIdUseCase {
  constructor(postgresGetTransactionByUserIdRepository) {
    this.postgresGetTransactionByUserIdRepository =
      postgresGetTransactionByUserIdRepository
  }
  async execute({ userId, from, to }) {
    const transactions =
      await this.postgresGetTransactionByUserIdRepository.execute(
        userId,
        from,
        to,
      )

    return transactions
  }
}
