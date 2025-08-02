const deviceModel = require('../models/device')

module.exports = {
  // 获取用户设备列表
  async list(ctx) {
    const userId = ctx.state.user.userId
    const devices = await deviceModel.findByUserId(userId)
    ctx.body = devices
  },

  // 绑定设备
  async bind(ctx) {
    const userId = ctx.state.user.userId
    const { device_id, alias } = ctx.request.body
    // 检查设备是否存在
    const device = await deviceModel.findById(device_id)
    if (!device) ctx.throw(404, '设备不存在')
    // 检查是否已绑定
    const isBound = await deviceModel.isUserBound(userId, device_id)
    if (isBound) ctx.throw(400, '设备已绑定')
    // 绑定
    await deviceModel.bindUser(userId, device_id, alias)
    ctx.body = { message: '绑定成功' }
  },

  // 解绑设备
  async unbind(ctx) {
    const userId = ctx.state.user.userId
    const deviceId = ctx.params.deviceId
    await deviceModel.unbindUser(userId, deviceId)
    ctx.body = { message: '解绑成功' }
  }
} 