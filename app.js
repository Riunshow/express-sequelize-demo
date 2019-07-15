const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const chalk = require('chalk')

const config = require('config-lite')(__dirname)

const models = require('./models')

const router = require('./routes/index')

const app = express()

app.all('*', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  res.header(
    'Access-Control-Allow-Origin',
    req.headers.origin || req.headers.referer || '*'
  )
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  )
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Credentials', true) //可以带cookies
  res.header('X-Powered-By', 'Express')
  if (req.method == 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

app.use(express.static('./public'))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

router(app)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
})

app.listen(config.port, config.hostname, () => {
  console.log(chalk.green(`成功监听：${config.hostname}:${config.port}`))
})

models.sequelize.sync().then(() => {
  console.log(chalk.green('mysql连接成功'))
})
.catch(err => {
  console.log(chalk.red('mysql连接失败:', err))
})