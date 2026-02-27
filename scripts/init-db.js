const fs = require('fs');
const { Client } = require('pg');
const path = require('path');

// Read database credentials from environment or use defaults
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'discord_bot',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
};

async function initializeDatabase() {
  const client = new Client(config);

  try {
    console.log('Connecting to PostgreSQL...');
    await client.connect();
    console.log('Connected to database:', config.database);

    // Read and execute schema file
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('\nCreating database tables...');
    await client.query(schema);

    console.log('Database schema created successfully!');
    console.log('\n==============================================');
    console.log('Database initialisation complete!');
    console.log('==============================================');
    console.log('\nTables created:');
    console.log('  • fish_data');
    console.log('  • fish_cooldowns');
    console.log('  • family_relations');
    console.log('  • server_stats');
    console.log('  • warnings');
    console.log('\nYou can now:');
    console.log('  1. Run migration (if you have existing JSON data): npm run migrate');
    console.log('  2. Start your bot: npm start');

  } catch (error) {
    console.error('Database initialisation failed:', error.message);
    console.error('\nPlease check:');
    console.error('  • PostgreSQL is running');
    console.error('  • Database exists');
    console.error('  • Credentials in .env are correct');
    console.error('  • User has permission to create tables');
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run if executed directly
if (require.main === module) {
  // Try to load .env file if it exists
  try {
    require('dotenv').config();
  } catch (e) {
    console.log('Note: dotenv not installed, using environment variables only');
  }

  initializeDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = initializeDatabase;