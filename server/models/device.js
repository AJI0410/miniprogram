const db = require('../db')

module.exports = {
  // 查找设备
  async findById(device_id) {
    const rows = await db.query('SELECT * FROM devices WHERE device_id = ?', [device_id])
    return rows[0]
  },

  // 查找用户已绑定设备
  async findByUserId(user_id) {
    return await db.query(
      `SELECT d.*, ud.alias, ud.is_active, ud.binding_time
       FROM user_devices ud
       JOIN devices d ON ud.device_id = d.device_id
       WHERE ud.user_id = ?`,
      [user_id]
    )
  },

  // 检查用户是否已绑定设备
  async isUserBound(user_id, device_id) {
    const rows = await db.query('SELECT * FROM user_devices WHERE user_id = ? AND device_id = ?', [user_id, device_id])
    return rows.length > 0
  },

  // 绑定设备
  async bindUser(user_id, device_id, alias = null) {
    return await db.query(
      'INSERT INTO user_devices (user_id, device_id, alias, is_active) VALUES (?, ?, ?, 1)',
      [user_id, device_id, alias]
    )
  },

  // 解绑设备
  async unbindUser(user_id, device_id) {
    return await db.query('DELETE FROM user_devices WHERE user_id = ? AND device_id = ?', [user_id, device_id])
  }
} 