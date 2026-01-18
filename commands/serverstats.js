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
      await updateStats(message.guild);

      return message.reply("Server stats have been enabled!");
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

// === RATE LIMITER ===
const fetchQueue = new Map();
const FETCH_COOLDOWN = 5000; // 5 seconds between fetches per guild

// === GET BOT COUNT ===
async function getBotCount(guild) {
  try {
    const lastFetch = fetchQueue.get(guild.id);
    const now = Date.now();
    
    if (!lastFetch || now - lastFetch > FETCH_COOLDOWN) {
      await guild.members.fetch({ force: true });
      fetchQueue.set(guild.id, now);
    }
    
    return guild.members.cache.filter(m => m.user.bot).size;
  } catch (error) {
    if (error.code === 'GatewayRateLimitError' || error.status === 429) {
      console.log(`Rate limited for ${guild.name}, using cached member count`);
      return guild.members.cache.filter(m => m.user.bot).size;
    }
    console.error("Error fetching members for bot count:", error);
    return 0;
  }
}

// === UPDATE STATS ===
async function updateStats(guild) {
  const data = statsChannels[guild.id];
  if (!data) return;

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
}

// === EXPORTS ===
module.exports.updateStats = updateStats;
module.exports.getBotCount = getBotCount;