/**
 * @file Useful utilities
 * @author synzr <sora@synzr.ru>
 */

const config = require('config')
const winston = require('winston')

const knex = require('knex')
const knexfile = require('./knexfile')

/**
 * Gets the configuration value or default.
 *
 * @param {String} key Configuration key
 * @param {any} defaultValue Default value
 *
 * @returns Value from configuration or default
 */
const getConfigurationValueOrDefault = (key, defaultValue = null) =>
  config.has(key) ? config.get(key) : defaultValue

/**
 * Creates a configured Winston logger
 *
 * @param {String} environment Environment name
 * @returns {winston.Logger} The logger instance
 */
const createLogger = (environment = 'development') =>
  winston.createLogger({
    level: environment === 'production' ? 'info' : 'debug',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' }),
      ...(
        environment !== 'production'
          ? [
              new winston.transports.Console({ format: winston.format.simple() })
            ]
          : []
      )
    ]
  })

/**
 * Creates a configured Knex instance
 *
 * @param {String} environment Environment name
 * @returns {knex.Knex} The Knex instance
 */
const createKnex = (environment = 'development') =>
  knex(
    Object.hasOwn(knexfile, environment)
      ? knexfile[environment]
      : knexfile.development
  )

module.exports = {
  getConfigurationValueOrDefault,
  create: { logger: createLogger, knex: createKnex }
}
