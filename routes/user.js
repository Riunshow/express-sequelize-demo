'use strict'

const express = require('express')
const router = express.Router()
const User = require('../controllers/user')

const { checkLogin } = require('../middleware/checkLogin')
const { isAdmin } = require('../middleware/checkRole')

// 注册用户
router.post('/', User.createUser)

// 登录
router.post('/authentication', User.login)

// 退出登录
router.post('/signout', User.signout)

// 根据 group code 获取用户列表
router.get('/getUserListByGroup', checkLogin, isAdmin, User.getUserListByGroup)

module.exports = router