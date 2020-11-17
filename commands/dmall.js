const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    const text = args.join(" ");
    if(!text) { return message.reply("write a message please"); }

    message.channel.send("Good !! I'll send a dm now.");
    message.guild.members.cache.forEach(member => {
        if (member.id != bot.user.id && !member.user.bot) { member.send(text); }
    });
};

module.exports.help = {
  name:"dmall",
  aliases: []
}