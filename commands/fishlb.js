const fs = require("fs");
const { EmbedBuilder } = require("discord.js");

const fishFile = "./data/fish/fish.json";

module.exports = {
  name: "fishlb",
  description: "Show the top 10 fishers in the server.",
  category: "Fun",
  async execute(message) {
    const guildId = message.guild.id;

    const fishData = fs.existsSync(fishFile) ? JSON.parse(fs.readFileSync(fishFile)) : {};

    if (!fishData[guildId] || Object.keys(fishData[guildId]).length === 0) {
      return message.channel.send("No fish caught yet in this server! 🎣");
    }

    await message.guild.members.fetch();
    const guildMembers = message.guild.members.cache;

    const leaderboard = Object.entries(fishData[guildId])
      .map(([id, points]) => ({ id, points }))
      .filter(entry => guildMembers.has(entry.id))
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);

    const description = leaderboard.map((entry, index) => {
      const member = guildMembers.get(entry.id);
      return `**${index + 1}. ${member ? member.user.username : "Unknown"}** - ${entry.points} Coins`;
    }).join("\n");

    const embed = new EmbedBuilder()
      .setTitle(`🎣 Fish Leaderboard - ${message.guild.name}`)
      .setDescription(description)
      .setColor(8388736)
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};