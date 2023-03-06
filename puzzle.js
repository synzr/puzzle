/**
 * @file Main script of the server emulator
 * @author synzr <sora@synzr.ru>
 */

const express = require('express')
const utilities = require('./puzzle.utils')

const langCultureRouter = require('./routes/neptune-sdk/lang-culture')

const app = express()

// Declares the application variables
app.set(
  'port', utilities.getConfigurationValueOrDefault(
    'port', process.env.PORT ? parseInt(process.env.PORT, 10) : 5000
  )
)
app.set(
  'environment', utilities.getConfigurationValueOrDefault(
    'environment', process.env.NODE_ENV || 'development'
  )
)
app.set(
  'logger', utilities.create.logger(
    app.get('environment')
  )
)
app.set(
  'knex', utilities.create.knex(
    app.get('environment')
  )
)

// Adds the middlewares
app.use(express.urlencoded({ extended: false }))
app.use((req, res, next) => {
  console.log('Method:', req.method)
  console.log('Full URL:', req.originalUrl)
  console.log('Body:', req.body)
  console.log('Headers:', req.headers)

  next()
})

// Declares the routers
app.use('/api/langCulture/game/', langCultureRouter)

// Starts the listener
const listener = app.listen(app.get('port'), () => {
  const { address, port } = listener.address()
  const logger = app.get('logger')

  logger.log({
    level: 'info',
    message: `Listening at ${address}:${port}`,
    address: { address, port }
  })
})
