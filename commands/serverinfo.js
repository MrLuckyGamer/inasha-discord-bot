const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "serverinfo",
  description: "Show server information.",
  category: "Utility",
  async execute(message) {
    const guild = message.guild;

    const embed = new EmbedBuilder()
      .setTitle(`Server Info: ${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: "Owner", value: `<@${guild.ownerId}>`, inline: true },
        { name: "Members", value: `${guild.memberCount}`, inline: true },
        { name: "Channels", value: `${guild.channels.cache.size}`, inline: true },
        { name: "Roles", value: `${guild.roles.cache.size}`, inline: true },
        { name: "Boosts", value: `${guild.premiumSubscriptionCount}`, inline: true },
        { name: "Created On", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true }
      )
      .setColor(8388736)
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};