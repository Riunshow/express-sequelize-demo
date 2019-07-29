'use strict'

const log = require('log4js').getLogger('middleware')
const userModel = require('../models').User
const { getToken } = require('../utils/token')

/**
 * 校验权限
 * @param {*} code  group code
 */
async function _checkRole(code, req, res, next) {
	const token = getToken(req)

  try {
    const user_data = await userModel.findOne({
      where: {
        token
      }
		})
		const role_data = await user_data.getGroups()
		let status = false
		role_data.map(x => {
			if (x.code === code) {
				status = true
			}
		})

		if (status) {
			next()			
		}else {
			return res.send({
				success: false,
				code: 403,
				message: '用户无权限'
			})
		}
  } catch (error) {
		log.error(error.message, error)
		return res.send({
			success: false,
			code: -1,
			message: error.message
		})
  }
}

async function isAdmin(req, res, next) {
  await _checkRole('admin', req, res, next)
}

module.exports = {
  isAdmin
}