# 音频文件管理说明

## 目录结构
```
assets/audio/
├── 60/          # 60-80 BPM (慢跑)
├── 80/          # 80-100 BPM (快走)  
├── 100/         # 100-120 BPM (跑步)
└── 120/         # 120+ BPM (高强度)
```

## 微信小程序音频格式支持

### 支持的格式
- **MP3** (推荐，兼容性最好)
- **WAV**
- **M4A**

### 不支持的格式
- **FLAC** (当前目录中的文件格式)
- **OGG**
- **APE**

## 当前问题解决方案

由于当前目录中的音频文件是FLAC格式，微信小程序无法播放，需要：

### 方案1：转换音频格式 (推荐)
将FLAC文件转换为MP3格式：
1. 使用音频转换工具（如FFmpeg、Audacity等）
2. 保持相同的文件名结构
3. 更新music.js中的文件扩展名

### 方案2：使用在线音频服务
将音频文件上传到云存储，使用HTTPS链接

### 方案3：添加格式检测
在代码中添加格式检测，只显示支持的音频文件

## 添加新音乐文件

### 1. 确定BPM范围
- **60-80 BPM**: 慢跑、散步等低强度运动
- **80-100 BPM**: 快走、轻度有氧等中等强度运动
- **100-120 BPM**: 跑步、有氧运动等高强度运动

### 2. 文件命名规范
建议使用格式：`艺术家 - 歌曲名.mp3`
例如：`Dennis Kuo - A Summer's Lullaby.mp3`

### 3. 支持的音频格式
- MP3 (推荐，音质好且兼容)
- WAV
- M4A

### 4. 更新代码
在 `pages/music/music.js` 文件的 `getLocalMusicList()` 函数中添加新音乐信息：

```javascript
const musicData = {
  '60': [
    {
      id: '60_1',
      title: 'A Summer\'s Lullaby',
      artist: 'Dennis Kuo',
      bpm: 60,
      url: 'assets/audio/60/Dennis Kuo - A Summer\'s Lullaby.mp3',
      cover_url: 'assets/tabbar/music.png'
    }
  ],
  // ... 其他BPM分类
}
```

### 5. 注意事项
- 确保音频文件路径正确
- BPM值要准确，用于运动强度匹配
- 建议添加专辑封面图片到 `assets/` 目录
- 音乐文件大小建议控制在合理范围内
- **重要**：微信小程序只支持MP3、WAV、M4A格式 