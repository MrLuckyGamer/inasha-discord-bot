const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let mentionedUser = message.mentions.users.first() || message.author;
    let embed = new Discord.MessageEmbed()
    .setImage(mentionedUser.avatarURL())
    .setColor("00ff00")
    .setTitle("Avatar")
    .setFooter("Searched by " + message.author.tag)
    .setDescription("[Avatar URL link](" + mentionedUser.avatarURL() + ")");

    message.channel.send(embed)
}

module.exports.help = {
  name:"avatar",
  aliases: []
}