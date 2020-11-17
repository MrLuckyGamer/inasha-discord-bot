const Discord = require('discord.js')

module.exports.run = async (bot, msg, args) => {
    const serverQueue = bot.queue.get(msg.guild.id);

    if (!msg.member.hasPermission("ADMINISTRATOR")) {
        return msg.reply("YOU DIDN'T HAVE ADMINISTRATOR PERMISSIONS!");
      }
  
      if (!msg.member.voiceChannel)
        return msg.channel.send("You are not in a voice channel!");
      if (!serverQueue)
        return msg.channel.send(
          "There is nothing playing that I could skip for you."
        );
      const embed = new Discord.MessageEmbed()
        .setTitle("Song")
        .setColor("#ff2052")
        .setDescription("✅ Successfully skipped the song");
      msg.channel.send(embed);
      
      serverQueue.connection.dispatcher.end("");
  
      return undefined;
}
  
module.exports.help = {
  name:"skip",
  aliases: []
}