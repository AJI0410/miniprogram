const musicModel = require('../models/music')

module.exports = {
  async list(ctx) {
    try {
      const { minBpm, maxBpm } = ctx.query
      
      let musicList
      if (minBpm && maxBpm) {
        musicList = await musicModel.findByBpmRange(parseInt(minBpm), parseInt(maxBpm))
      } else {
        musicList = await musicModel.findAll()
      }
      
      ctx.body = musicList
    } catch (error) {
      console.error('获取音乐列表失败:', error)
      ctx.status = 500
      ctx.body = { error: '获取音乐列表失败' }
    }
  },

  async getById(ctx) {
    try {
      const { id } = ctx.params
      const music = await musicModel.findById(id)
      
      if (!music) {
        ctx.status = 404
        ctx.body = { error: '音乐不存在' }
        return
      }
      
      ctx.body = music
    } catch (error) {
      console.error('获取音乐详情失败:', error)
      ctx.status = 500
      ctx.body = { error: '获取音乐详情失败' }
    }
  },

  async categories(ctx) {
    try {
      // 返回模拟的音乐分类数据
      const categories = [
        { id: 1, name: '康复早期', description: '适合康复初期的轻柔音乐', min_bpm: 60, max_bpm: 80 },
        { id: 2, name: '康复中期', description: '适合康复中期的中等强度音乐', min_bpm: 80, max_bpm: 100 },
        { id: 3, name: '康复后期', description: '适合康复后期的高强度音乐', min_bpm: 100, max_bpm: 120 }
      ]
      
      ctx.body = categories
    } catch (error) {
      console.error('获取音乐分类失败:', error)
      ctx.status = 500
      ctx.body = { error: '获取音乐分类失败' }
    }
  }
} 
  async categories(ctx) {
    try {
      // 返回模拟的音乐分类数据
      const categories = [
        { id: 1, name: '康复早期', description: '适合康复初期的轻柔音乐', min_bpm: 60, max_bpm: 80 },
        { id: 2, name: '康复中期', description: '适合康复中期的中等强度音乐', min_bpm: 80, max_bpm: 100 },
        { id: 3, name: '康复后期', description: '适合康复后期的高强度音乐', min_bpm: 100, max_bpm: 120 }
      ]
      
      ctx.body = categories
    } catch (error) {
      console.error('获取音乐分类失败:', error)
      ctx.status = 500
      ctx.body = { error: '获取音乐分类失败' }
    }
  }