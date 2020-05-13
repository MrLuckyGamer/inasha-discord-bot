const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
  
  let xdemb = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle("Yung commands")
        .addField("Moderation Commands🏻", 'y!help-moderation')                                                                                                                                                                                                                                                         
        .addField("Fun Commands", 'y!help-fun')                    
        .addField("Utility Commands", `y!help-utility`)
        .addField("NSFW Commands", 'y!help-nsfw')
        .addField("Music", 'y!help-music')
        .addField("Economy", "y!help-economy")
        .addField("Support Server", "[Click to join support Server](https://discord.gg/qaEq3bh)")
  
  message.channel.send(xdemb);
  
      }
      module.exports.help = {
        name: "help",
        aliases: [""]
      }
  
