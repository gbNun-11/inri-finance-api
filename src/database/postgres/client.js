import 'dotenv/config.js'
import { Pool } from 'pg'

const isProduction = process.env.NODE_ENV === 'production'

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
})

export const PostgresHelper = {
  query: async (query, params) => {
    const client = await pool.connect()

    try {
      const result = await client.query(query, params)
      return result
    } finally {
      client.release()
    }
  },
}
