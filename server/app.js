const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')
const router = require('./routes')
const config = require('./config')

const app = new Koa()

// 中间件
app.use(cors())
app.use(bodyParser())

// 错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    console.error('服务器错误:', error)
    ctx.status = 500
    ctx.body = { error: '服务器内部错误' }
  }
})

// 路由
app.use(router.routes())
app.use(router.allowedMethods())

// 启动服务器
const PORT = config.port
app.listen(PORT, () => {
  console.log(`运动小程序后端服务运行在端口 ${PORT}`)
  console.log(`数据库配置: ${config.db.host}:${config.db.database}`)
}) 