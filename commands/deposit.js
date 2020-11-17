const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  let user = message.author;
  let member = bot.db.fetch(`money_${message.guild.id}_${user.id}`)

  if (args[0] == 'all') {
    let money = await bot.db.fetch(`money_${message.guild.id}_${user.id}`)

    let embedbank = new Discord.MessageEmbed()
    .setColor('#FFFFFF')
    .setDescription(":cross: You don't have any money to deposit")

    if(money === 0) { return message.channel.send(embedbank) }

    bot.db.add(`bank_${message.guild.id}_${user.id}`, money)
    bot.db.subtract(`money_${message.guild.id}_${user.id}`, money)

    let embed5 = new Discord.MessageEmbed()
    .setColor("#FFFFFF")
    .setDescription(`:white_check_mark:  You have deposited all your coins into your bank`);

    message.channel.send(embed5)
  } else {
    let embed2 = new Discord.MessageEmbed()
    .setColor("#FFFFFF")
    .setDescription(`:cross: Specify an amount to deposit`);
    
    if (!args[0]) {
        return message.channel.send(embed2)
        .catch(err => console.log(err))
    }

    let embed3 = new Discord.MessageEmbed()
    .setColor("#FFFFFF")
    .setDescription(`:cross: You can't deposit negative money`);

    if (message.content.includes('-')) { 
        return message.channel.send(embed3)
    }

    let embed4 = new Discord.MessageEmbed()
    .setColor("#FFFFFF")
    .setDescription(`:cross: You don't have that much money`);

    if (member < args[0]) {
        return message.channel.send(embed4)
    }

    let embed5 = new Discord.MessageEmbed()
    .setColor("#FFFFFF")
    .setDescription(`:white_check_mark:  You have deposited ${args[0]} coins into your bank`);

    message.channel.send(embed5)
    bot.db.add(`bank_${message.guild.id}_${user.id}`, parseInt(args[0]))
    bot.db.subtract(`money_${message.guild.id}_${user.id}`, parseInt(args[0]))
  }
}

module.exports.help = {
  name:"deposit",
  aliases: ["dep"]
}