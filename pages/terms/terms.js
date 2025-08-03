Page({
  data: {
    hasRead: false
  },

  onLoad() {
    // 检查用户是否已经同意过条款
    const termsAccepted = wx.getStorageSync('termsAccepted')
    if (termsAccepted) {
      this.goToNextPage()
    }
  },

  agreeTerms() {
    // 记录用户同意条款
    wx.setStorageSync('termsAccepted', true)
    
    wx.showToast({
      title: '感谢您的同意！',
      icon: 'success',
      duration: 1500
    })

    // 延迟跳转，让用户看到提示
    setTimeout(() => {
      this.goToNextPage()
    }, 1500)
  },

  goToNextPage() {
    // 检查用户是否已登录
    const token = wx.getStorageSync('token')
    if (token) {
      // 已登录，跳转到个人信息填写页面
      wx.navigateTo({
        url: '/pages/profile/profile'
      })
    } else {
      // 未登录，跳转到登录页面
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  }
}) 