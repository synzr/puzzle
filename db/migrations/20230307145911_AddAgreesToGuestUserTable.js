/**
 * @file Migration, which adds agrees in the guest user table
 * @author synzr <sora@synzr.ru>
 */

/**
 * The up function
 * @param { import("knex").Knex } knex
 */
const up = (knex) => knex.schema
  .alterTable('nt_guest_users', (table) => {
    table.boolean('privacy_agree').nullable()
    table.timestamp('privacy_agree_timestamp').nullable()

    table.boolean('terms_agree').nullable()
    table.timestamp('terms_agree_timestamp').nullable()

    table.boolean('push_agree').nullable()
    table.timestamp('push_agree_timestamp').nullable()
  })

/**
 * The down function
 * @param { import("knex").Knex } knex
 */
const down = (knex) => knex.schema
  .alterTable('nt_guest_users', (table) => {
    table.dropColumns([
      'privacy_agree',
      'privacy_agree_timestamp',
      'terms_agree',
      'terms_agree_timestamp',
      'push_agree',
      'push_agree_timestamp'
    ])
  })

module.exports = { up, down }
