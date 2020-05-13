const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  let bicon = bot.user.displayAvatarURL;
    
 let inviteEmbed = new Discord.RichEmbed()
 .setDescription("[**Invite**](https://discordapp.com/api/oauth2/authorize?client_id=698599376800710656&permissions=8&scope=bot)")
 .setColor("#00ff00")
 .setThumbnail(bicon)
 .addField("Use this invite to invite the bot in your server!", "https://discordapp.com/api/oauth2/authorize?client_id=698599376800710656&permissions=8&scope=bot")
  .addField("Support Server", "[Click to join support Server](https://discord.gg/qaEq3bh)")
 
 
 message.channel.send(inviteEmbed);

        message.delete();

}
      module.exports.help = {
        name: "invite",
        aliases:[""]
      }