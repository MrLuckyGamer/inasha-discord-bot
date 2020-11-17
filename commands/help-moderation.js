const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
  let xdemb = new Discord.MessageEmbed()
  .setColor("RANDOM")
  .setTitle("Moderation Commands")
  .addField("👊🏻", 'ban, unban, kick, clear, say, removerole, mute, unmute, lockdown, lockdown release, serverstats')                                                                                                                                                                                                                                                         
  .addField("Support Server", "[Click to join support Server](https://discord.gg/zdDy8Vy)")
  
  message.channel.send(xdemb);
}

module.exports.help = {
  name: "help-moderation",
  aliases: []
}