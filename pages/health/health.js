Page({
  data: {
    height: '',
    weight: '',
    bmi: 0,
    bmiCategory: '',
    healthAdvice: '',
    canProceed: false
  },

  onLoad() {
    // 检查是否有已保存的数据
    const savedHealth = wx.getStorageSync('userHealth')
    if (savedHealth) {
      this.setData({
        height: savedHealth.height || '',
        weight: savedHealth.weight || ''
      })
      this.calculateBMI()
      this.checkCanProceed()
    }
  },

  onHeightInput(e) {
    const height = e.detail.value
    this.setData({ height })
    this.calculateBMI()
    this.checkCanProceed()
  },

  onWeightInput(e) {
    const weight = e.detail.value
    this.setData({ weight })
    this.calculateBMI()
    this.checkCanProceed()
  },

  calculateBMI() {
    const { height, weight } = this.data
    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1)
      const bmiNum = parseFloat(bmi)
      
      let category = ''
      let advice = ''
      
      if (bmiNum < 18.5) {
        category = '偏瘦'
        advice = '建议适当增加营养摄入，进行力量训练来增加肌肉量。'
      } else if (bmiNum >= 18.5 && bmiNum < 24) {
        category = '正常'
        advice = '保持健康的生活方式，继续规律运动。'
      } else if (bmiNum >= 24 && bmiNum < 28) {
        category = '超重'
        advice = '建议控制饮食，增加有氧运动来减重。'
      } else {
        category = '肥胖'
        advice = '建议在医生指导下制定减重计划，注意饮食和运动。'
      }
      
      this.setData({
        bmi: bmi,
        bmiCategory: category,
        healthAdvice: advice
      })
    }
  },

  checkCanProceed() {
    const { height, weight } = this.data
    const canProceed = height > 0 && weight > 0
    this.setData({ canProceed })
  },

  nextStep() {
    if (!this.data.canProceed) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }

    // 保存健康信息
    const healthData = {
      height: this.data.height,
      weight: this.data.weight,
      bmi: this.data.bmi
    }
    wx.setStorageSync('userHealth', healthData)

    wx.showToast({
      title: '信息保存成功',
      icon: 'success',
      duration: 1500
    })

    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/goals/goals'
      })
    }, 1500)
  }
}) 