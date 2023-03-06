/**
 * @file Initial migration of the Neptune API's localization table
 * @author synzr <sora@synzr.ru>
 */

/**
 * The up function
 * @param { import("knex").Knex } knex
 */
const up = (knex) => knex.schema
  .createTable('nt_localizations', (table) => {
    table.uuid('id').primary()
    table.string('iso_code', 6).notNullable()
    table.string('korean_name', 16).defaultTo('자리 표시자') // Placeholder in Korean
    table.string('native_name', 16).defaultTo('Placeholder')
  })
  .createTable('nt_localizations_games', (table) => {
    table.uuid('id').primary()
    table
      .uuid('game_id')
      .references('id')
      .inTable('nt_games')
    table
      .uuid('localization_id')
      .references('id')
      .inTable('nt_localizations')
  })

/**
 * The down function
 * @param { import("knex").Knex } knex
 */
const down = (knex) => knex.schema
  .dropTableIfExists('nt_localizations')
  .dropTableIfExists('nt_localizations_games')

module.exports = { up, down }
