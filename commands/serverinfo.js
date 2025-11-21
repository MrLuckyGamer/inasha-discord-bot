const { EmbedBuilder, ChannelType } = require("discord.js");
const { getBotCount } = require("./serverstats");

module.exports = {
  name: "serverinfo",
  description: "Show server information.",
  category: "Utility",
  async execute(message) {
    const guild = message.guild;
    if (!guild) return message.reply("This command can only be used in a server.");

    const bots = await getBotCount(guild).catch(() => 0);
    const users = Math.max(0, guild.memberCount - bots);

    const textChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size;
    const voiceChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size;

    const embed = new EmbedBuilder()
      .setTitle(`Server Info: ${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: "Owner", value: `<@${guild.ownerId}>`, inline: true },
        { name: "Users", value: `${users}`, inline: true },
        { name: "Text Channels", value: `${textChannels}`, inline: true },
        { name: "Voice Channels", value: `${voiceChannels}`, inline: true },
        { name: "Roles", value: `${guild.roles.cache.size}`, inline: true },
        { name: "Boosts", value: `${guild.premiumSubscriptionCount}`, inline: true },
        { name: "Created On", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true }
      )
      .setColor(8388736)
      .setTimestamp();

    return message.channel.send({ embeds: [embed] });
  },
};