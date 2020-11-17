const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  let inline = true
  let bicon = bot.user.displayAvatarURL;
  let usersize = bot.users.cache.size
  let chansize = bot.channels.cache.size
  let uptimxd = bot.uptime 
  let servsize = bot.guilds.cache.size
  let botembed = new Discord.MessageEmbed()
  .setColor("#00ff00")
  .setThumbnail(bicon)
  .addField("Bot Name", ` ${bot.user.username}`, inline)
  .addField("Bot Owner", "Lucky", inline )
  .addField("Servers", `🛡 ${servsize}`, inline)
  .addField("Channels", `📁 ${chansize}`, inline)
  .addField("Users", `${usersize}`, inline)
  .addField("Bot Library", " Discord.js", inline)
  .addField("Created On", bot.user.createdAt)
  .setFooter(`Information about: ${bot.user.username}. Developed by: Lucky and LamkasDev`)
  .setTimestamp()
  
  message.channel.send(botembed);
}

module.exports.help = {
  name:"botinfo",
  aliases: ["bi"]
}