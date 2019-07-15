'use strict'

const uid = require('uid-safe')

function generateToken () {
  return uid.sync(24)
}

function getToken (req, tokenHeader = 'x-access-token') {
  return req.headers[tokenHeader]
}

// 过期时间 24h
function isExpireTime (loginTime) {
  if (new Date().getTime() - new Date().getTime(loginTime) > 24 * 60 * 60) {
    return true
  }else {
    return false
  }
}


module.exports = {
  generateToken,
  getToken,
  isExpireTime
}