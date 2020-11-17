const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  let bicon = bot.user.displayAvatarURL;
    
  let inviteEmbed = new Discord.MessageEmbed()
  .setDescription("[**Invite**](https://discord.com/api/oauth2/authorize?client_id=766211683684843550&permissions=8&scope=bot)")
  .setColor("#00ff00")
  .setThumbnail(bicon)
  .addField("Use this invite to invite the bot in your server!", "https://discord.com/api/oauth2/authorize?client_id=766211683684843550&permissions=8&scope=bot")
  .addField("Support Server", "[Click to join support Server](https://discord.gg/zdDy8Vy)")

  message.channel.send(inviteEmbed);
}

module.exports.help = {
  name: "invite",
  aliases: []
}