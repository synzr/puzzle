/**
 * @file Initial migration of the Neptune API's server table
 * @author synzr <sora@synzr.ru>
 */

/**
 * The up function
 * @param { import("knex").Knex } knex
 */
const up = (knex) => knex.schema
  .createTable('nt_servers', (table) => {
    table.uuid('id').primary()
    table
      .uuid('game_id')
      .references('id')
      .inTable('nt_games')
  })

/**
 * The down function
 * @param { import("knex").Knex } knex
 */
const down = (knex) => knex.schema.dropTableIfExists('nt_servers')

module.exports = { up, down }
