const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  let user = message.mentions.members.first() || message.author;

  let money = await bot.db.fetch(`money_${message.guild.id}_${user.id}`)
  if (money === undefined) { money = 0; }

  let bank = await bot.db.fetch(`bank_${message.guild.id}_${user.id}`)
  if (bank === undefined) { bank = 0; }

  let vip = await bot.db.fetch(`bronze_${message.guild.id}_${user.id}`)
    if(vip === undefined) { vip = 'None'; }
    if(vip === true) { vip = 'Bronze'; }

  let shoes = await bot.db.fetch(`nikes_${message.guild.id}_${user.id}`)
  if(shoes === undefined) { shoes = '0'; }

  let newcar = await bot.db.fetch(`car_${message.guild.id}_${user.id}`)
  if(newcar === undefined) { newcar = '0'; }

  let newhouse = await bot.db.fetch(`house_${message.guild.id}_${user.id}`)
  if(newhouse === undefined) { newhouse = '0'; }

  let moneyEmbed = new Discord.MessageEmbed()
  .setColor("#FFFFFF")
  .setDescription(`**${user}'s Profile**\n\nPocket: ${money}\nBank: ${bank}\nVIP Rank: ${vip}\n\n**Inventory**\n\nNikes: ${shoes}\nCars: ${newcar}\nMansions: ${newhouse}`);

  message.channel.send(moneyEmbed)
};

module.exports.help = {
  name:"profile",
  aliases: ["pro"]
}