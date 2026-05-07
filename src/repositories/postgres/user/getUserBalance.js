import { PostgresHelper } from '../../../database/postgres/client.js'

export class PostgresGetUserBalanceRepository {
  async execute(userId, from, to) {
    let query = `
      WITH balance_data AS (
        SELECT 
          COALESCE(SUM(CASE WHEN type = 'EARNING' THEN amount ELSE 0 END), 0) AS earning,
          COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) AS expense,
          COALESCE(SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END), 0) AS investment
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

    query += `
      )
      SELECT
        earning,
        expense,
        investment,
        earning - expense - investment AS balance,

        CASE 
          WHEN (earning + expense + investment) = 0 THEN 0
          ELSE TRUNC((earning / (earning + expense + investment)) * 100, 2)
        END AS earning_percentage,

        CASE 
          WHEN (earning + expense + investment) = 0 THEN 0
          ELSE TRUNC((expense / (earning + expense + investment)) * 100, 2)
        END AS expense_percentage,

        CASE 
          WHEN (earning + expense + investment) = 0 THEN 0
          ELSE TRUNC((investment / (earning + expense + investment)) * 100, 2)
        END AS investment_percentage
      FROM balance_data
    `

    const balanceUser = await PostgresHelper.query(query, values)

    return {
      userId,
      ...balanceUser.rows[0],
    }
  }
}
