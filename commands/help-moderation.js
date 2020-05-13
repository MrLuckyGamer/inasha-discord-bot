const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
  
  let xdemb = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle("Moderation commands")
        .addField("👊🏻", 'Ban, unban, kick, clear, say, addrole, removerole, mute, unmute, warn, lockdown, lockdown release, warns, serverstats, setwlc, setlogs.')                                                                                                                                                                                                                                                         
        .addField("Support Server", "[Click to join support Server](https://discord.gg/qaEq3bh)")
  
  message.channel.send(xdemb);
  
      }
      module.exports.help = {
        name: "help moderation",
        aliases: [""]
      }
  