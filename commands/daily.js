const { EmbedBuilder } = require("discord.js");
const { claimDaily, DAILY_AMOUNT } = require("./casinoUtils");

function formatCooldown(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);
  return parts.join(" ");
}

module.exports = {
  name: "daily",
  description: `Claim your free ${DAILY_AMOUNT} coins every 24 hours`,
  category: "Casino",
  async execute(message, args) {
    const guildId = message.guild.id;
    const userId = message.author.id;

    const result = claimDaily(guildId, userId);

    if (result.claimed) {
      const embed = new EmbedBuilder()
        .setColor("Gold")
        .setTitle("🎁 Daily Reward Claimed!")
        .setDescription(
          `${message.author} received **${result.amount}** free coins!`
        )
        .addFields({
          name: "💰 New Balance",
          value: `${result.newBalance} coins`,
          inline: true,
        })
        .setFooter({ text: "Come back in 24 hours for your next reward!" })
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    } else {
      const timeLeft = formatCooldown(result.msLeft);

      const embed = new EmbedBuilder()
        .setColor("Orange")
        .setTitle("⏰ Daily Already Claimed")
        .setDescription(
          `${message.author}, you already claimed your daily reward!\nCome back in **${timeLeft}**.`
        )
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    }
  },
};