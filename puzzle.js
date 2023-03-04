/**
 * @file Main script of the server emulator
 * @author synzr <sora@synzr.ru>
 */

const express = require('express')
const utilities = require('./puzzle.utils')

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

// Declares the routes
app.get('/', (req, res) => res.send({ hello: 'world' }))

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
