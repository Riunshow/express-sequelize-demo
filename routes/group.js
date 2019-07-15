'use strict'

const express = require('express')
const router = express.Router()
const Group = require('../controllers/group')

const { checkLogin } = require('../middleware/checkLogin')

// 新增group
router.post('/', checkLogin, Group.createGroup)

module.exports = router