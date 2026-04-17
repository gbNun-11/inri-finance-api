import { Pool } from 'pg'

export const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
})

export const PostgresHelper = {
  query: async (query, params) => {
    const client = await pool.connect()
    const result = await client.query(query, params)

    await client.release()
    return result
  },
}
