const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
  let xdemb = new Discord.MessageEmbed()
  .setColor("RANDOM")
  .setTitle("Inasha Commands")
  .addField("Moderation Commands", bot.config.prefix + 'help-moderation')                                                                                                                                                                                                                                                         
  .addField("Fun Commands", bot.config.prefix + 'help-fun')                    
  .addField("Utility Commands", bot.config.prefix + `help-utility`)
  .addField("NSFW Commands", bot.config.prefix + 'help-nsfw')
  .addField("Music", bot.config.prefix + 'help-music')
  .addField("Economy", bot.config.prefix + "help-economy")
  .addField("Support Server", "[Click to join support Server](https://discord.gg/zdDy8Vy)")
  
  message.channel.send(xdemb);
}

module.exports.help = {
  name: "help",
  aliases: []
}