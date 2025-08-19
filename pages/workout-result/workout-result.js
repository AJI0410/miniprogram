Page({
  data: {
    workoutData: {},
    mapCenter: { longitude: 116.390001, latitude: 39.900001 },
    polyline: [],
    markers: [],
    dateText: '',
    durationText: '00:00:00'
  },

  onLoad() {
    const workoutData = wx.getStorageSync('lastWorkoutData') || {}
    this.setData({ workoutData, mapHeight: 520, includePadding: {left: 40, right: 40, top: 40, bottom: 40} })

    // 距离格式化
    const dist = Number(workoutData.distance || 0)
    this.setData({ distanceText: dist.toFixed(2) })

    // 统计日期
    const end = workoutData.endTime ? new Date(workoutData.endTime) : new Date()
    const yyyy = end.getFullYear()
    const mm = String(end.getMonth() + 1).padStart(2, '0')
    const dd = String(end.getDate()).padStart(2, '0')
    const hh = String(end.getHours()).padStart(2, '0')
    const min = String(end.getMinutes()).padStart(2, '0')
    this.setData({ dateText: `${yyyy}年${mm}月${dd}日 ${hh}:${min}` })

    // 用时显示：优先使用结束瞬间的 timerText，以保证一致
    if (workoutData.timerText) {
      this.setData({ durationText: workoutData.timerText })
    } else {
      const durationMin = workoutData.duration || 0
      const h = Math.floor(durationMin / 60)
      const m = durationMin % 60
      this.setData({ durationText: `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00` })
    }

    // 轨迹绘制
    const points = (workoutData.trackPoints || []).filter(p => p && p.longitude && p.latitude)
    if (points.length) {
      this.renderTrack(points)
      // 根据轨迹长度自适应地图高度：短轨迹更小，长轨迹更高
      const H = Math.min(620, Math.max(400, Math.floor(points.length / 5) * 10 + 480))
      this.setData({ mapHeight: H })
    } else {
      this.setData({ mapHeight: 400 })
    }
  },

  renderTrack(points) {
    // 颜色根据序列插值（绿->黄->橙->红）
    const colors = ['#21c55d','#fbbf24','#fb923c','#ef4444']
    const segs = []
    for (let i = 1; i < points.length; i++) {
      const ratio = i / points.length
      const idx = Math.min(colors.length - 2, Math.floor(ratio * (colors.length - 1)))
      const color = colors[idx]
      segs.push({ points: [points[i-1], points[i]], color, width: 6 })
    }

    const start = points[0]
    const end = points[points.length - 1]

    const markers = [
      { id: 1, longitude: start.longitude, latitude: start.latitude, iconPath: '/assets/tabbar/start.png', width: 36, height: 36 },
      { id: 2, longitude: end.longitude, latitude: end.latitude, iconPath: '/assets/tabbar/end.png', width: 36, height: 36 }
    ]

    // includePoints 让地图自动适配完整轨迹
    const includePoints = points

    // 地图中心取中点
    const lngs = points.map(p => p.longitude)
    const lats = points.map(p => p.latitude)
    const center = { longitude: (Math.min(...lngs)+Math.max(...lngs))/2, latitude: (Math.min(...lats)+Math.max(...lats))/2 }

    this.setData({ mapCenter: center, polyline: segs, markers, includePoints })
  },

  shareWorkout() {
    wx.showToast({ title: '分享功能开发中', icon: 'none' })
  },

  goHome() {
    // 返回到运动页（tab 页需使用 switchTab）
    wx.switchTab({ url: '/pages/workout/workout' })
  }
}) 