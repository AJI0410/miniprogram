Page({
  data: {
    username: '',
    password: '',
    loading: false,
    serverUrl: 'http://192.168.77.87:3000'
  },

  onLoad() {
    // 检查是否已经登录
    const token = wx.getStorageSync('token')
    const userInfo = wx.getStorageSync('userInfo')
    
    if (token && userInfo) {
      // 已登录，跳转到首页
      wx.reLaunch({
        url: '/pages/home/home'
      })
    }
  },

  onUsernameInput(e) {
    this.setData({
      username: e.detail.value
    })
  },

  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    })
  },

  onLogin() {
    const { username, password } = this.data
    
    if (!username.trim()) {
      wx.showToast({
        title: '请输入账号',
        icon: 'none',
        duration: 2000
      })
      return
    }
    
    if (!password.trim()) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 2000
      })
      return
    }

    this.setData({ loading: true })

    // 调用登录接口
    wx.request({
      url: `${this.data.serverUrl}/api/login`,
      method: 'POST',
      data: {
        username: username.trim(),
        password: password
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.success) {
          // 登录成功
          const { token, userInfo } = res.data
          
          // 保存登录信息
          wx.setStorageSync('token', token)
          wx.setStorageSync('userInfo', userInfo)
          
          // 更新全局数据
          getApp().globalData.token = token
          getApp().globalData.userInfo = userInfo
          
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1500
          })
          
          // 检查是否完成初始设置
          const setupCompleted = wx.getStorageSync('setupCompleted')
          if (setupCompleted) {
            // 已完成设置，跳转到首页
            wx.reLaunch({
              url: '/pages/home/home'
            })
          } else {
            // 未完成设置，跳转到服务条款页面
            wx.navigateTo({
              url: '/pages/terms/terms'
            })
          }
        } else {
          // 登录失败
          wx.showToast({
            title: res.data.error || '登录失败',
            icon: 'none',
            duration: 3000
          })
        }
      },
      fail: (error) => {
        console.error('登录请求失败:', error)
        let errorMessage = '网络错误，请重试'
        
        if (error.errMsg.includes('timeout')) {
          errorMessage = '请求超时，请检查网络连接'
        } else if (error.errMsg.includes('fail')) {
          errorMessage = '服务器连接失败，请稍后重试'
        } else if (error.statusCode) {
          switch (error.statusCode) {
            case 401:
              errorMessage = '账号或密码错误'
              break
            case 404:
              errorMessage = '服务器地址错误'
              break
            case 500:
              errorMessage = '服务器内部错误'
              break
            default:
              errorMessage = `请求失败 (${error.statusCode})`
          }
        }
        
        wx.showToast({
          title: errorMessage,
          icon: 'none',
          duration: 3000
        })
      },
      complete: () => {
        this.setData({ loading: false })
      }
    })
  },

  onRegister() {
    wx.showToast({
      title: '注册功能开发中',
      icon: 'none',
      duration: 2000
    })
  }
}) 