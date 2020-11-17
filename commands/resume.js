const Discord = require("discord.js");

module.exports.run = async (bot, msg, args) => {
    const serverQueue = bot.queue.get(msg.guild.id);

    if (serverQueue && !serverQueue.playing) {
        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        var embed = new Discord.MessageEmbed()
        .setTitle("Song")
        .setDescription(`▶ Resumed the music for you!`)
        .setColor("#ff2052");
  
        msg.channel.send(embed);
    }
}

module.exports.help = {
  name:"resume",
  aliases: []
}