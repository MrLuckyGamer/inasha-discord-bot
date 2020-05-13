const Discord = require('discord.js');
module.exports.run = async (bot, message, args) => {
    if (!message.mentions.users.first()) return message.channel.send('Mention someone.')
    message.channel.send(`**${message.author.username}** *burned*  **${message.mentions.users.first().username}**\nYou need some ice for that bud? :snowflake:\nhttps://cdn.discordapp.com/attachments/186920285285384192/262348996784291840/image.gif`)
    let mentionedUser = message.mentions.users.first() || message.author;
let embed = new Discord.RichEmbed()
       

      
  
}

module.exports.help = {
  name:"burn",
  aliases: ["burn"]
}