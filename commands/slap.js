const { EmbedBuilder } = require("discord.js");

const slapGifs = [
  "https://media.giphy.com/media/Gf3AUz3eBNbTW/giphy.gif",
  "https://media.giphy.com/media/mEtSQlxqBtWWA/giphy.gif",
  "https://media.giphy.com/media/jLeyZWgtwgr2U/giphy.gif",
  "https://media.giphy.com/media/Zau0yrl17uzdK/giphy.gif",
  "https://media.giphy.com/media/3XlEk2RxPS1m8/giphy.gif",
  "https://media.giphy.com/media/RXGNsyRb1hDJm/giphy.gif"
];

module.exports = {
  name: "slap",
  description: "Slap someone playfully!",
  category: "Fun",
  async execute(message, args) {
    const user = message.mentions.users.first();
    if (!user) return message.reply("Please mention someone to slap!");

    const gif = slapGifs[Math.floor(Math.random() * slapGifs.length)];

    const embed = new EmbedBuilder()
      .setColor(8388736)
      .setTitle(`${message.author.username} slapped ${user.username}! 👋`)
      .setImage(gif)
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};