/**
 * @file Main script of the server emulator
 * @author synzr <sora@synzr.ru>
 */

const express = require('express')

const config = require('config')
const utilities = require('./puzzle.utils')

const crypto = require('crypto')

const gameServerRouter = require('./routes/neptune/game-server')
const langCultureRouter = require('./routes/neptune/lang-culture')
const loginRouter = require('./routes/neptune/login/index')
const policyRouter = require('./routes/neptune/policy')

const versioningRouter = require('./routes/integration/versioning')

const lineGamesRouter = require('./routes/game/line-games')

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
app.set(
  'jwtSecret', utilities.getConfigurationValueOrDefault(
    'jwtSecret', crypto.randomBytes(256).toString('hex')
  )
)

// Adds the middlewares
app.use(express.urlencoded({ extended: false }))

// Declares the routers
if (config.get('enabledApis').includes('neptune')) {
  app.use('/api/gameServer/', gameServerRouter)
  app.use('/api/langCulture/game/', langCultureRouter)
  app.use('/api/v1/login/', loginRouter)
  app.use('/api/policy/v2/nid/', policyRouter)
}

if (config.get('enabledApis').includes('integration')) {
  app.use('/api/api_version/', versioningRouter)
}

if (config.get('enabledApis').includes('game')) {
  app.use('/linegames/', lineGamesRouter)
}

if (app.get('environment') === 'development') {
  app.use((req, res, next) => {
    const logger = req.app.get('logger')

    logger.log({
      level: 'debug',
      message: `Unknown request. URL: ${req.originalUrl}, HTTP method: ${req.method}, user agent: ${req.get('user-agent')}`,
      details: {
        method: req.method,
        url: req.originalUrl,
        userAgent: req.get('user-agent'),
        body: req.body,
        headers: req.headers
      }
    })

    next()
  })
}

// Starts the listener
const listener = app.listen(app.get('port'), () => {
  const { address, port } = listener.address()
  const logger = app.get('logger')

  logger.log({
    level: 'info',
    message: `Listening at ${address}:${port}`,
    details: {
      address: {
        humanIp: `${address}:${port}`,
        ip: address,
        port
      }
    }
  })
})
