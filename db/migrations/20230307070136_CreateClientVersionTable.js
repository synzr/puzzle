/**
 * @file Initial migration of the Integration API's client version table
 * @author synzr <sora@synzr.ru>
 */

/**
 * The up function
 * @param { import("knex").Knex } knex
 */
const up = (knex) => knex.schema
  .createTable('it_client_versions', (table) => {
    table.uuid('id').primary()
    table
      .uuid('game_id')
      .references('id')
      .inTable('nt_games')
    table.string('version_code').notNullable()
    table.boolean('avaliable').defaultTo(true)
  })

/**
 * The down function
 * @param { import("knex").Knex } knex
 */
const down = (knex) => knex.schema.dropTableIfExists('it_client_versions')

module.exports = { up, down }
