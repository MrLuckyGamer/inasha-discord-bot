const { EmbedBuilder } = require("discord.js");
const { fetchOtakuGif } = require("../utils/otakuGifs");

module.exports = {
  name: "kiss",
  description: "Send a kiss to someone!",
  category: "Fun",
  async execute(message, args) {
    const user = message.mentions.users.first();
    if (!user) return message.reply("Please mention someone to kiss!");

    try {
      const { url } = await fetchOtakuGif("kiss");

      const embed = new EmbedBuilder()
        .setColor(6086089)
        .setTitle(`${message.author.username} kissed ${user.username}! 😘`)
        .setImage(url)
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error("Failed to fetch kiss GIF:", error);
      message.channel.send("Failed to fetch kiss GIF!");
    }
  },
};
