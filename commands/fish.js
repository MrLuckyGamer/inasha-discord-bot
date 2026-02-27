const { EmbedBuilder } = require("discord.js");
const db = require("../database/db");

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
    try {
      const guildId = message.guild.id;
      const userId = message.author.id;
      const now = Date.now();

      // Check cooldown
      const lastFish = await db.getFishCooldown(guildId, userId);

      if (now - lastFish < COOLDOWN) {
        const remaining = COOLDOWN - (now - lastFish);
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        return message.reply(`⏳ You need to wait **${hours}h ${minutes}m ${seconds}s** before fishing again.`);
      }

      // Catch a fish
      const caught = getRandomFish();
      const points = getRandomPoints(caught.min, caught.max);

      // Update fish data
      await db.updateFishData(guildId, userId, points);
      const totalPoints = await db.getFishData(guildId, userId);

      // Set cooldown
      await db.setFishCooldown(guildId, userId, now);

      const embed = new EmbedBuilder()
        .setTitle(`${message.author.username} went fishing! 🎣`)
        .setDescription(
          `You caught a **${caught.name}**!\nCoins Earned: **${points}**\nTotal Coins Earned: **${totalPoints}**`
        )
        .setColor(6086089)
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error in fish command:', error);
      message.reply("An error occurred while fishing. Please try again later.");
    }
  },
};