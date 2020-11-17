const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  if(message.author.id !== bot.config.ownerID) { return; }

  let user = message.mentions.members.first() || message.author;
  if (isNaN(args[1])) { return; }

  bot.db.subtract(`money_${message.guild.id}_${user.id}`, parseInt(args[1]))
  let bal = await bot.db.fetch(`money_${message.guild.id}_${user.id}`)

  let moneyEmbed = new Discord.MessageEmbed()
  .setColor("#FFFFFF")
  .setDescription(`<:white_check_mark:618736570337591296> Removed ${args[1]} coins\n\nNew Balance: ${bal}`);

  message.channel.send(moneyEmbed);
};


module.exports.help = {
  name:"removemoney",
  aliases: []
}