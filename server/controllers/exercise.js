const exerciseModel = require('../models/exercise')

module.exports = {
  // 记录运动数据
  async record(ctx) {
    try {
      const userId = ctx.state.user.userId
      const { device_id, session_id, start_time, end_time, duration, calories, heart_rate_avg, heart_rate_max, steps, distance, exercise_type, music_bpm, data_points } = ctx.request.body
      
      // 保存主数据
      const exerciseId = await exerciseModel.create({
        user_id: userId,
        session_id,
        device_id,
        start_time,
        end_time,
        duration,
        calories,
        heart_rate_avg,
        heart_rate_max,
        steps,
        distance,
        exercise_type,
        music_bpm
      })
      
      // 保存轨迹点
      if (data_points && data_points.length > 0) {
        await exerciseModel.saveTrajectoryPoints(session_id, device_id, data_points)
      }
      
      ctx.body = { exercise_id: exerciseId }
    } catch (error) {
      console.error('记录运动数据失败:', error)
      ctx.status = 500
      ctx.body = { error: '记录运动数据失败' }
    }
  },

  // 获取今日统计
  async todayStats(ctx) {
    try {
      const userId = ctx.state.user.userId
      const stats = await exerciseModel.getTodayStats(userId)
      ctx.body = stats || { steps: 0, distance: 0, calories: 0 }
    } catch (error) {
      console.error('获取今日统计失败:', error)
      ctx.status = 500
      ctx.body = { error: '获取今日统计失败' }
    }
  },

  // 获取运动轨迹
  async getTrajectory(ctx) {
    try {
      const userId = ctx.state.user.userId
      const { session_id } = ctx.query
      const trajectory = await exerciseModel.getTrajectory(userId, session_id)
      ctx.body = trajectory
    } catch (error) {
      console.error('获取运动轨迹失败:', error)
      ctx.status = 500
      ctx.body = { error: '获取运动轨迹失败' }
    }
  }
} 

module.exports = {
  // 记录运动数据
  async record(ctx) {
    try {
      const userId = ctx.state.user.userId
      const { device_id, session_id, start_time, end_time, duration, calories, heart_rate_avg, heart_rate_max, steps, distance, exercise_type, music_bpm, data_points } = ctx.request.body
      
      // 保存主数据
      const exerciseId = await exerciseModel.create({
        user_id: userId,
        session_id,
        device_id,
        start_time,
        end_time,
        duration,
        calories,
        heart_rate_avg,
        heart_rate_max,
        steps,
        distance,
        exercise_type,
        music_bpm
      })
      
      // 保存轨迹点
      if (data_points && data_points.length > 0) {
        await exerciseModel.saveTrajectoryPoints(session_id, device_id, data_points)
      }
      
      ctx.body = { exercise_id: exerciseId }
    } catch (error) {
      console.error('记录运动数据失败:', error)
      ctx.status = 500
      ctx.body = { error: '记录运动数据失败' }
    }
  },

  // 获取今日统计
  async todayStats(ctx) {
    try {
      const userId = ctx.state.user.userId
      const stats = await exerciseModel.getTodayStats(userId)
      ctx.body = stats || { steps: 0, distance: 0, calories: 0 }
    } catch (error) {
      console.error('获取今日统计失败:', error)
      ctx.status = 500
      ctx.body = { error: '获取今日统计失败' }
    }
  },

  // 获取运动轨迹
  async getTrajectory(ctx) {
    try {
      const userId = ctx.state.user.userId
      const { session_id } = ctx.query
      const trajectory = await exerciseModel.getTrajectory(userId, session_id)
      ctx.body = trajectory
    } catch (error) {
      console.error('获取运动轨迹失败:', error)
      ctx.status = 500
      ctx.body = { error: '获取运动轨迹失败' }
    }
  }
} 
 
 