import fs from "fs";
import { EmbedBuilder, Message, Client } from "discord.js";
import { PrefixCommand, FishData, CooldownData, Fish } from "../types";

const fishFile = "./data/fish/fish.json";
const cooldownFile = "./data/fish/fishCooldowns.json";

let fishData: FishData = fs.existsSync(fishFile) 
  ? JSON.parse(fs.readFileSync(fishFile, "utf8")) 
  : {};

let cooldowns: CooldownData = fs.existsSync(cooldownFile) 
  ? JSON.parse(fs.readFileSync(cooldownFile, "utf8")) 
  : {};

const COOLDOWN = 1 * 60 * 60 * 1000; // 1 hour in milliseconds

const fishes: Fish[] = [
  { name: "🐟 Common Fish", min: 1, max: 20, weight: 50 },
  { name: "🐠 Tropical Fish", min: 21, max: 40, weight: 30 },
  { name: "🐡 Pufferfish", min: 41, max: 60, weight: 15 },
  { name: "🐙 Octopus", min: 61, max: 80, weight: 4 },
  { name: "🦈 Shark", min: 81, max: 100, weight: 1 },
];

function getRandomFish(): Fish {
  const totalWeight = fishes.reduce((sum, f) => sum + f.weight, 0);
  let random = Math.random() * totalWeight;
  for (const fish of fishes) {
    if (random < fish.weight) return fish;
    random -= fish.weight;
  }
  return fishes[0];
}

function getRandomPoints(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const command: PrefixCommand = {
  name: "fish",
  description: "Go fishing and try to catch the most rare fish!",
  category: "Fun",
  async execute(message: Message): Promise<void> {
    if (!message.guild) {
      await message.reply("This command can only be used in a server!");
      return;
    }

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
      await message.reply(`⏳ You need to wait **${hours}h ${minutes}m ${seconds}s** before fishing again.`);
      return;
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

    await message.channel.send({ embeds: [embed] });
  },
};

export = command;