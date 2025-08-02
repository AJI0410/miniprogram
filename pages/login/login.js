Page({
  data: {
    loading: false
  },

  onGetUserInfo(e) {
    if (e.detail.userInfo) {
      // 用户点击了允许授权
      this.setData({ loading: true })
      
      wx.login({
        success: res => {
          // 获取code
          const code = res.code
          // 发送code到后端换取openid和session_key
          wx.request({
            url: 'http://localhost:3000/api/login',
            method: 'POST',
            data: {
              code: code,
              userInfo: e.detail.userInfo
            },
            success: (res) => {
              if (res.data.token) {
                // 登录成功，保存token到本地
                wx.setStorageSync('token', res.data.token)
                wx.setStorageSync('userInfo', res.data.userInfo)
                
                // 更新全局数据
                getApp().globalData.token = res.data.token
                getApp().globalData.userInfo = res.data.userInfo
                
                // 跳转到首页
                wx.switchTab({
                  url: '/pages/home/home'
                })
              } else {
                wx.showToast({
                  title: '登录失败',
                  icon: 'none'
                })
              }
            },
            fail: (error) => {
              console.error('登录请求失败:', error)
              wx.showToast({
                title: '网络错误，请重试',
                icon: 'none'
              })
            },
            complete: () => {
              this.setData({ loading: false })
            }
          })
        },
        fail: (error) => {
          console.error('wx.login失败:', error)
          this.setData({ loading: false })
          wx.showToast({
            title: '登录失败，请重试',
            icon: 'none'
          })
        }
      })
    } else {
      // 用户点击了拒绝授权
      wx.showToast({
        title: '需要授权才能使用小程序',
        icon: 'none'
      })
    }
  }
}) 