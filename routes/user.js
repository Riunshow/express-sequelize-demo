'use strict'

const express = require('express')
const router = express.Router()
const User = require('../controllers/user')

// 注册用户
router.post('/', User.createUser)

// 登录
router.post('/authentication', User.login)

// 退出登录
router.post('/signout', User.signout)

module.exports = router