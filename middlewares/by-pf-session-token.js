/**
 * @file The authorization middleware. It uses PlatForm Session Token.
 * @author synzr <sora@synzr.ru>
 */

const jwt = require('jsonwebtoken')

/**
 * The authorization middleware. It uses PlatForm Session Token.
 *
 * @param {Express.Request} req Request object
 * @param {Express.Response} res Response object
 * @param {Function} next Next middleware
 */
const byPfSessionTokenMiddleware = async (req, res, next) => {
  const knex = req.app.get('knex')
  const logger = req.app.get('logger')
  const jwtSecret = req.app.get('jwtSecret')

  const { pfSessionToken: token } = req.body
  let tokenPayload

  try {
    tokenPayload = jwt.verify(token, jwtSecret)
  } catch (err) {
    logger.log({
      level: 'error',
      message: `JWT verification error. Message: ${err.message}`,
      details: { error: err }
    })
    return res.json({ success: false })
  }

  if (tokenPayload.type !== 'PLATFORM_SESSION_TOKEN') {
    return res.json({ success: false })
  }

  const user = await knex('nt_guest_users')
    .where('id', tokenPayload.userId)
    .first()

  const game = await knex('nt_games')
    .where('id', user.game_id)
    .first()

  res.locals.user = user
  res.locals.game = game

  return next()
}

module.exports = byPfSessionTokenMiddleware
