const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
  
  let xdemb = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle("NSFW commands")
        .addField("🔒", '4k, anal, ass, hentai, holo, pussy, thigh, boobs')
  
  message.channel.send(xdemb);
  
      }
      module.exports.help = {
        name: "help",
        aliases: [""]
      }
  