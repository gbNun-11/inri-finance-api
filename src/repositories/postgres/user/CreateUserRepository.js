import { PostgresHelper } from '../../../database/postgres/client.js'

export class CreateUserRepository {
  async execute(createUserParams) {
    const result = await PostgresHelper.query(
      'INSERT INTO users (id, firstName, lastName, email, password) VALUES ($1, $2, $3, $4, $5)',
      [
        createUserParams.id,
        createUserParams.firstName,
        createUserParams.lastName,
        createUserParams.email,
        createUserParams.password,
      ],
    )
    return result.rows[0]
  }
}
