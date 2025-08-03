const db = require('../db')

class UserModel {
  async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?'
    const users = await db.query(sql, [id])
    return users[0]
  }

  async findByOpenid(openid) {
    const sql = 'SELECT * FROM users WHERE openid = ?'
    const users = await db.query(sql, [openid])
    return users[0]
  }

  async findByUsername(username) {
    const sql = 'SELECT * FROM users WHERE username = ?'
    const users = await db.query(sql, [username])
    return users[0]
  }

  async create(userData) {
    const sql = 'INSERT INTO users (username, password, nickname, avatar_url) VALUES (?, ?, ?, ?)'
    const result = await db.query(sql, [
      userData.username, 
      userData.password, 
      userData.nickname, 
      userData.avatar_url
    ])
    
    // 返回创建的用户
    return await this.findById(result.insertId)
  }

  async update(id, userData) {
    const sql = 'UPDATE users SET nickname = ?, avatar_url = ? WHERE id = ?'
    await db.query(sql, [userData.nickname, userData.avatar_url, id])
    
    // 返回更新后的用户
    return await this.findById(id)
  }
}

module.exports = new UserModel() 