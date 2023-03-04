/**
 * @file Useful utilities
 * @author synzr <sora@synzr.ru>
 */

const config = require('config')
const winston = require('winston')

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

module.exports = { getConfigurationValueOrDefault, createLogger }
