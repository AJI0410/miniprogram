const Router = require('koa-router')
const authController = require('../controllers/auth')

const router = new Router()

// 登录相关
router.post('/api/login', authController.login)

// 测试接口
router.get('/api/test', async (ctx) => {
  ctx.body = { message: '服务器运行正常！' }
})

module.exports = router 