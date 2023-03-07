/**
 * @file The main router of the Login API
 * @author synzr <sora@synzr.ru>
 */

const { Router } = require('express')

const guestRouter = require('./guest')
const router = new Router()

router.use('/guest', guestRouter)

module.exports = router
