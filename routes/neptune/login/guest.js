/**
 * @file The guest login implementation in Login API
 * @author synzr <sora@synzr.ru>
 */

const { Router } = require('express')

const { v4: uuid } = require('uuid')

const utilities = require('../../../puzzle.utils')
const jwt = require('jsonwebtoken')

const router = new Router()

router.post('/getLoginToken', async (req, res) => {
  const knex = req.app.get('knex')
  const jwtSecret = req.app.get('jwtSecret')
  const logger = req.app.get('logger')

  const {
    gameCd: gameCode,
    clientVersion,
    os,
    deviceModel,
    adjustAppToken,
    adjustId,
    adjustIdType,
    platformUserId,
    platformId
  } = req.body

  logger.log({
    level: 'info',
    message: `Guest token for the game ${gameCode} was requested. Client version: ${clientVersion}, platform: ${os}, device model: ${deviceModel}`,
    details: { clientVersion, platform: os, gameCode, deviceModel }
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

  const deviceHash = utilities.calculateDeviceHash(
    deviceModel, adjustId, adjustIdType, adjustAppToken
  )

  let newGuestUser = false
  let guestUser = await knex('nt_guest_users')
    .select('*')
    .where('game_id', gameId)
    .where('device_hash', deviceHash)
    .where('user_generated_id', platformUserId)
    .first()

  if (!guestUser) {
    const id = uuid()

    guestUser = {
      id,
      gnid_hash: utilities.generateGuidHash(id, deviceHash, platformUserId, gameId),
      device_hash: deviceHash,
      user_generated_id: platformUserId,
      game_id: gameId
    }

    await knex('nt_guest_users')
      .insert(guestUser)
    newGuestUser = true

    logger.log({
      level: 'info',
      message: `Guest user ${platformUserId} not found. Created a new one with this user-generated identifier.`,
      details: { platformUserId }
    })
  } else {
    logger.log({
      level: 'info',
      message: `Guest user ${platformUserId} was found.`,
      details: { platformUserId }
    })
  }

  const sessionToken = jwt.sign({
    userId: guestUser.id
  }, jwtSecret, {
    expiresIn: '24h'
  })

  logger.log({
    level: 'info',
    message: `Guest token for the game ${gameCode} was successfully generated.`,
    details: { gameCode }
  })

  return res.json({
    success: true,
    data: {
      newGnidYn: utilities.convertBooleanToYN(newGuestUser),
      gnidHash: guestUser.gnid_hash,
      pfSessionToken: sessionToken,
      countryCreated: 'US', // TODO: make this for real for real
      policyAgreeInfo: {
        termsAgreeUnixTS: null,
        privacyAgreeUnixTS: null,
        ageCheckCompletedUnixTS: null,
        privacyTransferAgreeUnixTS: null,
        pushAgreeYn: null,
        pushAgreeUnixTS: null,
        nightPushAgreeYn: null,
        nightPushAgreeUnixTS: null,
        needAgreePushYn: 'N',
        needReAgreePolicyYn: 'N'
      },
      linkedPlatformIdList: [
        parseInt(platformId, 10)
      ]
    }
  })
})

module.exports = router
