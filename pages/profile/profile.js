Page({
  data: {
    userInfo: {},
    nickname: '',
    birthDate: '',
    canProceed: false
  },

  onLoad() {
    // 获取用户信息
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({ userInfo })
    }
    
    // 检查是否有已保存的数据
    const savedProfile = wx.getStorageSync('userProfile')
    if (savedProfile) {
      this.setData({
        nickname: savedProfile.nickname || '',
        birthDate: savedProfile.birthDate || ''
      })
      this.checkCanProceed()
    }
  },

  onNicknameInput(e) {
    const nickname = e.detail.value.trim()
    this.setData({ nickname })
    this.checkCanProceed()
  },

  onBirthDateChange(e) {
    const birthDate = e.detail.value
    this.setData({ birthDate })
    this.checkCanProceed()
  },

  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        // 这里可以上传头像到服务器
        wx.showToast({
          title: '头像上传成功',
          icon: 'success'
        })
      },
      fail: () => {
        wx.showToast({
          title: '头像上传失败',
          icon: 'none'
        })
      }
    })
  },

  checkCanProceed() {
    const { nickname, birthDate } = this.data
    const canProceed = nickname.length > 0 && birthDate.length > 0
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

    // 保存用户信息
    const profileData = {
      nickname: this.data.nickname,
      birthDate: this.data.birthDate
    }
    wx.setStorageSync('userProfile', profileData)

    // 计算年龄
    const age = this.calculateAge(this.data.birthDate)
    
    wx.showToast({
      title: '信息保存成功',
      icon: 'success',
      duration: 1500
    })

    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/health/health'
      })
    }, 1500)
  },

  calculateAge(birthDate) {
    if (!birthDate) return 0
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  }
}) 