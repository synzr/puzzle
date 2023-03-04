/**
 * @file Useful utilities
 * @author synzr <sora@synzr.ru>
 */

const config = require('config')

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

module.exports = { getConfigurationValueOrDefault }
