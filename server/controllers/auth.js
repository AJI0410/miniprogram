const jwt = require('jsonwebtoken')
const config = require('../config')
const userModel = require('../models/user')

module.exports = {
  async login(ctx) {
    try {
      const { username, password } = ctx.request.body
      
      if (!username || !password) {
        ctx.status = 400
        ctx.body = { error: '请输入账号和密码' }
        return
      }

      // 查找用户
      let user = await userModel.findByUsername(username)
      
      if (!user) {
        ctx.status = 401
        ctx.body = { error: '账号不存在' }
        return
      }

      // 验证密码（这里使用简单的密码验证，实际项目中应该使用加密）
      if (user.password !== password) {
        ctx.status = 401
        ctx.body = { error: '密码错误' }
        return
      }

      // 生成JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        config.jwt.secret,
        { expiresIn: '7d' }
      )

      ctx.body = {
        success: true,
        token,
        userInfo: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          avatar_url: user.avatar_url
        }
      }
      
      console.log('✅ 登录成功:', { username: user.username, nickname: user.nickname })
    } catch (error) {
      console.error('❌ 登录失败:', error)
      ctx.status = 500
      ctx.body = { error: '登录失败' }
    }
  }
} 