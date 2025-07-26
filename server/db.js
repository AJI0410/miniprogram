const mysql = require('mysql2/promise')
const config = require('./config')

const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

module.exports = {
  async query(sql, params) {
    const [rows] = await pool.query(sql, params)
    return rows
  },
  
  // 获取连接（用于事务）
  async getConnection() {
    return await pool.getConnection()
  }
} 