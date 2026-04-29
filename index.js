import 'dotenv/config.js'
import app from './app.js'

const port = process.env.PORT || 8030
app.listen(port, () => {
  console.log()
  console.log(`Listening on Port: ${port}`)
  console.log(`URL Acess: http://localhost:${port}`)
})
