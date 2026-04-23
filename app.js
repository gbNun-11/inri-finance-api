import express from 'express'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'

import userRoutes from './src/routes/user.js'
import transactionRoutes from './src/routes/transaction.js'

class App {
  constructor() {
    this.app = express()
    this.swaggerDocument = this.loadSwagger()
    this.middlewares()
    this.routes()
  }

  loadSwagger() {
    const swaggerPath = new URL('./docs/swagger.json', import.meta.url)
    return JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'))
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.json())
  }

  routes() {
    this.app.use('/api/users', userRoutes)
    this.app.use('/api/transactions', transactionRoutes)
    this.app.use(
      '/docs',
      swaggerUi.serve,
      swaggerUi.setup(this.swaggerDocument),
    )
  }
}

export default new App().app
