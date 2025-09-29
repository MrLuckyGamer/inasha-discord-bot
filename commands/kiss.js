const { EmbedBuilder } = require("discord.js");

const kissGifs = [
  "https://media.giphy.com/media/G3va31oEEnIkM/giphy.gif",
  "https://media.giphy.com/media/FqBTvSNjNzeZG/giphy.gif",
  "https://media.giphy.com/media/bGm9FuBCGg4SY/giphy.gif",
  "https://media.giphy.com/media/nyGFcsP0kAobm/giphy.gif",
  "https://media.giphy.com/media/ZRSGWtBJG4Tza/giphy.gif",
  "https://media.giphy.com/media/KH1CTZtw1iP3W/giphy.gif",
  "https://media.giphy.com/media/hnNyVPIXgLdle/giphy.gif",
  "https://media.giphy.com/media/wOtkVwroA6yzK/giphy.gif"
];

module.exports = {
  name: "kiss",
  description: "Send a kiss to someone!",
  category: "Fun",
  async execute(message, args) {
    const user = message.mentions.users.first();
    if (!user) return message.reply("Please mention someone to kiss!");

    const gif = kissGifs[Math.floor(Math.random() * kissGifs.length)];

    const embed = new EmbedBuilder()
      .setColor(8388736)
      .setTitle(`${message.author.username} kissed ${user.username}! 😘`)
      .setImage(gif)
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};