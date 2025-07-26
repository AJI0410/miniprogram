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
  }
} 