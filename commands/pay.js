const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  let user = message.mentions.members.first() 
  let member = bot.db.fetch(`money_${message.guild.id}_${message.author.id}`)

  let embed1 = new Discord.MessageEmbed()
  .setColor("#FFFFFF")
  .setDescription(`:negative_squared_cross_mark: Mention someone to pay`);

  if (!user) {
      return message.channel.send(embed1)
  }

  let embed2 = new Discord.MessageEmbed()
  .setColor("#FFFFFF")
  .setDescription(`:negative_squared_cross_mark: Specify an amount to pay`);
  
  if (!args[1]) {
      return message.channel.send(embed2)
  }

  let embed3 = new Discord.MessageEmbed()
  .setColor("#FFFFFF")
  .setDescription(`:negative_squared_cross_mark: You can't pay someone negative money`);

  if (message.content.includes('-')) { 
    return message.channel.send(embed3)
  }

  let embed4 = new Discord.MessageEmbed()
  .setColor("#FFFFFF")
  .setDescription(`:negative_squared_cross_mark: You don't have that much money`);

  if (member < args[1]) {
    return message.channel.send(embed4)
  }

  let embed5 = new Discord.MessageEmbed()
  .setColor("#FFFFFF")
  .setDescription(`:white_check_mark:  You have payed ${user.user.username} ${args[1]} coins`);

  message.channel.send(embed5)
  bot.db.add(`money_${message.guild.id}_${user.id}`, parseInt(args[1]))
  bot.db.subtract(`money_${message.guild.id}_${message.author.id}`, parseInt(args[1]))
}

module.exports.help = {
  name:"pay",
  aliases: []
}