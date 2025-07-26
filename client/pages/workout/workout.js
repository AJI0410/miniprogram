Page({
  data: {
    isWorkingOut: false,
    timerText: '00:00:00',
    currentStats: {
      distance: 0,
      calories: 0,
      pace: '0:00'
    },
    workoutHistory: [],
    startTime: null,
    timerInterval: null
  },

  onLoad() {
    this.loadWorkoutHistory()
  },

  onShow() {
    // 每次显示页面时刷新历史记录
    this.loadWorkoutHistory()
  },

  async loadWorkoutHistory() {
    try {
      const token = wx.getStorageSync('token')
      if (!token) return

      const res = await wx.request({
        url: 'http://localhost:3000/api/workout/history',
        method: 'GET',
        header: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (res.data) {
        this.setData({ workoutHistory: res.data })
      }
    } catch (error) {
      console.error('加载运动历史失败:', error)
    }
  },

  startWorkout() {
    this.setData({
      isWorkingOut: true,
      startTime: new Date(),
      currentStats: {
        distance: 0,
        calories: 0,
        pace: '0:00'
      }
    })

    // 开始计时器
    this.startTimer()

    // 开始获取位置信息
    this.startLocationTracking()

    wx.showToast({
      title: '运动开始！',
      icon: 'success'
    })
  },

  stopWorkout() {
    this.setData({ isWorkingOut: false })
    
    // 停止计时器
    this.stopTimer()
    
    // 停止位置跟踪
    this.stopLocationTracking()

    // 保存运动记录
    this.saveWorkoutRecord()

    wx.showToast({
      title: '运动结束！',
      icon: 'success'
    })
  },

  startTimer() {
    this.data.timerInterval = setInterval(() => {
      const now = new Date()
      const startTime = this.data.startTime
      const diff = now - startTime

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      const timerText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      
      this.setData({ timerText })

      // 更新统计数据
      this.updateStats(diff)
    }, 1000)
  },

  stopTimer() {
    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval)
      this.data.timerInterval = null
    }
  },

  updateStats(elapsedTime) {
    // 模拟运动数据计算
    const minutes = elapsedTime / (1000 * 60)
    const distance = (minutes * 0.1).toFixed(2) // 假设每分钟0.1km
    const calories = Math.floor(minutes * 8) // 假设每分钟8卡路里
    const pace = this.calculatePace(minutes, distance)

    this.setData({
      currentStats: {
        distance: parseFloat(distance),
        calories: calories,
        pace: pace
      }
    })
  },

  calculatePace(minutes, distance) {
    if (distance <= 0) return '0:00'
    const paceMinutes = minutes / distance
    const paceMin = Math.floor(paceMinutes)
    const paceSec = Math.floor((paceMinutes - paceMin) * 60)
    return `${paceMin}:${paceSec.toString().padStart(2, '0')}`
  },

  startLocationTracking() {
    // 获取位置权限
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        console.log('位置获取成功:', res)
        // 这里可以实现更复杂的运动轨迹跟踪
      },
      fail: (error) => {
        console.error('位置获取失败:', error)
        wx.showToast({
          title: '无法获取位置信息',
          icon: 'none'
        })
      }
    })
  },

  stopLocationTracking() {
    // 停止位置跟踪的逻辑
  },

  async saveWorkoutRecord() {
    try {
      const token = wx.getStorageSync('token')
      if (!token) return

      const workoutData = {
        duration: Math.floor((new Date() - this.data.startTime) / (1000 * 60)),
        distance: this.data.currentStats.distance,
        calories: this.data.currentStats.calories,
        pace: this.data.currentStats.pace,
        startTime: this.data.startTime.toISOString(),
        endTime: new Date().toISOString()
      }

      const res = await wx.request({
        url: 'http://localhost:3000/api/workout/record',
        method: 'POST',
        header: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: workoutData
      })

      if (res.data) {
        // 刷新历史记录
        this.loadWorkoutHistory()
      }
    } catch (error) {
      console.error('保存运动记录失败:', error)
      wx.showToast({
        title: '保存记录失败',
        icon: 'none'
      })
    }
  }
}) 