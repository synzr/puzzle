/**
 * @file The language culture API router
 * @author synzr <sora@synzr.ru>
 */

const { Router } = require('express')
const router = new Router()

router.post('/useList', async (req, res) => {
  const knex = req.app.get('knex')
  const logger = req.app.get('logger')

  const { gameCd: gameCode, clientVersion, os } = req.body

  logger.log({
    level: 'info',
    message: `Avaliable localizations of the game ${gameCode} was requested. Client version: ${clientVersion}, platform: ${os}`,
    details: { clientVersion, platform: os, gameCode }
  })

  let gameId = await knex('nt_games')
    .select('id')
    .where('game_code', gameCode)
    .first()

  if (!gameId) {
    logger.log({
      level: 'warn',
      message: `Game ${gameCode} not found.`,
      details: { gameCode }
    })
    return res.json({ isSuccess: false })
  }

  gameId = gameId.id

  const localizations = await knex('nt_localizations').whereIn('id',
    knex('nt_localizations_games')
      .select('localization_id')
      .where('game_id', gameId)
  )
  logger.log({
    level: 'info',
    message: `Successfully found ${localizations.length} avaliable localizations of the game ${gameCode}.`,
    details: { count: localizations.length, gameCode }
  })

  return res.json({
    isSuccess: true,
    data: localizations.map((localization) => ({
      langCulture: localization.iso_code,
      name: localization.korean_name,
      displayName: localization.native_name
    }))
  })
})

module.exports = router
