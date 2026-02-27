const { EmbedBuilder } = require("discord.js");
const db = require("../database/db");

module.exports = {
  name: "fishlb",
  description: "Shows the fishing leaderboard for the server.",
  category: "Fun",
  async execute(message) {
    try {
      const guildId = message.guild.id;

      const leaderboard = await db.getFishLeaderboard(guildId, 10);

      if (leaderboard.length === 0) {
        return message.reply("No one has gone fishing yet! Be the first with `i>fish`!");
      }

      const leaderboardText = await Promise.all(
        leaderboard.map(async (entry, index) => {
          const user = await message.client.users.fetch(entry.user_id).catch(() => null);
          const username = user ? user.username : `Unknown User`;
          const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `**${index + 1}.**`;
          return `${medal} ${username} — **${entry.total_points}** coins`;
        })
      );

      const embed = new EmbedBuilder()
        .setTitle("🎣 Fishing Leaderboard")
        .setDescription(leaderboardText.join("\n"))
        .setColor(6086089)
        .setTimestamp()
        .setFooter({ text: `${message.guild.name}` });

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error in fishlb command:', error);
      message.reply("An error occurred while fetching the leaderboard. Please try again later.");
    }
  },
};