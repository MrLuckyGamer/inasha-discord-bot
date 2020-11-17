const Discord = require("discord.js");
const ms = require("parse-ms");

module.exports.run = async (bot, message, args) => {
  let user = message.author;
  let timeout = 86400000;
  let amount = 200;
  let daily = await bot.db.fetch(`daily_${message.guild.id}_${user.id}`);

  if (daily !== undefined && timeout - (Date.now() - daily) > 0) {
    let time = ms(timeout - (Date.now() - daily));
    let timeEmbed = new Discord.MessageEmbed()
    .setColor("#FFFFFF")
    .setDescription(`:cross: You've already collected your daily reward\n\nCollect it again in ${time.hours}h ${time.minutes}m ${time.seconds}s `);

    message.channel.send(timeEmbed)
  } else {
    let moneyEmbed = new Discord.MessageEmbed()
    .setColor("#FFFFFF")
    .setDescription(`:white_check_mark: You've collected your daily reward of ${amount} coins`);

    message.channel.send(moneyEmbed)

    bot.db.add(`money_${message.guild.id}_${user.id}`, amount)
    bot.db.set(`daily_${message.guild.id}_${user.id}`, Date.now())
  }
};

module.exports.help = {
  name:"daily",
  aliases: ["day"]
}