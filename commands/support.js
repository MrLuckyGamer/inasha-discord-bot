const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let bicon = bot.user.displayAvatarURL;
    let embed = new Discord.RichEmbed()
    .setColor("#00ff00")
    .setThumbnail(bicon)
    .setTitle("Support Info")
    .addField("To see the bot commands use", "`h?help`")
    .addField("To report bug use", "`h?contact`")
    .addField("If you need help with something else", "[Support Sever](https://discord.gg/QpS5bpk)")

    message.channel.send(embed)

            message.delete();
}

module.exports.help = {
    name: "support",
  aliases:[""]
}