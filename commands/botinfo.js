const { EmbedBuilder, ChannelType } = require("discord.js");
const { version: botVersion } = require("../package.json");
const prefix = process.env.prefix || "i>";

module.exports = {
  name: "botinfo",
  description: "Show bot information.",
  category: "Utility",
  async execute(message) {
    const client = message.client;

    const totalUsers = client.guilds.cache.reduce((sum, g) => sum + g.memberCount, 0);

    let totalChannels = 0;
    client.guilds.cache.forEach(guild => {
      totalChannels += guild.channels.cache.filter(c => 
        c.type === ChannelType.GuildText || c.type === ChannelType.GuildVoice
      ).size;
    });

    const uptimeDays = Math.floor(client.uptime / 86400000);
    const uptimeHours = Math.floor((client.uptime % 86400000) / 3600000);
    const uptimeMinutes = Math.floor((client.uptime % 3600000) / 60000);

    const createdDate = client.user.createdAt.toLocaleDateString("en-GB");

    const embed = new EmbedBuilder()
      .setTitle(`Bot Info: ${client.user.tag}`)
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        { name: "Servers", value: `${client.guilds.cache.size}`, inline: true },
        { name: "Users", value: `${totalUsers}`, inline: true },
        { name: "Channels", value: `${totalChannels}`, inline: true },
        { name: "Prefix", value: `\`${prefix}\``, inline: true },
        { name: "Version", value: botVersion, inline: true },
        { name: "Node.js", value: process.version, inline: true },
        { name: "Discord.js", value: `v${require("discord.js").version}`, inline: true },
        { name: "Created On", value: createdDate, inline: true },
        { name: "Owner", value: `<@320407113887252482>`, inline: true }
      )
      .setColor(6086089)
      .setTimestamp();

    return message.channel.send({ embeds: [embed] });
  },
};