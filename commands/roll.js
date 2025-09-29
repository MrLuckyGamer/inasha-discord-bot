const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "roll",
  description: "Roll a random number between 0 and 100.",
  category: "Fun",
  async execute(message) {
    const result = Math.floor(Math.random() * 101);
    message.channel.send(`🎲 ${message.author.username} rolled a **${result}**!`);
  },
};