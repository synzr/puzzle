/**
 * @file The notification API router
 * @author synzr <sora@synzr.ru>
 */

const { Router } = require('express')
const jwt = require('jsonwebtoken')

const byPfSessionTokenMiddleware = require('../../middlewares/by-pf-session-token')

const router = new Router()

router.post('/token/register/forClient', byPfSessionTokenMiddleware, (req, res) => {
  const logger = req.app.get('logger')
  const jwtSecret = req.app.get('jwtSecret')

  const pushToken = jwt.sign({
    tokenType: 'PUSH_NOTIFICATION_TOKEN',
    userId: res.locals.user.id,
    gameId: res.locals.game.id
  }, jwtSecret, {
    expiresIn: '24h'
  })
  
  logger.log({
    level: 'info',
    message: `User ${res.locals.user.id} registered to the push notifications.`,
    details: { userId: res.locals.user.id }
  })

  return res.json({
    success: true,
    data: { pushToken } 
  })
})

module.exports = router
