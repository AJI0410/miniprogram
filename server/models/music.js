const db = require('../db')

module.exports = {
  async findAll() {
    return await db.query('SELECT * FROM music ORDER BY bpm ASC')
  },
  
  async findByBpmRange(minBpm, maxBpm) {
    return await db.query(
      'SELECT * FROM music WHERE bpm BETWEEN ? AND ? ORDER BY bpm ASC',
      [minBpm, maxBpm]
    )
  },

  async findById(id) {
    const music = await db.query('SELECT * FROM music WHERE id = ?', [id])
    return music[0]
  }
} 