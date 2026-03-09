const fs = require("fs");
const { EmbedBuilder } = require("discord.js");

const slotItems = ["🍇", "🍉", "🍊", "🍎", "🍓", "🍓", "🍒"];
const moneyFile = "./data/casino/money.json";
const slotsFile = "./data/casino/slots.json";

// Load or initialize data
let moneyData = fs.existsSync(moneyFile) ? JSON.parse(fs.readFileSync(moneyFile)) : {};
let slotsStats = fs.existsSync(slotsFile) ? JSON.parse(fs.readFileSync(slotsFile)) : {};

function ensureDataDir() {
  if (!fs.existsSync("./data")) fs.mkdirSync("./data");
  if (!fs.existsSync("./data/casino")) fs.mkdirSync("./data/casino");
}

function saveData() {
  ensureDataDir();
  fs.writeFileSync(moneyFile, JSON.stringify(moneyData, null, 2));
  fs.writeFileSync(slotsFile, JSON.stringify(slotsStats, null, 2));
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

function updateStats(guildId, userId, won, amount, type) {
  if (!slotsStats[guildId]) slotsStats[guildId] = {};
  if (!slotsStats[guildId][userId]) {
    slotsStats[guildId][userId] = { 
      wins: 0, 
      losses: 0, 
      totalWon: 0, 
      totalLost: 0,
      jackpots: 0,
      doubles: 0
    };
  }
  
  if (won) {
    slotsStats[guildId][userId].wins++;
    slotsStats[guildId][userId].totalWon += amount;
    if (type === "jackpot") slotsStats[guildId][userId].jackpots++;
    if (type === "double") slotsStats[guildId][userId].doubles++;
  } else {
    slotsStats[guildId][userId].losses++;
    slotsStats[guildId][userId].totalLost += amount;
  }
  saveData();
}

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
      .setDescription(`You are betting more than you have!\nYour balance: **${currentMoney}** coins`);

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

    // Check for jackpot (all 3 match)
    if (number[0] === number[1] && number[1] === number[2]) {
      winAmount = money * 9;
      multiplier = "9x";
      win = true;
      winType = "jackpot";
    }
    // Check for double (2 match)
    else if (number[0] === number[1] || number[0] === number[2] || number[1] === number[2]) {
      winAmount = money * 2;
      multiplier = "2x";
      win = true;
      winType = "double";
    }

    const slotDisplay = `${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}`;

    if (win) {
      addMoney(guildId, userId, winAmount);
      updateStats(guildId, userId, true, winAmount, winType);

      const winEmbed = new EmbedBuilder()
        .setColor("Gold")
        .setTitle("🎰 Slot Machine")
        .setDescription(`**${slotDisplay}**\n\n${winType === "jackpot" ? "🎉 **JACKPOT!** 🎉" : "✨ **Match!** ✨"}\n\n You won **${winAmount}** coins!\nMultiplier: **${multiplier}**`)
        .addFields(
          { name: "💰 New Balance", value: `${getMoney(guildId, userId)} coins`, inline: true },
          { name: "📊 Bet", value: `${money} coins`, inline: true }
        )
        .setTimestamp();

      message.channel.send({ embeds: [winEmbed] });
    } else {
      subtractMoney(guildId, userId, money);
      updateStats(guildId, userId, false, money, null);

      const loseEmbed = new EmbedBuilder()
        .setColor("DarkRed")
        .setTitle("🎰 Slot Machine")
        .setDescription(`**${slotDisplay}**\n\n You lost **${money}** coins!\nMultiplier: **0x**`)
        .addFields(
          { name: "💰 New Balance", value: `${getMoney(guildId, userId)} coins`, inline: true },
          { name: "📊 Bet", value: `${money} coins`, inline: true }
        )
        .setTimestamp();

      message.channel.send({ embeds: [loseEmbed] });
    }
  },
};