const { ChannelType, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");

const file = "./data/serverstats/serverstats.json";
let statsChannels = fs.existsSync(file)
  ? JSON.parse(fs.readFileSync(file, "utf8"))
  : {};

function saveStats() {
  fs.writeFileSync(file, JSON.stringify(statsChannels, null, 2));
}

const updateCooldown = new Map();

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
      });

      async function create(name) {
        return await message.guild.channels.create({
          name,
          type: ChannelType.GuildVoice,
          parent: category.id,
          permissionOverwrites: [
            { id: message.guild.id, deny: [PermissionFlagsBits.Connect] },
          ],
        });
      }

      const users = await create("👥 Users: 0");
      const bots = await create("🤖 Bots: 0");
      const channels = await create("💬 Channels: 0");

      statsChannels[message.guild.id] = {
        category: category.id,
        users: users.id,
        bots: bots.id,
        channels: channels.id,
      };

      saveStats();
      updateStats(message.guild);

      return message.reply("Server stats have been enabled!");
    }

    if (sub === "disable") {
      const data = statsChannels[message.guild.id];
      if (!data) return message.reply("Stats are not enabled in this server.");

      const category = message.guild.channels.cache.get(data.category);
      if (category) category.delete().catch(() => {});

      for (const key of ["users","bots","channels"]) {
        const ch = message.guild.channels.cache.get(data[key]);
        if (ch) ch.delete().catch(() => {});
      }

      delete statsChannels[message.guild.id];
      saveStats();

      return message.reply("Server stats have been disabled and removed.");
    }

    return message.reply("Usage: `i>serverstats enable` or `i>serverstats disable`");
  },
};

async function updateStats(guild) {
  const now = Date.now();

  if (updateCooldown.has(guild.id) && now - updateCooldown.get(guild.id) < 20000)
    return;

  updateCooldown.set(guild.id, now);

  const data = statsChannels[guild.id];
  if (!data) return;

  const total = guild.memberCount ?? 0;
  const bots = guild.members.cache.filter(m => m.user.bot).size;
  const users = Math.max(0, total - bots);

  const channels = guild.channels.cache.filter(ch =>
    ch.type === ChannelType.GuildText || ch.type === ChannelType.GuildVoice
  ).size;

  const rename = (id, name) => {
    const ch = guild.channels.cache.get(id);
    if (ch && ch.name !== name) ch.setName(name).catch(() => {});
  };

  rename(data.users, `👥 Users: ${users}`);
  rename(data.bots, `🤖 Bots: ${bots}`);
  rename(data.channels, `💬 Channels: ${channels}`);
}

module.exports.updateStats = updateStats;