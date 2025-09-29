const { EmbedBuilder } = require("discord.js");
const config = require("../config.json");
const { version: botVersion } = require("../package.json");

module.exports = {
  name: "botinfo",
  description: "Show bot information.",
  category: "Utility",
  async execute(message) {
    const client = message.client;

    const createdDate = client.user.createdAt.toLocaleDateString("en-GB");

    const embed = new EmbedBuilder()
      .setTitle(`Bot Info: ${client.user.tag}`)
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        { name: "Servers", value: `${client.guilds.cache.size}`, inline: true },
        { name: "Users", value: `${client.users.cache.size}`, inline: true },
        { name: "Channels", value: `${client.channels.cache.size}`, inline: true },
        { name: "Prefix", value: `\`${config.prefix}\``, inline: true },
        { name: "Version", value: botVersion, inline: true },

        { name: "Node.js", value: process.version, inline: true },
        { name: "Discord.js", value: `v${require("discord.js").version}`, inline: true },
        //{ name: "Lodash", value: `v${require("lodash/package.json").version}`, inline: true },
        //{ name: "Undici", value: `v${require("undici/package.json").version}`, inline: true },

        { name: "Created On", value: createdDate, inline: true },
        { name: "Owner", value: `<@320407113887252482>`, inline: true }
      )
      .setColor(8388736)
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};