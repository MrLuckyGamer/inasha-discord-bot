const Discord = require("discord.js");
const ms = require("parse-ms");

module.exports.run = async (bot, message, args) => {
  let user = message.author;
  let timeout = 604800000;
  let amount = 500;
  let weekly = await bot.db.fetch(`weekly_${message.guild.id}_${user.id}`);

  if (weekly !== undefined && timeout - (Date.now() - weekly) > 0) {
    let time = ms(timeout - (Date.now() - weekly));
    let timeEmbed = new Discord.MessageEmbed()
    .setColor("#FFFFFF")
    .setDescription(`<:negative_squared_cross_mark:618736602901905418> You have already collected your weekly reward\n\nCollect it again in ${time.days}d ${time.hours}h ${time.minutes}m ${time.seconds}s `);

    message.channel.send(timeEmbed)
  } else {
    let moneyEmbed = new Discord.MessageEmbed()
    .setColor("#FFFFFF")
    .setDescription(`<:white_check_mark:618736570337591296> You've collected your weekly reward of ${amount} coins`);

    message.channel.send(moneyEmbed)
    bot.db.add(`money_${message.guild.id}_${user.id}`, amount)
    bot.db.set(`weekly_${message.guild.id}_${user.id}`, Date.now())
  }
};

module.exports.help = {
  name:"weekly",
  aliases: ["week"]
}