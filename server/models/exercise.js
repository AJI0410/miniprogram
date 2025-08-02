const db = require('../db')

module.exports = {
  // 新增运动数据
  async create(data) {
    const result = await db.query(
      'INSERT INTO exercise_data SET ?',
      data
    )
    return result.insertId
  },

  // 保存轨迹点（批量插入）
  async saveTrajectoryPoints(session_id, device_id, points) {
    if (!points || points.length === 0) return
    const values = points.map(p => [session_id, p.timestamp, p.latitude, p.longitude, p.altitude, p.speed, p.accuracy, device_id])
    await db.query(
      'INSERT INTO exercise_trajectory (session_id, timestamp, latitude, longitude, altitude, speed, accuracy, device_id) VALUES ?',
      [values]
    )
  },

  // 获取用户今日统计
  async getTodayStats(user_id) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const rows = await db.query(
      `SELECT SUM(steps) as steps, SUM(distance) as distance, SUM(calories) as calories
       FROM exercise_data WHERE user_id = ? AND DATE(start_time) = DATE(?)`,
      [user_id, today]
    )
    return rows[0] || { steps: 0, distance: 0, calories: 0 }
  },

  // 获取轨迹点
  async getTrajectory(user_id, session_id) {
    return await db.query(
      'SELECT * FROM exercise_trajectory WHERE session_id = ? ORDER BY timestamp ASC',
      [session_id]
    )
  }
} 