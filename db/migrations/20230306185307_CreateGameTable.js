/**
 * @file Initial migration of the Neptune API's game table
 * @author synzr <sora@synzr.ru>
 */

/**
 * The up function
 * @param { import("knex").Knex } knex
 */
const up = (knex) => knex.schema.createTable('nt_games', (table) => {
  table.uuid('id').primary()
  table.string('game_code', 3).notNullable().unique()
})

/**
 * The down function
 * @param { import("knex").Knex } knex
 */
const down = (knex) => knex.schema.dropTableIfExists('nt_games')

module.exports = { up, down }
