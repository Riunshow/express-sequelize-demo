'use strict'

const user = require('./user')
const group = require('./group')

module.exports = app => {
  app.use('/api/users', user)
  app.use('/api/group', group)
}
