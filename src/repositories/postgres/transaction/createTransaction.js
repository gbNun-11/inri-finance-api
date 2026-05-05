import { PostgresHelper } from '../../../database/postgres/client.js'

export class PostgresCreateTransactionRepository {
  async execute(createTransactionParams) {
    const results = await PostgresHelper.query(
      'INSERT INTO transactions (id, userId, name, transaction_date, amount, type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        createTransactionParams.id,
        createTransactionParams.userId,
        createTransactionParams.name,
        createTransactionParams.date,
        createTransactionParams.amount,
        createTransactionParams.type,
      ],
    )

    return results.rows[0]
  }
}
