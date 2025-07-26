const Router = require('koa-router')
const router = new Router()

const authController = require('../controllers/auth')
const musicController = require('../controllers/music')
const workoutController = require('../controllers/workout')
const authMiddleware = require('../middleware/auth')

// 登录路由
router.post('/api/login', authController.login)

// 音乐路由
router.get('/api/music', musicController.list)
router.get('/api/music/:id', musicController.getById)

// 运动路由（需要认证）
router.post('/api/workout/record', authMiddleware, workoutController.record)
router.get('/api/workout/history', authMiddleware, workoutController.history)
router.get('/api/stats/today', authMiddleware, workoutController.todayStats)

module.exports = router 