const backgroundAudioManager = wx.getBackgroundAudioManager()

Page({
  data: {
    musicList: [],
    currentMusic: null,
    currentMusicId: null,
    isPlaying: false,
    bpmRanges: ['全部', '60-80 (慢跑)', '80-100 (快走)', '100-120 (跑步)'],
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
      this.setData({ isPlaying: false })
      
      // 根据错误码提供更具体的错误信息
      let errorMsg = '音乐播放失败'
      if (error.errCode === 10001) {
        errorMsg = '音频文件格式不支持或路径错误'
      } else if (error.errCode === 10002) {
        errorMsg = '音频文件不存在'
      } else if (error.errCode === 10003) {
        errorMsg = '音频文件损坏'
      }
      
      wx.showToast({
        title: errorMsg,
        icon: 'none',
        duration: 2000
      })
    })
  },
  
  loadMusicList() {
    try {
      wx.showLoading({ title: '加载中...' })
      
      // 从本地assets/audio目录获取音乐列表
      const localMusicList = this.getLocalMusicList()
      this.setData({ musicList: localMusicList })
      
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

  getLocalMusicList() {
    // 本地音乐数据，根据assets/audio目录结构定义
    const musicData = {
      '60': [
        {
          id: '60_1',
          title: 'A Summer\'s Lullaby',
          artist: 'Dennis Kuo',
          bpm: 60,
          url: 'assets/audio/60/Dennis Kuo - A Summer\'s Lullaby.flac',
          cover_url: '../../assets/tabbar/music.png',
          format: 'flac'
        }
      ],
      '80': [
        {
          id: '80_1',
          title: 'Summer (菊次郎的夏天)',
          artist: '久石让',
          bpm: 80,
          url: 'assets/audio/80/久石让 - Summer (菊次郎的夏天) (Inst_).flac',
          cover_url: '../../assets/tabbar/music.png',
          format: 'flac'
        }
      ],
      '100': [
        {
          id: '100_1',
          title: '跑步BGM',
          artist: '电子混音',
          bpm: 100,
          url: 'assets/audio/100/电子混音 - 跑步BGM.flac',
          cover_url: '../../assets/tabbar/music.png',
          format: 'flac'
        },
        {
          id: '100_2',
          title: 'Late Night',
          artist: 'Odesza',
          bpm: 100,
          url: 'assets/audio/100/Odesza - Late Night.flac',
          cover_url: '../../assets/tabbar/music.png',
          format: 'flac'
        }
      ]
    }

    // 添加测试用的MP3音乐（用于测试播放功能）
    const testMusic = [
      {
        id: 'test_1',
        title: '测试音乐 (MP3)',
        artist: '测试艺术家',
        bpm: 80,
        url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // 使用在线测试音频
        cover_url: '../../assets/tabbar/music.png',
        format: 'wav'
      }
    ]

    // 合并所有BPM分类的音乐，并过滤掉不支持的格式
    let allMusic = []
    Object.values(musicData).forEach(musicList => {
      allMusic = allMusic.concat(musicList)
    })

    // 过滤掉不支持的音频格式
    const supportedFormats = ['mp3', 'wav', 'm4a']
    const supportedMusic = allMusic.filter(music => {
      const isSupported = supportedFormats.includes(music.format.toLowerCase())
      if (!isSupported) {
        console.warn(`不支持的音频格式: ${music.title} (${music.format})`)
      }
      return isSupported
    })

    // 如果没有支持的音频文件，添加测试音乐
    if (supportedMusic.length === 0) {
      console.log('没有支持的音频格式，添加测试音乐')
      allMusic = allMusic.concat(testMusic)
      return allMusic
    }

    return supportedMusic
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
      { min: 100, max: 120 }
    ]

    const range = bpmRanges[index - 1]
    
    // 从本地音乐列表中筛选
    const allMusic = this.getLocalMusicList()
    const filteredMusic = allMusic.filter(music => 
      music.bpm >= range.min && music.bpm <= range.max
    )
    
    this.setData({ musicList: filteredMusic })
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
    backgroundAudioManager.coverImgUrl = music.cover_url || 'assets/tabbar/music.png'
    
    // 尝试播放音乐
    try {
      backgroundAudioManager.src = music.url
      this.setData({ isPlaying: true })
    } catch (error) {
      console.error('设置音乐源失败:', error)
      wx.showToast({
        title: '音乐文件加载失败',
        icon: 'none'
      })
    }
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