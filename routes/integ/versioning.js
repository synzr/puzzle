/**
 * @file The versioning API router
 * @author synzr <sora@synzr.ru>
 */

const { Router } = require('express')
const router = new Router()

// TODO: make data.countryInfo real
router.post('/getClientVersionInfo', async (req, res) => {
  const knex = req.app.get('knex')
  const { gameCd: gameCode, clientVersion, os } = req.body

  let gameId = await knex('nt_games')
    .select('id')
    .where('game_code', gameCode)
    .first()

  if (!gameId) {
    return res.json({ isSuccess: false })
  }

  gameId = gameId.id

  const client = await knex('it_client_versions')
    .where('game_id', gameId)
    .where('version_code', clientVersion)
    .first()

  if (!client) {
    return res.json({ isSuccess: false })
  }

  return res.json({
    isSuccess: true,
    data: {
      game_cd: gameCode,
      os,
      client_version: client.version_code,
      client_version_status: client.avaliable ? 'ONLINE' : 'OFFLINE',
      server_addr: `${req.protocol}://${req.get('Host')}/`,
      patch_addr: `${req.protocol}://${req.get('Host')}/`,
      maintenance_msg: '',
      guest_mode_on_yn: 'Y',
      applied_white_yn: 'N',
      out_link_url: null,
      countryInfo: {
        countryCd: 'US',
        gdprTargetYn: 'N'
      },
      countryTermsInfos: [
        {
          cd: 'TERMS_OF_SERVICES',
          required: true,
          url: 'https://cs.line.games/policy/ingame?termsCd=TERMS_OF_SERVICES&companyCd=LINE_GAMES&countryCd=US&gameCd=SL'
        },
        {
          cd: 'PRIVACY_POLICY',
          required: true,
          url: 'https://cs.line.games/policy/ingame?termsCd=PRIVACY_POLICY&companyCd=LINE_GAMES&countryCd=US&gameCd=SL'
        },
        {
          cd: 'PRIVACY_POLICY_FULLTEXT',
          required: true,
          url: 'https://cs.line.games/policy/ingame?termsCd=PRIVACY_POLICY&companyCd=LINE_GAMES&countryCd=US&gameCd=SL'
        },
        {
          cd: 'USE_OF_PUSH_NOTIFICATIONS',
          required: false,
          url: 'https://cs.line.games/policy/ingame?termsCd=USE_OF_PUSH_NOTIFICATIONS&companyCd=LINE_GAMES&countryCd=US&gameCd=SL'
        }
      ],
      gdprAgeCheckUrl: null,
      customValue: ''
    }
  })
})

module.exports = router
