/**
 * @file The game server API router
 * @author synzr <sora@synzr.ru>
 */

const { Router } = require('express')
const router = new Router()

router.post('/list', async (req, res) => {
  const knex = req.app.get('knex')
  const logger = req.app.get('logger')

  const { gameCd: gameCode, clientVersion, os } = req.body

  logger.log({
    level: 'info',
    message: `Avaliable game servers of the game ${gameCode} was requested. Client version: ${clientVersion}, platform: ${os}`,
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
    return res.json({ isSuccess: true, data: [] })
  }

  gameId = gameId.id

  const servers = await knex('nt_servers').where('game_id', gameId)
  logger.log({
    level: 'info',
    message: `Successfully found ${servers.length} avaliable game servers of the game ${gameCode}.`,
    details: { count: servers.length, gameCode }
  })

  return res.json({
    isSuccess: true,
    data: servers.map((server) => ({
      gameServerId: server.id,
      gameServerNm: server.id
    }))
  })
})

module.exports = router
