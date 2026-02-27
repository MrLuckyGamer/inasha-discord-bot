-- PostgreSQL Schema for Discord Bot

-- Fish data table
CREATE TABLE IF NOT EXISTS fish_data (
    guild_id VARCHAR(20) NOT NULL,
    user_id VARCHAR(20) NOT NULL,
    total_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (guild_id, user_id)
);

-- Fish cooldowns table
CREATE TABLE IF NOT EXISTS fish_cooldowns (
    guild_id VARCHAR(20) NOT NULL,
    user_id VARCHAR(20) NOT NULL,
    last_fish_time BIGINT NOT NULL,
    PRIMARY KEY (guild_id, user_id)
);

-- Family tree table
CREATE TABLE IF NOT EXISTS family_relations (
    guild_id VARCHAR(20) NOT NULL,
    user_id VARCHAR(20) NOT NULL,
    parent_id VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (guild_id, user_id, parent_id)
);

-- Server stats table
CREATE TABLE IF NOT EXISTS server_stats (
    guild_id VARCHAR(20) PRIMARY KEY,
    category_id VARCHAR(20) NOT NULL,
    users_channel_id VARCHAR(20) NOT NULL,
    bots_channel_id VARCHAR(20) NOT NULL,
    channels_channel_id VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Warnings table
CREATE TABLE IF NOT EXISTS warnings (
    id SERIAL PRIMARY KEY,
    guild_id VARCHAR(20) NOT NULL,
    user_id VARCHAR(20) NOT NULL,
    moderator_id VARCHAR(20) NOT NULL,
    moderator_tag VARCHAR(100) NOT NULL,
    reason TEXT NOT NULL,
    warn_date BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_fish_data_guild ON fish_data(guild_id);
CREATE INDEX IF NOT EXISTS idx_fish_cooldowns_guild ON fish_cooldowns(guild_id);
CREATE INDEX IF NOT EXISTS idx_family_guild ON family_relations(guild_id);
CREATE INDEX IF NOT EXISTS idx_family_user ON family_relations(user_id);
CREATE INDEX IF NOT EXISTS idx_warnings_guild ON warnings(guild_id);
CREATE INDEX IF NOT EXISTS idx_warnings_user ON warnings(guild_id, user_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_fish_data_updated_at 
    BEFORE UPDATE ON fish_data 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_server_stats_updated_at 
    BEFORE UPDATE ON server_stats 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
