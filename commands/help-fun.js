const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
  
  let xdemb = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle("Fun Commands")                                                                                                                                                                                                                                                       
        .addField("🥂", '  8ball, cat, dog, clap, joke, kill, morse, reverse, gay, meme, burn, hug, corona, coronatop, insult')                    
        .addField("Support Server", "[Click to join support Server](https://discord.gg/qaEq3bh)")
  
  message.channel.send(xdemb);
  
      }
      module.exports.help = {
        name: "help",
        aliases: [""]
      }
  