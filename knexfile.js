/**
 * @file Knex configuration file
 * @author synzr <sora@synzr.ru>
 */

/**
 * Development settings
 *
 * @readonly
 * @type {import("knex").Knex.Config}
 */
const development = {
  client: 'better-sqlite3',
  connection: {
    filename: 'database.sqlite3'
  },
  useNullAsDefault: true // SQLite doesn't support auto-default values
}

module.exports = { development }
