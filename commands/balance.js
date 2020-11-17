const Discord = require("discord.js");

module.exports.run = async (bot, message, args, utils) => {
  let user = message.mentions.members.first() || message.author;
  let bal = bot.db.fetch(`money_${message.guild.id}_${user.id}`)
  if (bal === undefined) { bal = 0; }

  let bank = await bot.db.fetch(`bank_${message.guild.id}_${user.id}`)
  if (bank === undefined) { bank = 0; }

  let moneyEmbed = new Discord.MessageEmbed()
  .setColor("#FFFFFF")
  .setDescription(`**${user}'s Balance**\n\nPocket: ${bal}\nBank: ${bank}`);

  message.channel.send(moneyEmbed)
};

module.exports.help = {
  name:"balance",
  aliases: ["bal"]
}