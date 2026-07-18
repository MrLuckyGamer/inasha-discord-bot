const { EmbedBuilder } = require("discord.js");
const {
  getMoney,
  addMoney,
  subtractMoney,
  updateSlotsStats,
} = require("./casinoUtils");

const slotItems = ["🍇", "🍉", "🍊", "🍎", "🍓", "🍓", "🍒"];

module.exports = {
  name: "slots",
  description: "Play the slot machine! Match 2 for 2x, match 3 for 9x!",
  category: "Casino",
  async execute(message, args) {
    const guildId = message.guild.id;
    const userId = message.author.id;
    const currentMoney = getMoney(guildId, userId);

    const moneyhelp = new EmbedBuilder()
      .setColor("Red")
      .setDescription("Specify an amount to bet!\nUsage: `slots <amount>`");

    const moneymore = new EmbedBuilder()
      .setColor("Red")
      .setDescription(
        `You are betting more than you have!\nYour balance: **${currentMoney}** coins\nUse \`daily\` to claim free coins!`
      );

    let money = parseInt(args[0]);

    if (!money || isNaN(money) || money <= 0) {
      return message.channel.send({ embeds: [moneyhelp] });
    }

    if (money > currentMoney) {
      return message.channel.send({ embeds: [moneymore] });
    }

    // Generate slot results
    const number = [];
    for (let i = 0; i < 3; i++) {
      number[i] = Math.floor(Math.random() * slotItems.length);
    }

    let win = false;
    let winAmount = 0;
    let multiplier = "0x";
    let winType = null;

    if (number[0] === number[1] && number[1] === number[2]) {
      winAmount = money * 8;
      multiplier = "9x";
      win = true;
      winType = "jackpot";
    } else if (
      number[0] === number[1] ||
      number[0] === number[2] ||
      number[1] === number[2]
    ) {
      winAmount = money;
      multiplier = "2x";
      win = true;
      winType = "double";
    }

    const slotDisplay = `${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}`;

    if (win) {
      addMoney(guildId, userId, winAmount);
      updateSlotsStats(guildId, userId, true, winAmount, winType);

      const winEmbed = new EmbedBuilder()
        .setColor("Gold")
        .setTitle("🎰 Slot Machine")
        .setDescription(
          `**${slotDisplay}**\n\n${winType === "jackpot" ? "🎉 **JACKPOT!** 🎉" : "✨ **Match!** ✨"}\n\n You won **${winAmount}** coins!\nMultiplier: **${multiplier}**`
        )
        .addFields(
          {
            name: "💰 New Balance",
            value: `${getMoney(guildId, userId)} coins`,
            inline: true,
          },
          { name: "📊 Bet", value: `${money} coins`, inline: true }
        )
        .setTimestamp();

      message.channel.send({ embeds: [winEmbed] });
    } else {
      subtractMoney(guildId, userId, money);
      updateSlotsStats(guildId, userId, false, money, null);

      const newBalance = getMoney(guildId, userId);

      const loseEmbed = new EmbedBuilder()
        .setColor("DarkRed")
        .setTitle("🎰 Slot Machine")
        .setDescription(
          `**${slotDisplay}**\n\n You lost **${money}** coins!\nMultiplier: **0x**`
        )
        .addFields(
          {
            name: "💰 New Balance",
            value: `${newBalance} coins${newBalance === 0 ? "\n*(Use `daily` to get more coins!)*" : ""}`,
            inline: true,
          },
          { name: "📊 Bet", value: `${money} coins`, inline: true }
        )
        .setTimestamp();

      message.channel.send({ embeds: [loseEmbed] });
    }
  },
};