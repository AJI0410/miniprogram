const db = require('../db')

module.exports = {
  // 获取音乐列表，支持分类、BPM、适用症状筛选
  async findAll({ category_id, min_bpm, max_bpm, suitable_for } = {}) {
    let sql = 'SELECT m.*, c.name as category_name FROM music m LEFT JOIN music_categories c ON m.category_id = c.id WHERE 1=1'
    const params = []
    if (category_id) {
      sql += ' AND m.category_id = ?'
      params.push(category_id)
    }
    if (min_bpm) {
      sql += ' AND m.bpm >= ?'
      params.push(min_bpm)
    }
    if (max_bpm) {
      sql += ' AND m.bpm <= ?'
      params.push(max_bpm)
    }
    if (suitable_for) {
      sql += ' AND (c.suitable_for LIKE ? OR m.title LIKE ? OR m.artist LIKE ?)' // 简单模糊匹配
      params.push(`%${suitable_for}%`, `%${suitable_for}%`, `%${suitable_for}%`)
    }
    sql += ' ORDER BY m.bpm ASC'
    return await db.query(sql, params)
  },

  // 获取所有分类
  async getCategories() {
    return await db.query('SELECT * FROM music_categories ORDER BY min_bpm ASC')
  },

  // 按ID查找音乐
  async findById(id) {
    const rows = await db.query('SELECT * FROM music WHERE id = ?', [id])
    return rows[0]
  }
} 