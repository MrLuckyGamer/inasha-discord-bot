const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
  
  let xdemb = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle("Economy commands")
        .addField("📈", 'balance , beg , work , daily , slots , store , store2 , rob , pay , profile , deposit , withdraw , weekly , roulette')
        .addField("WARNING", "ECONOMY IS IN BETA , IF NO WORK COMMANDS , ECONOMY COMMANDS ARE DOWN.")
        .addField("Support Server", "[Click to join support Server](https://discord.gg/qaEq3bh)")
  
  message.channel.send(xdemb);
  
      }
      module.exports.help = {
        name: "help",
        aliases: [""]
      }
  