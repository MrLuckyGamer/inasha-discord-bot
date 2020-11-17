const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {
    let embed = new Discord.MessageEmbed()
    .setDescription(`**VIP Ranks**\n\nBronze: 3500 Coins [${bot.config.prefix}buy bronze]\n\n**Lifestyle Items**\n\nFresh Nikes: 600 [${bot.config.prefix}buy nikes]\nCar: 800 [${bot.config.prefix}buy car]\nMansion: 1200 [${bot.config.prefix}buy mansion]`)
    .setColor("#FFFFFF")

    message.channel.send(embed)
}

module.exports.help = {
  name:"store",
  aliases: ["st"]
}