'use strict'

const userModel = require('../models').User

const { getToken, isExpireTime } = require('../utils/token')

// 检验登录态的中间件
async function checkLogin(req, res, next) {
  const token = getToken(req)

  if (!token) {
    return res.send({
      status: 403,
      message: '无访问权限'
    })
  } else {
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
        status: 400,
        message: 'token 已过期'
      })
    }
  }
}

// 校验权限
async function checkRole(req, res, next) {
  const token = getToken(req)

  try {
    const userData = await userModel.findOne({
      where: {
        token
      }
    })
  } catch (error) {
    
  }
}

module.exports = {
  checkLogin
}