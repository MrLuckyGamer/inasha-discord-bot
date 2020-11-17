const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
   let xdemb = new Discord.MessageEmbed()
   .setColor("#00ff00")
   .setTitle("Ban Command")
   .addField("Description:", `Ban a member`, true)
   .addField("Usage:", `i>ban [user] [reason]`, true)
   .addField("Example:", `i>ban @AlexD spam`)

   if(!message.member.hasPermission("BAN_MEMBERS") && message.author.id !== bot.config.ownerID) { return message.channel.send("Sorry you don't have permission to use this!"); }

   let member = message.mentions.members.first();
   if(!member) { return message.channel.send(xdemb) }
   if(!member.bannable) { return message.channel.send("I can't ban this user!") }
   if(member.user.id === bot.config.ownerID) { return message.channel.send("I can't ban my owner!") }
   if(member.id === message.author.id) { return message.channel.send("You can't ban your self") }

   let reason = args.slice(1).join(" ");
   if(reason === undefined) {
      reason = "No reason given";
   }

   await member.ban({ reason: reason }).catch(error => message.channel.send(`Sorry, I couldn't ban because of: ${error}`));

   let bean = new Discord.MessageEmbed()
   .setColor("#00ff00")
   .setTitle(`Ban | ${member.user.tag}`)
   .addField("User", member, true)
   .addField("Moderator", message.author, true)
   .addField("Reason", reason)
   .setTimestamp()

   message.channel.send(bean)
}

module.exports.help = {
  name:"ban",
  aliases: ["b"]
}