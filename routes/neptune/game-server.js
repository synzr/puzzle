/**
 * @file The game server API router
 * @author synzr <sora@synzr.ru>
 */

const { Router } = require('express')
const router = new Router()

router.post('/list', async (req, res) => {
  const knex = req.app.get('knex')
  const { gameCd: gameCode } = req.body

  let gameId = await knex('nt_games')
    .select('id')
    .where('game_code', gameCode)
    .first()

  if (!gameId) {
    return res.json({ isSuccess: true, data: [] })
  }

  gameId = gameId.id

  const servers = await knex('nt_servers').where('game_id', gameId)
  return res.json({
    isSuccess: true,
    data: servers.map((server) => ({
      gameServerId: server.id,
      gameServerNm: server.id
    }))
  })
})

module.exports = router
