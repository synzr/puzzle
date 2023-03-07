/**
 * @file Useful utilities
 * @author synzr <sora@synzr.ru>
 */

const crypto = require('crypto')

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

/**
 * Calcuates a device hash.
 *
 * @param {String} deviceModel Device model
 * @param {String} adjustId Adjust identifier
 * @param {String} adjustIdType Adjust identifier type
 * @param {String} adjustAppToken Adjust application token
 *
 * @returns {String} Device hash
 */
const calculateDeviceHash = (deviceModel, adjustId, adjustIdType, adjustAppToken) =>
  crypto
    .createHash('sha256')
    .update(`${deviceModel}|${adjustId}|${adjustIdType}|${adjustAppToken}`)
    .digest('hex')

/**
 * Generate a guest user identifier hash.
 *
 * @param {String} id Identifier
 * @param {String} deviceHash Device hash
 * @param {String} userGeneratedId User-generated identifer
 * @param {String} gameId Game identifier
 *
 * @returns {String} Guest user identifier hash
 */
const generateGuidHash = (id, deviceHash, userGeneratedId, gameId) =>
  crypto
    .createHash('sha256')
    .update(`${id}|${deviceHash}|${userGeneratedId}|${gameId}`)
    .digest('hex')

/**
 * Converts the boolean value to the Y/N string.
 *
 * @param {Boolean} value Boolean value
 * @returns {String} Converted value
 */
const convertBooleanToYN = (value) => value ? 'Y' : 'N'

module.exports = {
  getConfigurationValueOrDefault,
  calculateDeviceHash,
  generateGuidHash,
  convertBooleanToYN,
  create: { logger: createLogger, knex: createKnex }
}
