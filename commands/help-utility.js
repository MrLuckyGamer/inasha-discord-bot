const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
  let xdemb = new Discord.MessageEmbed()
  .setColor("RANDOM")
  .setTitle("Utility Commands")                  
  .addField("💡", `avatar, botinfo, userinfo, invite, support, serverinfo, weather`)
  
  message.channel.send(xdemb);
}

module.exports.help = {
  name: "help-utility",
  aliases: []
}