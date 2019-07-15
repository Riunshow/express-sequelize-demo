module.exports = {
  development: {
    host: 'localhost',
    database: 'iteration',
    dialect: 'mysql',
    username: 'root',
    password: '12345678',
    port: '3306'
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'mysql'
  },
  staging: {
    url: process.env.DATABASE_URL,
    dialect: 'mysql'
  },
  test: {
    url: process.env.DATABASE_URL || '',
    dialect: 'mysql'
  }
}