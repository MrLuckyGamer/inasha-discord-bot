const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
  let xdemb = new Discord.MessageEmbed()
  .setColor("RANDOM")
  .setTitle("Economy Commands")
  .addField("📈", 'balance, beg, work, daily, slots, store, storeinfo, rob, pay, profile, deposit, withdraw, weekly, roulette')
  .addField("WARNING", "ECONOMY IS IN BETA.")
  .addField("Support Server", "[Click to join support Server](https://discord.gg/zdDy8Vy)")
  
  message.channel.send(xdemb);
}

module.exports.help = {
  name: "help-economy",
  aliases: []
}