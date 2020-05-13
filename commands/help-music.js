const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
  
  let xdemb = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle("Music commands")
        .addField("🎵", 'play , stop , np (now play), queue , pause, resume.')
        .addField("Support Server", "[Click to join support Server](https://discord.gg/qaEq3bh)")
  
  message.channel.send(xdemb);
  
      }
      module.exports.help = {
        name: "help",
        aliases: [""]
      }
  