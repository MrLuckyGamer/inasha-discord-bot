const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
  let xdemb = new Discord.MessageEmbed()
  .setColor("RANDOM")
  .setTitle("Music Commands")
  .addField("🎵", 'play , stop , np (now play), queue , pause, resume.')
  .addField("Support Server", "[Click to join support Server](https://discord.gg/zdDy8Vy)")
  
  message.channel.send(xdemb);
}

module.exports.help = {
  name: "help-music",
  aliases: []
}