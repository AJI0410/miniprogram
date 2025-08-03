Page({
  data: {
    selectedGoal: '',
    selectedSteps: '',
    selectedWorkouts: '',
    canComplete: false,
    goalOptions: [
      { value: 'lose_weight', label: '减重' },
      { value: 'gain_muscle', label: '增肌' },
      { value: 'maintain', label: '保持健康' },
      { value: 'improve_fitness', label: '提升体能' }
    ],
    stepOptions: [
      { value: 6000, label: '6000步' },
      { value: 8000, label: '8000步' },
      { value: 10000, label: '10000步' },
      { value: 12000, label: '12000步' }
    ],
    workoutOptions: [
      { value: 2, label: '2次/周' },
      { value: 3, label: '3次/周' },
      { value: 4, label: '4次/周' },
      { value: 5, label: '5次/周' }
    ],
    preferences: [
      { id: 1, label: '心率监测', description: '实时监测运动时的心率变化', selected: false },
      { id: 2, label: '睡眠监测', description: '记录和分析睡眠质量', selected: false },
      { id: 3, label: '卡路里计算', description: '自动计算运动消耗的卡路里', selected: false },
      { id: 4, label: '运动轨迹', description: '记录运动路线和轨迹', selected: false },
      { id: 5, label: '音乐推荐', description: '根据运动强度推荐合适的音乐', selected: false }
    ]
  },

  onLoad() {
    // 检查是否有已保存的目标设置
    const savedGoals = wx.getStorageSync('userGoals')
    if (savedGoals) {
      this.setData({
        selectedGoal: savedGoals.goal || '',
        selectedSteps: savedGoals.steps || '',
        selectedWorkouts: savedGoals.workouts || '',
        preferences: savedGoals.preferences || this.data.preferences
      })
      this.checkCanComplete()
    }
  },

  selectGoal(e) {
    const value = e.currentTarget.dataset.value
    this.setData({ selectedGoal: value })
    this.checkCanComplete()
  },

  selectSteps(e) {
    const value = e.currentTarget.dataset.value
    this.setData({ selectedSteps: value })
    this.checkCanComplete()
  },

  selectWorkouts(e) {
    const value = e.currentTarget.dataset.value
    this.setData({ selectedWorkouts: value })
    this.checkCanComplete()
  },

  togglePreference(e) {
    const id = e.currentTarget.dataset.id
    const preferences = this.data.preferences.map(item => {
      if (item.id === id) {
        return { ...item, selected: !item.selected }
      }
      return item
    })
    this.setData({ preferences })
    this.checkCanComplete()
  },

  checkCanComplete() {
    const { selectedGoal, selectedSteps, selectedWorkouts } = this.data
    const canComplete = selectedGoal && selectedSteps && selectedWorkouts
    this.setData({ canComplete })
  },

  completeSetup() {
    if (!this.data.canComplete) {
      wx.showToast({
        title: '请完成所有设置',
        icon: 'none'
      })
      return
    }

    // 保存目标设置
    const goalsData = {
      goal: this.data.selectedGoal,
      steps: this.data.selectedSteps,
      workouts: this.data.selectedWorkouts,
      preferences: this.data.preferences
    }
    wx.setStorageSync('userGoals', goalsData)

    // 标记用户已完成初始设置
    wx.setStorageSync('setupCompleted', true)

    wx.showToast({
      title: '设置完成！',
      icon: 'success',
      duration: 2000
    })

    setTimeout(() => {
      // 跳转到首页
      wx.reLaunch({
        url: '/pages/home/home'
      })
    }, 2000)
  }
}) 