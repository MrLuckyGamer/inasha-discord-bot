const { ChannelType, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");

const file = "./data/serverstats/serverstats.json";
let statsChannels = fs.existsSync(file)
  ? JSON.parse(fs.readFileSync(file))
  : {};

module.exports = {
  name: "serverstats",
  description: "Enable or disable server statistics channels.",
  category: "Utility",

  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return message.reply("You need **Manage Server** permission to use this command.");
    }

    const sub = args[0]?.toLowerCase();

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

    else if (sub === "disable") {
      const data = statsChannels[message.guild.id];
      if (!data) return message.reply("Stats are not enabled in this server.");

      const category = message.guild.channels.cache.get(data.category);
      if (category) await category.delete().catch(() => {});

      Object.values(data).forEach(async id => {
        const ch = message.guild.channels.cache.get(id);
        if (ch) await ch.delete().catch(() => {});
      });

      delete statsChannels[message.guild.id];
      saveStats();

      return message.reply("Server stats have been disabled and removed.");
    }

    return message.reply("Usage: `i>serverstats enable` or `i>serverstats disable`");
  },
};

function saveStats() {
  fs.writeFileSync(file, JSON.stringify(statsChannels, null, 2));
}

async function updateStats(guild) {
  const data = statsChannels[guild.id];
  if (!data) return;

  const users = guild.memberCount;
  const bots = guild.members.cache.filter(m => m.user.bot).size;
  const channels = guild.channels.cache.filter(ch => ch.type !== ChannelType.GuildCategory).size;

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

module.exports.updateStats = updateStats;