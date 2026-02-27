const { Pool } = require('pg');

class Database {
  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'discord_bot',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client', err);
    });
  }

  // Generic query method
  async query(text, params) {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      if (duration > 1000) {
        console.log('Slow query executed:', { text, duration, rows: res.rowCount });
      }
      return res;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  // Fish data methods
  async getFishData(guildId, userId) {
    const result = await this.query(
      'SELECT total_points FROM fish_data WHERE guild_id = $1 AND user_id = $2',
      [guildId, userId]
    );
    return result.rows[0]?.total_points || 0;
  }

  async updateFishData(guildId, userId, points) {
    await this.query(
      `INSERT INTO fish_data (guild_id, user_id, total_points) 
       VALUES ($1, $2, $3)
       ON CONFLICT (guild_id, user_id) 
       DO UPDATE SET total_points = fish_data.total_points + $3`,
      [guildId, userId, points]
    );
  }

  async getFishLeaderboard(guildId, limit = 10) {
    const result = await this.query(
      `SELECT user_id, total_points 
       FROM fish_data 
       WHERE guild_id = $1 
       ORDER BY total_points DESC 
       LIMIT $2`,
      [guildId, limit]
    );
    return result.rows;
  }

  // Fish cooldown methods
  async getFishCooldown(guildId, userId) {
    const result = await this.query(
      'SELECT last_fish_time FROM fish_cooldowns WHERE guild_id = $1 AND user_id = $2',
      [guildId, userId]
    );
    return result.rows[0]?.last_fish_time || 0;
  }

  async setFishCooldown(guildId, userId, timestamp) {
    await this.query(
      `INSERT INTO fish_cooldowns (guild_id, user_id, last_fish_time) 
       VALUES ($1, $2, $3)
       ON CONFLICT (guild_id, user_id) 
       DO UPDATE SET last_fish_time = $3`,
      [guildId, userId, timestamp]
    );
  }

  // Family tree methods
  async getFamilyParents(guildId, userId) {
    const result = await this.query(
      'SELECT parent_id FROM family_relations WHERE guild_id = $1 AND user_id = $2',
      [guildId, userId]
    );
    return result.rows.map(row => row.parent_id);
  }

  async getFamilyChildren(guildId, userId) {
    const result = await this.query(
      'SELECT user_id FROM family_relations WHERE guild_id = $1 AND parent_id = $2',
      [guildId, userId]
    );
    return result.rows.map(row => row.user_id);
  }

  async addFamilyRelation(guildId, userId, parentId) {
    await this.query(
      `INSERT INTO family_relations (guild_id, user_id, parent_id) 
       VALUES ($1, $2, $3)
       ON CONFLICT (guild_id, user_id, parent_id) DO NOTHING`,
      [guildId, userId, parentId]
    );
  }

  async removeFamilyRelation(guildId, userId, parentId) {
    await this.query(
      'DELETE FROM family_relations WHERE guild_id = $1 AND user_id = $2 AND parent_id = $3',
      [guildId, userId, parentId]
    );
  }

  async getAllFamilyMembers(guildId) {
    const result = await this.query(
      'SELECT DISTINCT user_id, parent_id FROM family_relations WHERE guild_id = $1',
      [guildId]
    );
    return result.rows;
  }

  // Server stats methods
  async getServerStats(guildId) {
    const result = await this.query(
      'SELECT * FROM server_stats WHERE guild_id = $1',
      [guildId]
    );
    return result.rows[0];
  }

  async setServerStats(guildId, categoryId, usersChannelId, botsChannelId, channelsChannelId) {
    await this.query(
      `INSERT INTO server_stats (guild_id, category_id, users_channel_id, bots_channel_id, channels_channel_id)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (guild_id) 
       DO UPDATE SET 
         category_id = $2,
         users_channel_id = $3,
         bots_channel_id = $4,
         channels_channel_id = $5`,
      [guildId, categoryId, usersChannelId, botsChannelId, channelsChannelId]
    );
  }

  async deleteServerStats(guildId) {
    await this.query('DELETE FROM server_stats WHERE guild_id = $1', [guildId]);
  }

  async getAllServerStats() {
    const result = await this.query('SELECT * FROM server_stats');
    return result.rows;
  }

  // Warnings methods
  async addWarning(guildId, userId, moderatorId, moderatorTag, reason, warnDate) {
    const result = await this.query(
      `INSERT INTO warnings (guild_id, user_id, moderator_id, moderator_tag, reason, warn_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [guildId, userId, moderatorId, moderatorTag, reason, warnDate]
    );
    return result.rows[0].id;
  }

  async getUserWarnings(guildId, userId) {
    const result = await this.query(
      `SELECT id, moderator_id, moderator_tag, reason, warn_date 
       FROM warnings 
       WHERE guild_id = $1 AND user_id = $2 
       ORDER BY warn_date DESC`,
      [guildId, userId]
    );
    return result.rows;
  }

  async deleteWarning(guildId, userId, warningId) {
    const result = await this.query(
      'DELETE FROM warnings WHERE guild_id = $1 AND user_id = $2 AND id = $3 RETURNING *',
      [guildId, userId, warningId]
    );
    return result.rows[0];
  }

  // Connection management
  async testConnection() {
    try {
      const result = await this.query('SELECT NOW()');
      console.log('Database connection successful:', result.rows[0].now);
      return true;
    } catch (error) {
      console.error('Database connection failed:', error.message);
      return false;
    }
  }

  async end() {
    await this.pool.end();
  }
}

// Export singleton instance
module.exports = new Database();