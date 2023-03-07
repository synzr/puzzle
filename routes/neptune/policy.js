/**
 * @file The policy API router
 * @author synzr <sora@synzr.ru>
 */

const { Router } = require('express')

const byPfSessionTokenMiddleware = require('../../middlewares/by-pf-session-token')
const router = new Router()

router.post(
  '/agree/request/byPfSessionToken/forClient',
  byPfSessionTokenMiddleware,
  async (req, res) => {
    const knex = req.app.get('knex')
    const logger = req.app.get('logger')

    for (const field of ['privacyAgreeYn', 'termsAgreeYn', 'pushAgreeYn']) {
      if (!Object.hasOwn(req.body, field)) {
        return res.json({ success: false })
      }
    }

    const result = {}

    if (Object.hasOwn(req.body, 'privacyAgreeYn')) {
      result.privacy_agree = req.body.privacyAgreeYn === 'Y'
      result.privacy_agree_timestamp = Date.now()
    }

    if (Object.hasOwn(req.body, 'termsAgreeYn')) {
      result.terms_agree = req.body.termsAgreeYn === 'Y'
      result.terms_agree_timestamp = Date.now()
    }

    if (Object.hasOwn(req.body, 'pushAgreeYn')) {
      result.push_agree = req.body.pushAgreeYn === 'Y'
      result.push_agree_timestamp = Date.now()
    }

    await knex('nt_guest_users')
      .update(result)
      .where('id', res.locals.user.id)
    logger.log({
      level: 'info',
      message: `Guest user ${res.locals.user.id} updated the agree data. Privacy: ${req.body.privacyAgreeYn}, terms: ${req.body.termsAgreeYn}, push notifications: ${req.body.pushAgreeYn}`,
      details: {
        userId: res.locals.user.id,
        privacyAgree: result.privacy_agree || null,
        termsAgree: result.terms_agree || null,
        pushNotificationsAgree: result.push_agree || null
      }
    })

    return res.json({ success: true })
  }
)

module.exports = router
