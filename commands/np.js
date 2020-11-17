const Discord = require("discord.js");

module.exports.run = async (bot, msg, args) => {
    const serverQueue = bot.queue.get(msg.guild.id);

    var embed = new Discord.MessageEmbed()
    .setTitle("Song Detail")
    .setDescription(`🎶 \`Now playing:\` **${serverQueue.songs[0].title}**`)
    .setColor("#ff2052");
    if (!serverQueue) return msg.channel.send("There is nothing playing.");
    return msg.channel.send(embed);
}

module.exports.help = {
  name:"np",
  aliases: []
}