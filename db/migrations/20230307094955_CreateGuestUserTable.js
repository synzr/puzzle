/**
 * @file Initial migration of the Neptune API's guest user table
 * @author synzr <sora@synzr.ru>
 */

/**
 * The up function
 * @param { import("knex").Knex } knex
 */
const up = (knex) => knex.schema
  .createTable('nt_guest_users', (table) => {
    table.uuid('id').primary()
    table.string('gnid_hash').notNullable().unique()
    table.string('device_hash').notNullable()
    table.string('user_generated_id').notNullable().unique()
    table
      .uuid('game_id')
      .references('id')
      .inTable('nt_games')
  })

/**
 * The down function
 * @param { import("knex").Knex } knex
 */
const down = (knex) => knex.schema.dropTableIfExists('nt_guest_users')

module.exports = { up, down }
