const { EmbedBuilder } = require("discord.js");
const { fetchNekosBest } = require("../utils/nekosBest");

module.exports = {
  name: "hug",
  description: "Send a hug to someone!",
  category: "Fun",
  async execute(message, args) {
    const user = message.mentions.users.first();
    if (!user) return message.reply("Please mention someone to hug!");

    try {
      const { url } = await fetchNekosBest("hug");

      const embed = new EmbedBuilder()
        .setColor(6086089)
        .setTitle(`${message.author.username} hugged ${user.username}! 🤗`)
        .setImage(url)
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error("Failed to fetch hug GIF:", error);
      message.channel.send("Failed to fetch hug GIF!");
    }
  },
};
