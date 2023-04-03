/**
 * @file The Line Games API in the game server
 * @author synzr <sora@synzr.ru>
 */

const { Router } = require('express')

const byPfSessionTokenMiddleware = require('../../middlewares/by-pf-session-token')
const router = new Router()

// TODO: figure out what is data.gnidStatus and data.blockStatus
// TODO: make data.countryCreated real
router.post('/getnid', byPfSessionTokenMiddleware, (req, res) => {
  return res.json({
    isSuccess: true,
    data: {
      gnidStatus: '',
      blockStatus: '',
      countryCreated: 'RU',
      nid: res.locals.user.id,
      gnid: res.locals.user.guid_hash
    }
  })
})

module.exports = router
