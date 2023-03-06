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
  connection: { filename: './db/database.sqlite3' },
  migrations: { directory: './db/migrations/' },
  seeds: { directory: './db/seeds/' },
  useNullAsDefault: true // SQLite doesn't support auto-default values
}

module.exports = { development }
