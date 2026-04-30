import 'dotenv/config.js'
import app from './app.js'

const port = process.env.PORT || 8030
app.listen(port, () => {
  console.log()
  if (process.env.NODE_ENV === 'development') {
    console.log('Running in development mode')
  }
  console.log()
  console.log(`Listening on Port: ${port}`)
  console.log(`URL Acess: http://localhost:${port}`)
})
