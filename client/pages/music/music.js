const backgroundAudioManager = wx.getBackgroundAudioManager()

Page({
  data: {
    musicList: [],
    currentMusic: null,
    currentMusicId: null,
    isPlaying: false,
    bpmRanges: ['全部', '60-80 (慢跑)', '80-100 (快走)', '100-120 (跑步)', '120-140 (高强度)'],
    bpmIndex: 0
  },
  
  onLoad() {
    this.loadMusicList()
    this.setupAudioManager()
  },

  onUnload() {
    // 页面卸载时停止音乐
    backgroundAudioManager.stop()
  },

  setupAudioManager() {
    // 监听音乐播放状态
    backgroundAudioManager.onPlay(() => {
      this.setData({ isPlaying: true })
    })
    
    backgroundAudioManager.onPause(() => {
      this.setData({ isPlaying: false })
    })
    
    backgroundAudioManager.onStop(() => {
      this.setData({ isPlaying: false })
    })
    
    backgroundAudioManager.onEnded(() => {
      this.setData({ isPlaying: false })
    })
    
    backgroundAudioManager.onError((error) => {
      console.error('音乐播放错误:', error)
      wx.showToast({
        title: '音乐播放失败',
        icon: 'none'
      })
    })
  },
  
  async loadMusicList() {
    try {
      wx.showLoading({ title: '加载中...' })
      
      const res = await wx.request({
        url: 'http://localhost:3000/api/music',
        method: 'GET'
      })
      
      if (res.data) {
        this.setData({ musicList: res.data })
      }
    } catch (error) {
      console.error('加载音乐列表失败:', error)
      wx.showToast({
        title: '加载音乐列表失败',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
    }
  },
  
  onBpmChange(e) {
    const index = e.detail.value
    this.setData({ bpmIndex: index })
    this.filterMusicByBpm(index)
  },

  filterMusicByBpm(index) {
    if (index === 0) {
      // 显示全部音乐
      this.loadMusicList()
      return
    }

    const bpmRanges = [
      { min: 60, max: 80 },
      { min: 80, max: 100 },
      { min: 100, max: 120 },
      { min: 120, max: 140 }
    ]

    const range = bpmRanges[index - 1]
    
    wx.request({
      url: `http://localhost:3000/api/music?minBpm=${range.min}&maxBpm=${range.max}`,
      method: 'GET',
      success: (res) => {
        if (res.data) {
          this.setData({ musicList: res.data })
        }
      },
      fail: (error) => {
        console.error('筛选音乐失败:', error)
        wx.showToast({
          title: '筛选失败',
          icon: 'none'
        })
      }
    })
  },
  
  playMusic(e) {
    const musicId = e.currentTarget.dataset.id
    const music = this.data.musicList.find(item => item.id === musicId)
    
    if (!music) return
    
    this.setData({
      currentMusic: music,
      currentMusicId: musicId
    })
    
    // 设置音乐信息
    backgroundAudioManager.title = music.title
    backgroundAudioManager.epname = '运动音乐'
    backgroundAudioManager.singer = music.artist || '运动健康'
    backgroundAudioManager.coverImgUrl = music.cover_url || '/assets/default-cover.png'
    backgroundAudioManager.src = music.url
    
    this.setData({ isPlaying: true })
  },
  
  togglePlay() {
    if (this.data.isPlaying) {
      backgroundAudioManager.pause()
    } else {
      backgroundAudioManager.play()
    }
  },

  stopMusic() {
    backgroundAudioManager.stop()
    this.setData({ 
      isPlaying: false,
      currentMusic: null,
      currentMusicId: null
    })
  }
}) 