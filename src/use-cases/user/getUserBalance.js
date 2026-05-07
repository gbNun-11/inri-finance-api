export class GetUserBalanceUseCase {
  constructor(postgresGetUserBalanceRepository) {
    this.postgresGetUserBalanceRepository = postgresGetUserBalanceRepository
  }

  async execute({ userId, from, to }) {
    const balanceUser = await this.postgresGetUserBalanceRepository.execute(
      userId,
      from,
      to,
    )
    return balanceUser
  }
}
