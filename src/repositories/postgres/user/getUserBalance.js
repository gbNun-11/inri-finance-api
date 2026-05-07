import { PostgresHelper } from '../../../database/postgres/client.js'

export class PostgresGetUserBalanceRepository {
  async execute(userId, from, to) {
    let query = `
      SELECT 
        COALESCE(
          SUM(CASE WHEN type = 'EARNING' THEN amount ELSE 0 END),
          0
        ) AS earning,

        COALESCE(
          SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END),
          0
        ) AS expense,

        COALESCE(
          SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END),
          0
        ) AS investment,

        (
          COALESCE(
            SUM(CASE WHEN type = 'EARNING' THEN amount ELSE 0 END),
            0
          )
          -
          COALESCE(
            SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END),
            0
          )
          -
          COALESCE(
            SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END),
            0
          )
        ) AS balance

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

    const balanceUser = await PostgresHelper.query(query, values)

    return {
      userId,
      ...balanceUser.rows[0],
    }
  }
}
