const Discord = require('discord.js')

module.exports.run = async (bot, msg, args) => {
    const serverQueue = bot.queue.get(msg.guild.id);

    if (!msg.member.voice.channel)
      return msg.channel.send("You are not in a voice channel!");
    if (!serverQueue) return msg.channel.send("There is nothing playing.");
    if (!args[0])
      return msg.channel.send(
        `The current volume is: **${serverQueue.volume}**`
      );
    serverQueue.volume = (parseInt(args[0]) / 100);
    serverQueue.connection.dispatcher.setVolumeLogarithmic((parseInt(args[0]) / 100) / 4);
    return msg.channel.send(`I set the volume to: **${args[0]}**`);
}
  
module.exports.help = {
  name:"volume",
  aliases: []
}