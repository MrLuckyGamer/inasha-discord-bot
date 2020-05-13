const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
  
  let xdemb = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle("Utility commands")                  
        .addField("💡", `avatar, botinfo, userinfo, invite, support, serverinfo, weather`)
  
  message.channel.send(xdemb);
  
      }
      module.exports.help = {
        name: "help",
        aliases: [""]
      }
  