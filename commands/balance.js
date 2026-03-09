const fs = require("fs");
const { EmbedBuilder } = require("discord.js");

const moneyFile = "./data/casino/money.json";
const rouletteFile = "./data/casino/roulette.json";
const slotsFile = "./data/casino/slots.json";

// Load data
let moneyData = fs.existsSync(moneyFile) ? JSON.parse(fs.readFileSync(moneyFile)) : {};
let rouletteStats = fs.existsSync(rouletteFile) ? JSON.parse(fs.readFileSync(rouletteFile)) : {};
let slotsStats = fs.existsSync(slotsFile) ? JSON.parse(fs.readFileSync(slotsFile)) : {};

function getMoney(guildId, userId) {
  if (!moneyData[guildId]) moneyData[guildId] = {};
  if (!moneyData[guildId][userId]) moneyData[guildId][userId] = 1000; // Starting balance
  return moneyData[guildId][userId];
}

module.exports = {
  name: "balance",
  description: "Check your casino balance and statistics",
  category: "Casino",
  async execute(message, args) {
    const guildId = message.guild.id;
    const targetMember = message.mentions.members.first() || message.member;
    const userId = targetMember.id;
    
    const balance = getMoney(guildId, userId);
    
    // Get roulette stats
    const rouletteData = rouletteStats[guildId]?.[userId] || { 
      wins: 0, 
      losses: 0, 
      totalWon: 0, 
      totalLost: 0 
    };
    
    // Get slots stats
    const slotsData = slotsStats[guildId]?.[userId] || { 
      wins: 0, 
      losses: 0, 
      totalWon: 0, 
      totalLost: 0,
      jackpots: 0,
      doubles: 0
    };
    
    // Calculate totals
    const totalGames = rouletteData.wins + rouletteData.losses + slotsData.wins + slotsData.losses;
    const totalWins = rouletteData.wins + slotsData.wins;
    const totalLosses = rouletteData.losses + slotsData.losses;
    const totalWonAmount = rouletteData.totalWon + slotsData.totalWon;
    const totalLostAmount = rouletteData.totalLost + slotsData.totalLost;
    const netProfit = totalWonAmount - totalLostAmount;
    const winRate = totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(1) : 0;
    
    const embed = new EmbedBuilder()
      .setColor(netProfit >= 0 ? "Green" : "Red")
      .setAuthor({ 
        name: `${targetMember.user.tag}'s Casino Stats`, 
        iconURL: targetMember.user.displayAvatarURL({ dynamic: true }) 
      })
      .setThumbnail(targetMember.user.displayAvatarURL({ dynamic: true, size: 128 }))
      .addFields(
        { 
          name: "💰 Current Balance", 
          value: `**${balance}** coins`, 
          inline: false 
        },
        { 
          name: "📊 Overall Stats", 
          value: `**Games Played:** ${totalGames}\n**Wins:** ${totalWins} | **Losses:** ${totalLosses}\n**Win Rate:** ${winRate}%`, 
          inline: false 
        },
        { 
          name: "💸 Profit/Loss", 
          value: `**Total Won:** ${totalWonAmount} coins\n**Total Lost:** ${totalLostAmount} coins\n**Net:** ${netProfit >= 0 ? '+' : ''}${netProfit} coins`, 
          inline: false 
        }
      )
      .setTimestamp();
    
    // Add roulette stats if they exist
    if (rouletteData.wins > 0 || rouletteData.losses > 0) {
      const rouletteWinRate = ((rouletteData.wins / (rouletteData.wins + rouletteData.losses)) * 100).toFixed(1);
      embed.addFields({
        name: "🎰 Roulette Stats",
        value: `**Games:** ${rouletteData.wins + rouletteData.losses}\n**Win Rate:** ${rouletteWinRate}%\n**Won:** ${rouletteData.totalWon} | **Lost:** ${rouletteData.totalLost}`,
        inline: true
      });
    }
    
    // Add slots stats if they exist
    if (slotsData.wins > 0 || slotsData.losses > 0) {
      const slotsWinRate = ((slotsData.wins / (slotsData.wins + slotsData.losses)) * 100).toFixed(1);
      embed.addFields({
        name: "🎰 Slots Stats",
        value: `**Games:** ${slotsData.wins + slotsData.losses}\n**Win Rate:** ${slotsWinRate}%\n**Jackpots:** ${slotsData.jackpots} | **Doubles:** ${slotsData.doubles}`,
        inline: true
      });
    }
    
    message.channel.send({ embeds: [embed] });
  },
};