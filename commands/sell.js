const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {
    let user = message.author;

    if(args[0] == 'nikes') {
        let Embed2 = new Discord.MessageEmbed()
        .setColor("#FFFFFF")
        .setDescription(`<:negative_squared_cross_mark:618736602901905418> You don't have Nikes to sell`);

        let nikeses = await bot.db.fetch(`nikes_${message.guild.id}_${user.id}`)
        if (nikeses < 1) return message.channel.send(Embed2)
       
        bot.db.fetch(`nikes_${message.guild.id}_${user.id}`)
        bot.db.subtract(`nikes_${message.guild.id}_${user.id}`, 1)

        let Embed3 = new Discord.MessageEmbed()
        .setColor("#FFFFFF")
        .setDescription(`<:white_check_mark:618736570337591296> Sold Fresh Nikes For 600 Coins`);

        bot.db.add(`money_${message.guild.id}_${user.id}`, 600)
        message.channel.send(Embed3)
    } else if(args[0] == 'car') {
        let Embed2 = new Discord.MessageEmbed()
        .setColor("#FFFFFF")
        .setDescription(`<:negative_squared_cross_mark:618736602901905418> You don't have a Car to sell`);

        let cars = await bot.db.fetch(`car_${message.guild.id}_${user.id}`)
        if (cars < 1) return message.channel.send(Embed2)
       
        bot.db.fetch(`car_${message.guild.id}_${user.id}`)
        bot.db.subtract(`car_${message.guild.id}_${user.id}`, 1)

        let Embed3 = new Discord.MessageEmbed()
        .setColor("#FFFFFF")
        .setDescription(`<:white_check_mark:618736570337591296> Sold a Car For 800 Coins`);

        bot.db.add(`money_${message.guild.id}_${user.id}`, 800)
        message.channel.send(Embed3)
    } else if(args[0] == 'mansion') {
        let Embed2 = new Discord.MessageEmbed()
        .setColor("#FFFFFF")
        .setDescription(`<:negative_squared_cross_mark:618736602901905418> You don't have a Mansion to sell`);

        let houses = await bot.db.fetch(`house_${message.guild.id}_${user.id}`)
        if (houses < 1) return message.channel.send(Embed2)
       
        bot.db.fetch(`house_${message.guild.id}_${user.id}`)
        bot.db.subtract(`house_${message.guild.id}_${user.id}`, 1)

        let Embed3 = new Discord.MessageEmbed()
        .setColor("#FFFFFF")
        .setDescription(`<:white_check_mark:618736570337591296> Sold a Mansion For 1200 Coins`);

        bot.db.add(`money_${message.guild.id}_${user.id}`, 1200)
        message.channel.send(Embed3)
    };
}
  
module.exports.help = {
    name:"sell",
    aliases: []
}