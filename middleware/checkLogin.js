'use strict'

const log = require('log4js').getLogger('middleware')
const userModel = require('../models').User
const { getToken, isExpireTime } = require('../utils/token')

// 检验登录态的中间件
async function checkLogin(req, res, next) {
  const token = getToken(req)

  if (!token) {
    return res.send({
      success: false,
      code: 403,
      message: 'token 不存在'
    })
  } else {
    try {
      const userData = await userModel.findOne({
        where: {
          token
        }
      })
      // 判断 token 是否过期   ttl 24h
      if (userData && !isExpireTime(userData.loginTime)) {
        next()
      }else {
        return res.send({
          success: false,
          code: 400,
          message: 'token 已过期'
        })
      }
    } catch (error) {
      log.error(error.message, error)
      res.send({
        success: false,
        code: -1,
        message: error.message
      })
      return
    }
  }
}

module.exports = {
  checkLogin
}