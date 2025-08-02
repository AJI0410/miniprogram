const Router = require('koa-router')
const router = new Router()

const authController = require('../controllers/auth')
const musicController = require('../controllers/music')
const workoutController = require('../controllers/workout')
const deviceController = require('../controllers/device')
const exerciseController = require('../controllers/exercise')
const authMiddleware = require('../middleware/auth')

// 登录路由
router.post('/api/login', authController.login)

// 音乐路由
router.get('/api/music', musicController.list)
router.get('/api/music/categories', musicController.categories)
router.get('/api/music/:id', musicController.getById)

// 设备路由
router.get('/api/user/devices', authMiddleware, deviceController.list)
router.post('/api/user/devices', authMiddleware, deviceController.bind)
router.delete('/api/user/devices/:deviceId', authMiddleware, deviceController.unbind)

// 运动数据路由
router.post('/api/exercise/record', authMiddleware, exerciseController.record)
router.get('/api/exercise/today-stats', authMiddleware, exerciseController.todayStats)
router.get('/api/exercise/trajectory', authMiddleware, exerciseController.getTrajectory)

// 兼容旧workout接口
router.post('/api/workout/record', authMiddleware, workoutController.record)
router.get('/api/workout/history', authMiddleware, workoutController.history)
router.get('/api/stats/today', authMiddleware, workoutController.todayStats)

module.exports = router 