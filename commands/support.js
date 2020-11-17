const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  let bicon = bot.user.displayAvatarURL;
  let embed = new Discord.MessageEmbed()
  .setColor("#00ff00")
  .setThumbnail(bicon)
  .setTitle("Support Info")
  .addField("To see the bot commands use", "`" + bot.config.prefix + "help`")
  .addField("To report bug use", "`" + bot.config.prefix + "contact`")
  .addField("If you need help with something else", "[Support Sever](https://discord.gg/zdDy8Vy)")

  message.channel.send(embed)
}

module.exports.help = {
    name: "support",
  aliases: []
}