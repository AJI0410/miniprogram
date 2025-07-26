const workoutModel = require('../models/workout')
const userModel = require('../models/user')

module.exports = {
  async record(ctx) {
    try {
      const userId = ctx.state.user.userId
      const workoutData = ctx.request.body
      
      // 验证用户是否存在
      const user = await userModel.findById(userId)
      if (!user) {
        ctx.status = 404
        ctx.body = { error: '用户不存在' }
        return
      }
      
      // 创建运动记录
      const recordId = await workoutModel.create({
        userId,
        ...workoutData
      })
      
      ctx.body = { id: recordId, message: '运动记录保存成功' }
    } catch (error) {
      console.error('保存运动记录失败:', error)
      ctx.status = 500
      ctx.body = { error: '保存运动记录失败' }
    }
  },

  async history(ctx) {
    try {
      const userId = ctx.state.user.userId
      const { limit = 10 } = ctx.query
      
      const history = await workoutModel.findByUserId(userId, parseInt(limit))
      
      // 格式化日期
      const formattedHistory = history.map(record => ({
        id: record.id,
        date: new Date(record.created_at).toLocaleDateString('zh-CN'),
        duration: record.duration,
        distance: record.distance,
        calories: record.calories,
        pace: record.pace
      }))
      
      ctx.body = formattedHistory
    } catch (error) {
      console.error('获取运动历史失败:', error)
      ctx.status = 500
      ctx.body = { error: '获取运动历史失败' }
    }
  },

  async todayStats(ctx) {
    try {
      const userId = ctx.state.user.userId
      const stats = await workoutModel.getTodayStats(userId)
      
      ctx.body = {
        duration: stats.total_duration || 0,
        calories: stats.total_calories || 0,
        distance: stats.total_distance || 0
      }
    } catch (error) {
      console.error('获取今日统计失败:', error)
      ctx.status = 500
      ctx.body = { error: '获取今日统计失败' }
    }
  }
} 