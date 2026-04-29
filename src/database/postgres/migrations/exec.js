import 'dotenv/config.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { pool } from '../client.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const executeMigrations = async () => {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    const migrationFiles = fs
      .readdirSync(__dirname)
      .filter((file) => file.endsWith('.sql'))
      .sort()

    for (const file of migrationFiles) {
      const migrationAlreadyExecuted = await client.query(
        'SELECT id FROM migrations WHERE name = $1',
        [file],
      )

      if (migrationAlreadyExecuted.rows.length > 0) {
        console.log(`Migration skipped: ${file}`)
        continue
      }

      const filePath = path.join(__dirname, file)
      const script = fs.readFileSync(filePath, 'utf-8')

      await client.query(script)

      await client.query('INSERT INTO migrations (name) VALUES ($1)', [file])

      console.log(`Migration executed: ${file}`)
    }

    await client.query('COMMIT')
    console.log('Migrations executed successfully.')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error executing migrations:', error)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

executeMigrations()
