const { EmbedBuilder } = require("discord.js");
const {
  getMoney,
  addMoney,
  subtractMoney,
  updateRouletteStats,
} = require("./casinoUtils");

function isOdd(num) {
  return num % 2 === 1;
}

module.exports = {
  name: "roulette",
  description: "Play roulette! Bet on Red (1.5x), Black (2x), or Green (15x)",
  category: "Casino",
  async execute(message, args) {
    const guildId = message.guild.id;
    const userId = message.author.id;
    const currentMoney = getMoney(guildId, userId);

    const colorbad = new EmbedBuilder()
      .setColor("Red")
      .setDescription(
        "Specify a color! **Red** [1.5x] **Black** [2x] **Green** [15x]\nUsage: `roulette <color> <amount>`"
      );

    const moneyhelp = new EmbedBuilder()
      .setColor("Red")
      .setDescription(
        "Specify an amount to gamble!\nUsage: `roulette <color> <amount>`"
      );

    const moneymore = new EmbedBuilder()
      .setColor("Red")
      .setDescription(
        `You are betting more than you have!\nYour balance: **${currentMoney}** coins\nUse \`daily\` to claim free coins!`
      );

    let colour = args[0];
    let money = parseInt(args[1]);

    if (!colour) {
      return message.channel.send({ embeds: [colorbad] });
    }

    colour = colour.toLowerCase();

    if (!money || isNaN(money) || money <= 0) {
      return message.channel.send({ embeds: [moneyhelp] });
    }

    if (money > currentMoney) {
      return message.channel.send({ embeds: [moneymore] });
    }

    // Determine color choice
    let colorChoice;
    if (colour === "b" || colour.includes("black")) {
      colorChoice = 0;
    } else if (colour === "r" || colour.includes("red")) {
      colorChoice = 1;
    } else if (colour === "g" || colour.includes("green")) {
      colorChoice = 2;
    } else {
      return message.channel.send({ embeds: [colorbad] });
    }

    const random = Math.floor(Math.random() * 37); // 0-36
    let won = false;
    let winAmount = 0;
    let multiplier = "0x";
    let resultEmbed;

    if (random === 0 && colorChoice === 2) {
      winAmount = money * 15;
      multiplier = "15x";
      won = true;
      addMoney(guildId, userId, winAmount);
      updateRouletteStats(guildId, userId, true, winAmount);

      resultEmbed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("🎰 Roulette Result")
        .setDescription(
          `🟢 **GREEN!** The ball landed on **${random}**\n\n You won **${winAmount}** coins!\nMultiplier: **${multiplier}**`
        )
        .addFields({
          name: "💰 New Balance",
          value: `${getMoney(guildId, userId)} coins`,
          inline: true,
        })
        .setTimestamp();
    } else if (isOdd(random) && colorChoice === 1) {
      winAmount = Math.floor(money * 1.5);
      multiplier = "1.5x";
      won = true;
      addMoney(guildId, userId, winAmount);
      updateRouletteStats(guildId, userId, true, winAmount);

      resultEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🎰 Roulette Result")
        .setDescription(
          `🔴 **RED!** The ball landed on **${random}**\n\n You won **${winAmount}** coins!\nMultiplier: **${multiplier}**`
        )
        .addFields({
          name: "💰 New Balance",
          value: `${getMoney(guildId, userId)} coins`,
          inline: true,
        })
        .setTimestamp();
    } else if (!isOdd(random) && random !== 0 && colorChoice === 0) {
      winAmount = money * 2;
      multiplier = "2x";
      won = true;
      addMoney(guildId, userId, winAmount);
      updateRouletteStats(guildId, userId, true, winAmount);

      resultEmbed = new EmbedBuilder()
        .setColor("#000001")
        .setTitle("🎰 Roulette Result")
        .setDescription(
          `⚫ **BLACK!** The ball landed on **${random}**\n\n You won **${winAmount}** coins!\nMultiplier: **${multiplier}**`
        )
        .addFields({
          name: "💰 New Balance",
          value: `${getMoney(guildId, userId)} coins`,
          inline: true,
        })
        .setTimestamp();
    } else {
      subtractMoney(guildId, userId, money);
      updateRouletteStats(guildId, userId, false, money);

      const actualColor =
        random === 0 ? "🟢 Green" : isOdd(random) ? "🔴 Red" : "⚫ Black";
      const newBalance = getMoney(guildId, userId);

      resultEmbed = new EmbedBuilder()
        .setColor("DarkRed")
        .setTitle("🎰 Roulette Result")
        .setDescription(
          `${actualColor}! The ball landed on **${random}**\n\n You lost **${money}** coins!\nMultiplier: **0x**`
        )
        .addFields({
          name: "💰 New Balance",
          value: `${newBalance} coins${newBalance === 0 ? "\n*(Use `daily` to get more coins!)*" : ""}`,
          inline: true,
        })
        .setTimestamp();
    }

    message.channel.send({ embeds: [resultEmbed] });
  },
};