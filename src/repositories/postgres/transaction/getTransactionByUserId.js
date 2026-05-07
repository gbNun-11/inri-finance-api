import { PostgresHelper } from '../../../database/postgres/client.js'

export class PostgresGetTransactionByUserIdRepository {
  async execute(userId, from, to) {
    let query = `
      SELECT *
      FROM transactions
      WHERE user_id = $1
    `

    const values = [userId]

    if (from) {
      query += ` AND transaction_date >= $${values.length + 1}`
      values.push(from)
    }

    if (to) {
      query += ` AND transaction_date <= $${values.length + 1}`
      values.push(to)
    }

    query += ' ORDER BY transaction_date DESC'

    const transactions = await PostgresHelper.query(query, values)

    return transactions.rows
  }
}
