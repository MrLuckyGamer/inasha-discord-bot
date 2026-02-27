const { ChannelType, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");

const file = "./data/serverstats/serverstats.json";
let statsChannels = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};

module.exports = {
  name: "serverstats",
  description: "Enable or disable server statistics channels.",
  category: "Utility",

  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return message.reply("You need **Manage Server** permission to use this command.");
    }

    const sub = args[0]?.toLowerCase();

    // === ENABLE ===
    if (sub === "enable") {
      if (statsChannels[message.guild.id]) {
        return message.reply("Stats are already enabled in this server.");
      }

      const category = await message.guild.channels.create({
        name: "📊 Server Stats 📊",
        type: ChannelType.GuildCategory,
        position: 0,
      });

      async function createStatChannel(name) {
        return await message.guild.channels.create({
          name,
          type: ChannelType.GuildVoice,
          parent: category.id,
          permissionOverwrites: [
            {
              id: message.guild.id,
              deny: [PermissionFlagsBits.Connect],
            },
          ],
        });
      }

      const usersChannel = await createStatChannel("👥 Users: 0");
      const botsChannel = await createStatChannel("🤖 Bots: 0");
      const channelsChannel = await createStatChannel("💬 Channels: 0");

      statsChannels[message.guild.id] = {
        category: category.id,
        users: usersChannel.id,
        bots: botsChannel.id,
        channels: channelsChannel.id,
      };

      saveStats();

      updateStats(message.guild).catch(err => 
        console.error(`Stats update error for ${message.guild.name}:`, err)
      );

      return message.reply("Server stats have been enabled! Stats will update shortly.");
    }

    // === DISABLE ===
    else if (sub === "disable") {
      const data = statsChannels[message.guild.id];
      if (!data) return message.reply("Stats are not enabled in this server.");

      const category = message.guild.channels.cache.get(data.category);
      if (category) await category.delete().catch(() => {});

      for (const key of ["users", "bots", "channels"]) {
        const id = data[key];
        if (!id) continue;
        const ch = message.guild.channels.cache.get(id);
        if (ch) await ch.delete().catch(() => {});
      }

      delete statsChannels[message.guild.id];
      saveStats();

      return message.reply("Server stats have been disabled and removed.");
    }

    return message.reply("Usage: `i>serverstats enable` or `i>serverstats disable`");
  },
};

// === SAVE FILE ===
function saveStats() {
  fs.writeFileSync(file, JSON.stringify(statsChannels, null, 2));
}

// === FETCH QUEUE SYSTEM ===
class FetchQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.lastFetchTimes = new Map();
    this.MIN_DELAY = 6000; // 6 seconds minimum between fetches
  }

  async add(guild) {
    return new Promise((resolve) => {
      this.queue.push({ guild, resolve });
      this.process();
    });
  }

  async process() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;

    while (this.queue.length > 0) {
      const { guild, resolve } = this.queue.shift();
      
      try {
        const lastFetch = this.lastFetchTimes.get(guild.id);
        const now = Date.now();
        
        if (lastFetch) {
          const timeSince = now - lastFetch;
          if (timeSince < this.MIN_DELAY) {
            const waitTime = this.MIN_DELAY - timeSince;
            console.log(`Waiting ${Math.ceil(waitTime / 1000)}s before fetching ${guild.name}`);
            await new Promise(r => setTimeout(r, waitTime));
          }
        }

        console.log(`Fetching members for ${guild.name}...`);
        await guild.members.fetch({ force: true });
        this.lastFetchTimes.set(guild.id, Date.now());
        
        const botCount = guild.members.cache.filter(m => m.user.bot).size;
        resolve(botCount);

        await new Promise(r => setTimeout(r, 1000));
        
      } catch (error) {
        console.error(`Error fetching members for ${guild.name}:`, error);

        if (error.code === 'GatewayRateLimitError' || error.status === 429) {
          const retryAfter = (error.data?.retry_after || 5) * 1000;
          console.log(`Rate limited! Waiting ${Math.ceil(retryAfter / 1000)}s before continuing...`);
          await new Promise(r => setTimeout(r, retryAfter + 1000));

          this.queue.unshift({ guild, resolve });
        } else {
          const botCount = guild.members.cache.filter(m => m.user.bot).size;
          resolve(botCount);
        }
      }
    }

    this.processing = false;
  }
}

const fetchQueue = new FetchQueue();

// === GET BOT COUNT ===
async function getBotCount(guild) {
  try {
    const cachedCount = guild.members.cache.filter(m => m.user.bot).size;

    if (cachedCount > 0 && guild.members.cache.size > 10) {
      // console.log(`Using cached bot count for ${guild.name}: ${cachedCount}`);
      return cachedCount;
    }

    console.log(`Queuing member fetch for ${guild.name}`);
    return await fetchQueue.add(guild);
    
  } catch (error) {
    console.error(`Error in getBotCount for ${guild.name}:`, error);
    return guild.members.cache.filter(m => m.user.bot).size;
  }
}

// === UPDATE STATS ===
async function updateStats(guild) {
  const data = statsChannels[guild.id];
  if (!data) return;

  try {
    const bots = await getBotCount(guild).catch(() => 0);
    const total = typeof guild.memberCount === "number" ? guild.memberCount : 0;
    const users = Math.max(0, total - bots);

    const channels = guild.channels.cache.filter(ch => 
      ch.type === ChannelType.GuildText || ch.type === ChannelType.GuildVoice
    ).size;

    const updateChannel = (id, name) => {
      const ch = guild.channels.cache.get(id);
      if (ch) ch.setName(name).catch(() => {});
    };

    updateChannel(data.users, `👥 Users: ${users}`);
    updateChannel(data.bots, `🤖 Bots: ${bots}`);
    updateChannel(data.channels, `💬 Channels: ${channels}`);

    const category = guild.channels.cache.get(data.category);
    if (category) category.setPosition(0).catch(() => {});
    
    // console.log(`Updated stats for ${guild.name}: ${users} users, ${bots} bots, ${channels} channels`);
  } catch (error) {
    console.error(`Error updating stats for ${guild.name}:`, error);
  }
}

// === EXPORTS ===
module.exports.updateStats = updateStats;
module.exports.getBotCount = getBotCount;