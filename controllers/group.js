const userModel = require('../models').User
const groupModel = require('../models').Group
const log = require('log4js').getLogger('group')

const {
  getToken
} = require('../utils/token')

class Group {
  constructor() {}

  // 创建分组
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
          success: true
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

  // 给用户设置分组
  async setGroupForUser(req, res, next) {
    const { groupId } = req.body
    const token = getToken(req)

    try {
      const group_data = await groupModel.findOne({
        where: {
          id: groupId
        }
      })
      if (!group_data) {
        res.send({
          success: false,
          code: 401,
          message: '分组不存在'
        })
        return
      }
      const user_data = await userModel.findOne({
        where: {
          token
        }
      })

      const result = await user_data.addGroup(group_data)

      if (!result) {
        res.send({
          success: false,
          code: -1,
          message: '该分组已经存在该用户'
        })
        return
      }

      res.send({
        success: true
      })
    } catch (error) {
      log.error(error.message, error)
      return res.send({
        success: false,
        code: -1,
        message: error.message
      })
    }
  }

  // 查询全部分组
  async getAllGroup(req, res, next) {
    try {
      const data = await groupModel.findAll()
      res.send({
        success: true,
        data
      })
    } catch (error) {
      log.error(error.message, error)
      return res.send({
        success: false,
        code: -1,
        message: error.message
      })
    }
  }

  // 把某个用户从某分组删除
  async deleteUserFromGroup(req, res, next) {
    const { userId, groupId } = req.body

    try {
      const user_data = await userModel.findOne({
        where: {
          id: userId
        }
      })
      const group_data = await groupModel.findOne({
        where: {
          id: groupId
        }
      })
      if (!user_data || !group_data) {
        return res.send({
          success: false,
          code: 400,
          message: '用户或分组不存在'
        })
      }
      const data = await group_data.removeUser(user_data)
      res.send({
        success: true
      })
    } catch (error) {
      log.error(error.message, error)
      return res.send({
        success: false,
        code: -1,
        message: error.message
      })
    }
  }

}

module.exports = new Group()
