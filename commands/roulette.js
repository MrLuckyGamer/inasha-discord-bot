const fs = require("fs");
const { EmbedBuilder } = require("discord.js");

const moneyFile = "./data/casino/money.json";
const rouletteFile = "./data/casino/roulette.json";

// Load or initialize data
let moneyData = fs.existsSync(moneyFile) ? JSON.parse(fs.readFileSync(moneyFile)) : {};
let rouletteStats = fs.existsSync(rouletteFile) ? JSON.parse(fs.readFileSync(rouletteFile)) : {};

function isOdd(num) {
  return num % 2 === 1;
}

function ensureDataDir() {
  if (!fs.existsSync("./data")) fs.mkdirSync("./data");
  if (!fs.existsSync("./data/casino")) fs.mkdirSync("./data/casino");
}

function saveData() {
  ensureDataDir();
  fs.writeFileSync(moneyFile, JSON.stringify(moneyData, null, 2));
  fs.writeFileSync(rouletteFile, JSON.stringify(rouletteStats, null, 2));
}

function getMoney(guildId, userId) {
  if (!moneyData[guildId]) moneyData[guildId] = {};
  if (!moneyData[guildId][userId]) moneyData[guildId][userId] = 1000; // Starting balance
  return moneyData[guildId][userId];
}

function addMoney(guildId, userId, amount) {
  if (!moneyData[guildId]) moneyData[guildId] = {};
  if (!moneyData[guildId][userId]) moneyData[guildId][userId] = 1000;
  moneyData[guildId][userId] += amount;
  saveData();
}

function subtractMoney(guildId, userId, amount) {
  if (!moneyData[guildId]) moneyData[guildId] = {};
  if (!moneyData[guildId][userId]) moneyData[guildId][userId] = 1000;
  moneyData[guildId][userId] -= amount;
  saveData();
}

function updateStats(guildId, userId, won, amount) {
  if (!rouletteStats[guildId]) rouletteStats[guildId] = {};
  if (!rouletteStats[guildId][userId]) {
    rouletteStats[guildId][userId] = { wins: 0, losses: 0, totalWon: 0, totalLost: 0 };
  }
  
  if (won) {
    rouletteStats[guildId][userId].wins++;
    rouletteStats[guildId][userId].totalWon += amount;
  } else {
    rouletteStats[guildId][userId].losses++;
    rouletteStats[guildId][userId].totalLost += amount;
  }
  saveData();
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
      .setDescription("Specify a color! **Red** [1.5x] **Black** [2x] **Green** [15x]\nUsage: `roulette <color> <amount>`");

    const moneyhelp = new EmbedBuilder()
      .setColor("Red")
      .setDescription("Specify an amount to gamble!\nUsage: `roulette <color> <amount>`");

    const moneymore = new EmbedBuilder()
      .setColor("Red")
      .setDescription(`You are betting more than you have!\nYour balance: **${currentMoney}** coins`);

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
      colorChoice = 0; // Black
    } else if (colour === "r" || colour.includes("red")) {
      colorChoice = 1; // Red
    } else if (colour === "g" || colour.includes("green")) {
      colorChoice = 2; // Green
    } else {
      return message.channel.send({ embeds: [colorbad] });
    }

    const random = Math.floor(Math.random() * 37); // 0-36
    let won = false;
    let winAmount = 0;
    let multiplier = "0x";
    let resultEmbed;

    if (random === 0 && colorChoice === 2) {
      // Green win
      winAmount = money * 15;
      multiplier = "15x";
      won = true;
      addMoney(guildId, userId, winAmount);
      updateStats(guildId, userId, true, winAmount);

      resultEmbed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("🎰 Roulette Result")
        .setDescription(`🟢 **GREEN!** The ball landed on **${random}**\n\n You won **${winAmount}** coins!\nMultiplier: **${multiplier}**`)
        .addFields(
          { name: "💰 New Balance", value: `${getMoney(guildId, userId)} coins`, inline: true }
        )
        .setTimestamp();

    } else if (isOdd(random) && colorChoice === 1) {
      // Red win
      winAmount = Math.floor(money * 1.5);
      multiplier = "1.5x";
      won = true;
      addMoney(guildId, userId, winAmount);
      updateStats(guildId, userId, true, winAmount);

      resultEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🎰 Roulette Result")
        .setDescription(`🔴 **RED!** The ball landed on **${random}**\n\n You won **${winAmount}** coins!\nMultiplier: **${multiplier}**`)
        .addFields(
          { name: "💰 New Balance", value: `${getMoney(guildId, userId)} coins`, inline: true }
        )
        .setTimestamp();

    } else if (!isOdd(random) && random !== 0 && colorChoice === 0) {
      // Black win
      winAmount = money * 2;
      multiplier = "2x";
      won = true;
      addMoney(guildId, userId, winAmount);
      updateStats(guildId, userId, true, winAmount);

      resultEmbed = new EmbedBuilder()
        .setColor("#000001")
        .setTitle("🎰 Roulette Result")
        .setDescription(`⚫ **BLACK!** The ball landed on **${random}**\n\n You won **${winAmount}** coins!\nMultiplier: **${multiplier}**`)
        .addFields(
          { name: "💰 New Balance", value: `${getMoney(guildId, userId)} coins`, inline: true }
        )
        .setTimestamp();

    } else {
      // Loss
      subtractMoney(guildId, userId, money);
      updateStats(guildId, userId, false, money);

      const actualColor = random === 0 ? "🟢 Green" : isOdd(random) ? "🔴 Red" : "⚫ Black";

      resultEmbed = new EmbedBuilder()
        .setColor("DarkRed")
        .setTitle("🎰 Roulette Result")
        .setDescription(`${actualColor}! The ball landed on **${random}**\n\n You lost **${money}** coins!\nMultiplier: **0x**`)
        .addFields(
          { name: "💰 New Balance", value: `${getMoney(guildId, userId)} coins`, inline: true }
        )
        .setTimestamp();
    }

    message.channel.send({ embeds: [resultEmbed] });
  },
};