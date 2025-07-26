const db = require('../db')

module.exports = {
  // 根据openid查找用户
  async findByOpenid(openid) {
    const users = await db.query('SELECT * FROM users WHERE openid = ?', [openid])
    return users[0]
  },
  
  // 创建用户
  async create(user) {
    const result = await db.query(
      'INSERT INTO users SET ?', 
      {
        openid: user.openid,
        nickname: user.nickName,
        avatar: user.avatarUrl,
        gender: user.gender,
        city: user.city,
        province: user.province,
        country: user.country
      }
    )
    return result.insertId
  },

  // 根据ID查找用户
  async findById(id) {
    const users = await db.query('SELECT * FROM users WHERE id = ?', [id])
    return users[0]
  }
} 