const Discord = require('discord.js')

module.exports.run = async (bot, msg, args) => {
    const serverQueue = bot.queue.get(msg.guild.id);

    if (!msg.member.voice.channel)
      return msg.channel.send("You are not in a voice channel!");
    if (!serverQueue)
      return msg.channel.send(
        "There is nothing playing that I could stop for you."
      );
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end("Stop command has been used!");
    msg.reply("**bot has been stopped !**");
    return undefined;
}
  
module.exports.help = {
  name:"stop",
  aliases: []
}