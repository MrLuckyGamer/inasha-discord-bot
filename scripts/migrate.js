const fs = require('fs');
const path = require('path');
const db = require('../database/db');

// Paths to JSON files
const FISH_FILE = './data/fish/fish.json';
const COOLDOWN_FILE = './data/fish/fishCooldowns.json';
const FAMILY_FILE = './data/familytree/family.json';
const STATS_FILE = './data/serverstats/serverstats.json';
const WARNS_FILE = './data/warns/warns.json';

async function migrateData() {
  console.log('Starting data migration from JSON to PostgreSQL...\n');

  try {
    // Test database connection
    const connected = await db.testConnection();
    if (!connected) {
      throw new Error('Failed to connect to database');
    }

    // Migrate fish data
    if (fs.existsSync(FISH_FILE)) {
      console.log('Migrating fish data...');
      const fishData = JSON.parse(fs.readFileSync(FISH_FILE, 'utf8'));
      let fishCount = 0;

      for (const [guildId, users] of Object.entries(fishData)) {
        for (const [userId, points] of Object.entries(users)) {
          await db.query(
            `INSERT INTO fish_data (guild_id, user_id, total_points) 
             VALUES ($1, $2, $3)
             ON CONFLICT (guild_id, user_id) DO UPDATE SET total_points = $3`,
            [guildId, userId, points]
          );
          fishCount++;
        }
      }
      console.log(`Migrated ${fishCount} fish records\n`);
    }

    // Migrate fish cooldowns
    if (fs.existsSync(COOLDOWN_FILE)) {
      console.log('Migrating fish cooldowns...');
      const cooldownData = JSON.parse(fs.readFileSync(COOLDOWN_FILE, 'utf8'));
      let cooldownCount = 0;

      for (const [guildId, users] of Object.entries(cooldownData)) {
        for (const [userId, timestamp] of Object.entries(users)) {
          await db.query(
            `INSERT INTO fish_cooldowns (guild_id, user_id, last_fish_time) 
             VALUES ($1, $2, $3)
             ON CONFLICT (guild_id, user_id) DO UPDATE SET last_fish_time = $3`,
            [guildId, userId, timestamp]
          );
          cooldownCount++;
        }
      }
      console.log(`✅ Migrated ${cooldownCount} cooldown records\n`);
    }

    // Migrate family data
    if (fs.existsSync(FAMILY_FILE)) {
      console.log('Migrating family tree data...');
      const familyData = JSON.parse(fs.readFileSync(FAMILY_FILE, 'utf8'));
      let familyCount = 0;

      for (const [guildId, users] of Object.entries(familyData)) {
        for (const [userId, data] of Object.entries(users)) {
          if (data.parents && Array.isArray(data.parents)) {
            for (const parentId of data.parents) {
              await db.query(
                `INSERT INTO family_relations (guild_id, user_id, parent_id) 
                 VALUES ($1, $2, $3)
                 ON CONFLICT (guild_id, user_id, parent_id) DO NOTHING`,
                [guildId, userId, parentId]
              );
              familyCount++;
            }
          }
        }
      }
      console.log(`Migrated ${familyCount} family relations\n`);
    }

    // Migrate server stats
    if (fs.existsSync(STATS_FILE)) {
      console.log('Migrating server stats...');
      const statsData = JSON.parse(fs.readFileSync(STATS_FILE, 'utf8'));
      let statsCount = 0;

      for (const [guildId, data] of Object.entries(statsData)) {
        await db.query(
          `INSERT INTO server_stats (guild_id, category_id, users_channel_id, bots_channel_id, channels_channel_id)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (guild_id) DO UPDATE SET
             category_id = $2,
             users_channel_id = $3,
             bots_channel_id = $4,
             channels_channel_id = $5`,
          [guildId, data.category, data.users, data.bots, data.channels]
        );
        statsCount++;
      }
      console.log(`Migrated ${statsCount} server stats\n`);
    }

    // Migrate warnings
    if (fs.existsSync(WARNS_FILE)) {
      console.log('Migrating warnings...');
      const warnsData = JSON.parse(fs.readFileSync(WARNS_FILE, 'utf8'));
      let warnsCount = 0;

      for (const [guildId, users] of Object.entries(warnsData)) {
        for (const [userId, warnings] of Object.entries(users)) {
          if (Array.isArray(warnings)) {
            for (const warn of warnings) {
              await db.query(
                `INSERT INTO warnings (guild_id, user_id, moderator_id, moderator_tag, reason, warn_date)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [guildId, userId, warn.moderatorId, warn.moderatorTag, warn.reason, warn.date]
              );
              warnsCount++;
            }
          }
        }
      }
      console.log(`Migrated ${warnsCount} warnings\n`);
    }

    console.log('==============================================');
    console.log('Migration completed successfully!');
    console.log('==============================================');
    console.log('\nYou can now:');
    console.log('1. Backup your JSON files (optional)');
    console.log('2. Update your .env file with database credentials');
    console.log('3. Start your bot with: npm start');
    console.log('\nTo backup JSON files, run:');
    console.log('  mkdir -p backup && cp -r data backup/');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await db.end();
    process.exit(0);
  }
}

migrateData();