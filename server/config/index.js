require('dotenv').config()

module.exports = {
  port: process.env.PORT || 3000,
  
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'sport_miniprogram'
  },
  
  wx: {
    appid: process.env.WX_APPID || 'your_wechat_appid',
    secret: process.env.WX_SECRET || 'your_wechat_secret'
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key'
  }
} 