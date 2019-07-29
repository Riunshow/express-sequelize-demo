'use strict'

const express = require('express')
const router = express.Router()
const Group = require('../controllers/group')

const { checkLogin } = require('../middleware/checkLogin')
const { isAdmin } = require('../middleware/checkRole')

// 新增group
router.post('/', checkLogin, isAdmin, Group.createGroup)

// 用户设置分组
router.post('/set', checkLogin, isAdmin, Group.setGroupForUser)

// 查询全部分组
router.get('/', checkLogin, Group.getAllGroup)

// 把某个用户从某分组删除
router.delete('/delete_user', checkLogin, isAdmin, Group.deleteUserFromGroup)

module.exports = router