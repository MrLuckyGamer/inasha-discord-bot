const { EmbedBuilder } = require("discord.js");
const { fetchNekosBest } = require("../utils/nekosBest");

module.exports = {
  name: "slap",
  description: "Slap someone playfully!",
  category: "Fun",
  async execute(message, args) {
    const user = message.mentions.users.first();
    if (!user) return message.reply("Please mention someone to slap!");

    try {
      const { url } = await fetchNekosBest("slap");

      const embed = new EmbedBuilder()
        .setColor(6086089)
        .setTitle(`${message.author.username} slapped ${user.username}! 👋`)
        .setImage(url)
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error("Failed to fetch slap GIF:", error);
      message.channel.send("Failed to fetch slap GIF!");
    }
  },
};
