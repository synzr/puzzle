/**
 * @file Initial seed for the Toro Puzzle base database
 * @author synzr <sora@synzr.ru>
 */

const { v4: uuid } = require('uuid')
const toroId = uuid()

/**
 * Seed function
 * @param { import("knex").Knex } knex
 */
const seed = (knex) => knex('nt_games')
  .insert({ id: toroId, game_code: 'TR' })
  .then(
    () => knex('nt_localizations')
      .insert([
        {
          id: uuid(),
          iso_code: 'ko_KR',
          korean_name: '한국어(대한민국)',
          native_name: '한국어'
        },
        {
          id: uuid(),
          iso_code: 'en_US',
          korean_name: '영어(미국)',
          native_name: 'English'
        },
        {
          id: uuid(),
          iso_code: 'ja_JP',
          korean_name: '일본어(일본)',
          native_name: '日本語'
        },
        {
          id: uuid(),
          iso_code: 'zh_CN',
          korean_name: '중국어 간체(중국)',
          native_name: '中文(简体)'
        }
      ])
      .returning('*')
      .then(
        (localizations) => knex('nt_localizations_games')
          .insert(localizations.map((localization) => ({
            id: uuid(),
            game_id: toroId,
            localization_id: localization.id
          })))
      )
  )

module.exports = { seed }
