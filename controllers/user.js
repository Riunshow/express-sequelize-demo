const userModel = require('../models').User
const groupModel = require('../models/group').Group
const moment = require('moment')
const log = require('log4js').getLogger('user')

const {
  getToken,
  generateToken
} = require('../utils/token')
const {
  checkPwd,
  hashPwd
} = require('../utils/pwd')

class User {
  constructor() {}

  // 创建账户
  async createUser(req, res, next) {
    const {
      username,
      name,
      password,
      email
    } = req.body

    try {
      if (!username || !name || !email) {
        res.send({
          success: false,
          code: 400,
          message: '必填参数不能为空'
        })
      }
    } catch (err) {
      log.error(err.message, err)
      res.send({
        success: false,
        code: -1,
        message: err.message
      })
      return
    }

    try {
      const data = await userModel.findOne({
        where: {
          username,
        },
      })
      // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
      if (data) {
        res.send({
          success: false,
          code: -1,
          message: '账号或者姓名重复'
        })
        return
      }
    } catch (err) {
      log.error(err.message, err)
      res.send({
        success: false,
        code: -1,
        message: err.message
      })
      return
    }

    const hashPassword = await hashPwd(password)

    try {
      const newData = {
        username,
        name,
        email,
        password: hashPassword
      }
      await userModel.create(newData)
      res.send({
        success: true,
        code: 200
      })
    } catch (err) {
      log.error(err.message, err)
      res.send({
        success: false,
        code: -1,
        message: `创建账号失败, ${err.message}`
      })
      return
    }
  }

  // 登录
  async login(req, res, next) {
    const {
      username,
      password,
    } = req.body
    try {
      if (!username || !password) {
        res.send({
          success: false,
          code: 400,
          message: '参数不能为空'
        })
      }
    } catch (err) {
      log.error(err.message, err)
      res.send({
        success: false,
        code: -1,
        message: `校验是否为空错误, ${err.message}`
      })
      return
    }

    try {
      const user_data = await userModel.findOne({
        where: {
          username
        },
      })
      // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
      if (!user_data) {
        res.send({
          success: false,
          code: 400,
          message: '用户不存在'
        })
        return
      }
      const pwdCheckStatus = await checkPwd(password, user_data.password)

      if (!pwdCheckStatus) {
        res.send({
          success: false,
          code: 403,
          message: '用户名或密码错误'
        })
      } else {
        // 登陆时间
        const time = moment().format('YYYY-MM-DD HH:mm:ss')
        await userModel.update({
          loginTime: time,
          token: generateToken()
        }, {
          where: {
            username
          },
        })
        const user_data_update = await userModel.findOne({
          where: {
            username
          },
        })
        res.send({
          success: true,
          data: {
            userId: user_data_update.id,
            name: user_data_update.name,
            email: user_data_update.email,
            token: user_data_update.token
          },
        })
      }
    } catch (err) {
      log.error(err.message, err)
      res.send({
        success: false,
        code: -2,
        message: `数据库查询错误, ${err.message}`
      })
      return
    }
  }

  // 退出
  async signout(req, res, next) {
    const token = getToken(req)
    try {
      const user_data = await userModel.findOne({
        where: {
          token
        },
      })
      if (!user_data) {
        res.send({
          success: false,
          status: 400,
          message: '用户不存在'
        })
        return
      }
      await userModel.update({
        token: null
      }, {
        where: {
          token
        },
      })
      res.send({
        success: true,
        status: 200,
        message: '退出成功'
      })
    } catch (err) {
      log.error(err.message, err)
      res.send({
        success: false,
        code: -1,
        message: '退出失败'
      })
      return
    }
  }
}

module.exports = new User()