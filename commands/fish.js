const fs = require("fs");
const { EmbedBuilder } = require("discord.js");

const fishFile = "./data/fish/fish.json";
const cooldownFile = "./data/fish/fishCooldowns.json";

let fishData = fs.existsSync(fishFile) ? JSON.parse(fs.readFileSync(fishFile)) : {};
let cooldowns = fs.existsSync(cooldownFile) ? JSON.parse(fs.readFileSync(cooldownFile)) : {};

const COOLDOWN = 1 * 60 * 60 * 1000; // 1 hour in milliseconds

const fishes = [
  { name: "🐟 Common Fish", min: 1, max: 20, weight: 50 },
  { name: "🐠 Tropical Fish", min: 21, max: 40, weight: 30 },
  { name: "🐡 Pufferfish", min: 41, max: 60, weight: 15 },
  { name: "🐙 Octopus", min: 61, max: 80, weight: 4 },
  { name: "🦈 Shark", min: 81, max: 100, weight: 1 },
];

function getRandomFish() {
  const totalWeight = fishes.reduce((sum, f) => sum + f.weight, 0);
  let random = Math.random() * totalWeight;
  for (const fish of fishes) {
    if (random < fish.weight) return fish;
    random -= fish.weight;
  }
  return fishes[0];
}

function getRandomPoints(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  name: "fish",
  description: "Go fishing and try to catch the most rare fish!",
  category: "Fun",
  async execute(message) {
    const guildId = message.guild.id;
    const userId = message.author.id;
    const now = Date.now();

    if (!cooldowns[guildId]) cooldowns[guildId] = {};
    const lastFish = cooldowns[guildId][userId] || 0;

    if (now - lastFish < COOLDOWN) {
      const remaining = COOLDOWN - (now - lastFish);
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      return message.reply(`⏳ You need to wait **${hours}h ${minutes}m ${seconds}s** before fishing again.`);
    }

    const caught = getRandomFish();
    const points = getRandomPoints(caught.min, caught.max);

    if (!fishData[guildId]) fishData[guildId] = {};
    if (!fishData[guildId][userId]) fishData[guildId][userId] = 0;
    fishData[guildId][userId] += points;

    fs.writeFileSync(fishFile, JSON.stringify(fishData, null, 2));

    cooldowns[guildId][userId] = now;
    fs.writeFileSync(cooldownFile, JSON.stringify(cooldowns, null, 2));

    const embed = new EmbedBuilder()
      .setTitle(`${message.author.username} went fishing! 🎣`)
      .setDescription(
        `You caught a **${caught.name}**!\nCoins Earned: **${points}**\nTotal Coins Earned: **${fishData[guildId][userId]}**`
      )
      .setColor(6086089)
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};