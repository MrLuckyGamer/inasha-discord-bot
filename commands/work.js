const Discord = require('discord.js')
const ms = require("parse-ms");

module.exports.run = async (bot, message, args) => {
    let user = message.author;
    let author = await bot.db.fetch(`work_${message.guild.id}_${user.id}`)
    let timeout = 600000;
    
    if (author !== undefined && timeout - (Date.now() - author) > 0) {
        let time = ms(timeout - (Date.now() - author));
        let timeEmbed = new Discord.MessageEmbed()
        .setColor("#FFFFFF")
        .setDescription(`:negative_squared_cross_mark:  You have already worked recently\n\nTry again in ${time.minutes}m ${time.seconds}s `);

        message.channel.send(timeEmbed)
      } else {
        let replies = ['Programmer','Builder','Waiter','Busboy','Chief','Mechanic']
        let result = Math.floor((Math.random() * replies.length));
        let amount = Math.floor(Math.random() * 80) + 1;

        let embed1 = new Discord.MessageEmbed()
        .setColor("#FFFFFF")
        .setDescription(`:white_check_mark: You worked as a ${replies[result]} and earned ${amount} coins`);

        message.channel.send(embed1)
        
        bot.db.add(`money_${message.guild.id}_${user.id}`, amount)
        bot.db.set(`work_${message.guild.id}_${user.id}`, Date.now())
    };
}

module.exports.help = {
  name:"work",
  aliases: ["wr"]
}