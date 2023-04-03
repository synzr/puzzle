/**
 * @file The notification API router
 * @author synzr <sora@synzr.ru>
 */

const { Router } = require('express')
const byPfSessionTokenMiddleware = require('../../middlewares/by-pf-session-token')

const router = new Router()

router.post('/token/register/forClient', byPfSessionTokenMiddleware, (req, res) => {
  const logger = req.app.get('logger')

  logger.log({
    level: 'info',
    message: `User ${res.locals.user.id} registered to the push notifications.`,
    details: { userId: res.locals.user.id }
  })

  return res.json({ success: true })
})

module.exports = router
