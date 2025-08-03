Page({
  data: {
    userInfo: {},
    todayStats: {
      duration: 0,
      calories: 0
    }
  },

  onLoad() {
    this.loadUserInfo()
    this.loadTodayStats()
    this.loadUserProfile()
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.loadTodayStats()
  },

  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({ userInfo })
    }
  },

  loadUserProfile() {
    const profile = wx.getStorageSync('userProfile')
    const health = wx.getStorageSync('userHealth')
    const goals = wx.getStorageSync('userGoals')
    
    if (profile || health || goals) {
      this.setData({
        userProfile: profile,
        userHealth: health,
        userGoals: goals
      })
    }
  },

  async loadTodayStats() {
    try {
      const token = wx.getStorageSync('token')
      if (!token) return

      const res = await wx.request({
        url: 'http://localhost:3000/api/stats/today',
        method: 'GET',
        header: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (res.data) {
        this.setData({ todayStats: res.data })
      }
    } catch (error) {
      console.error('加载统计数据失败:', error)
    }
  },

  goToMusic() {
    wx.switchTab({
      url: '/pages/music/music'
    })
  },

  goToWorkout() {
    wx.switchTab({
      url: '/pages/workout/workout'
    })
  }
}) 