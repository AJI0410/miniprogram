const db = require('../db')

module.exports = {
  // 创建运动记录
  async create(workoutData) {
    const result = await db.query(
      'INSERT INTO workouts SET ?',
      {
        user_id: workoutData.userId,
        duration: workoutData.duration,
        distance: workoutData.distance,
        calories: workoutData.calories,
        pace: workoutData.pace,
        start_time: workoutData.startTime,
        end_time: workoutData.endTime
      }
    )
    return result.insertId
  },

  // 获取用户运动历史
  async findByUserId(userId, limit = 10) {
    return await db.query(
      'SELECT * FROM workouts WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
      [userId, limit]
    )
  },

  // 获取用户今日运动统计
  async getTodayStats(userId) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const stats = await db.query(
      `SELECT 
        SUM(duration) as total_duration,
        SUM(calories) as total_calories,
        SUM(distance) as total_distance
       FROM workouts 
       WHERE user_id = ? AND DATE(created_at) = DATE(?)`,
      [userId, today]
    )
    
    return stats[0] || { total_duration: 0, total_calories: 0, total_distance: 0 }
  }
} 