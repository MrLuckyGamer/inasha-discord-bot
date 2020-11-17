const Discord = require("discord.js");
const ms = require("parse-ms");

module.exports.run = async (bot, message, args) => {
  let user = message.mentions.members.first()
  let author = await bot.db.fetch(`rob_${message.guild.id}_${user.id}`)
  let author2 = await bot.db.fetch(`money_${message.guild.id}_${user.id}`)
  let random = Math.floor(Math.random() * 100) + 1;

  let timeout = 600000;

  if (author !== undefined && timeout - (Date.now() - author) > 0) {
    let time = ms(timeout - (Date.now() - author));

    let timeEmbed = new Discord.MessageEmbed()
    .setColor("#FFFFFF")
    .setDescription(`:negative_squared_cross_mark: You have already robbed someone\n\nTry again in ${time.minutes}m ${time.seconds}s `);
    message.channel.send(timeEmbed)
  } else {
    let moneyEmbed = new Discord.MessageEmbed()
    .setColor("#FFFFFF")
    .setDescription(`:negative_squared_cross_mark: You need atleast 200 coins in your wallet to rob someone`);
    if (author2 < 200) {
        return message.channel.send(moneyEmbed)
    }

    let moneyEmbed2 = new Discord.MessageEmbed()
    .setColor("#FFFFFF")
    .setDescription(`:negative_squared_cross_mark: ${user.user.username} does not have anything you can rob`);
    return message.channel.send(moneyEmbed2)
  }

  let vip = await db.fetch(`bronze_${user.id}`)
  if(vip === true) { random = Math.floor(Math.random() * 200) + 1; }
  if (vip === undefined) { random = Math.floor(Math.random() * 100) + 1; }

  let embed = new Discord.MessageEmbed()
  .setDescription(`<:white_check_mark:618736570337591296> You robbed ${user} and got away with ${random} coins`)
  .setColor("#FFFFFF")
  message.channel.send(embed)

  bot.db.subtract(`money_${message.guild.id}_${user.id}`, random)
  bot.db.add(`money_${message.guild.id}_${user.id}`, random)
  bot.db.set(`rob_${message.guild.id}_${user.id}`, Date.now())
};

module.exports.help = {
  name:"rob",
  aliases: []
}