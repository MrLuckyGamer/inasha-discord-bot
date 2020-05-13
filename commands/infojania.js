const discord = require("discord.js")
const RichEmbed = require("discord.js")

module.exports.run = async (bot, message, args) => {
  
  let embed = new discord.RichEmbed()
  .setTitle("Jania INFO")
  .setColor("RANDOM")
  .addField("Descriere Jania", "1. Jania ii al 3 lea sel mai prost din clasa")
  .addField("------", "Jania probabil ii niger")
  message.channel.send(embed);
  

}

module.exports.help = {
  name:"infojania",
  aliases: [""]
}