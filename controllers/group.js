const userModel = require('../models').User
const groupModel = require('../models').Group
const log = require('log4js').getLogger('group')

const {
  getToken,
  generateToken
} = require('../utils/token')

class Group {
  constructor() {}

  async createGroup(req, res, next) {
    const { code, name } = req.body
    try {
      if (!code || !name) {
        res.send({
          success: false,
          code: 400,
          message: '必填参数不能为空'
        })
      }
    } catch (error) {
      log.error(err.message, err)
      res.send({
        success: false,
        code: -1,
        message: err.message
      })
      return
    }

    try {
      const data = await groupModel.findOrCreate({
        where: {
          code
        },
        defaults: {
          code,
          name
        }
      })
      if (!data[data.length - 1]) {
        res.send({
          success: false,
          code: -1,
          message: '分组已存在或 code 值重复'
        })
      } else {
        res.send({
          success: true,
          code: 200
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

  async setGroupForUser(req, res, next) {
    const { groupId } = req.body
    const token = getToken(req)

    try {
      const group_data = await groupModel.findOne({
        where: {
          groupId
        }
      })
      if (!group_data) {
        res.send({
          success: false,
          status: 401,
          message: '用户不存在'
        })
        return
      }
      const user_data = await userModel.findOne({
        where: {
          token
        }
      })

      
      
    } catch (error) {
      
    }

  }

}

module.exports = new Group()
