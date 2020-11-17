const Discord = require('discord.js');
exports.run = (client, message, args) => {
    let user = args[0]
    if (!user) { return message.reply('you must supply a `UserResolvable`, i.e. a user ID.').catch(console.error); }
    message.guild.members.unban(user);
    
    const embed = new Discord.MessageEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .addField('Action:', 'Unban')
    .addField('Target:', `${user.username}#${user.discriminator} [ID: ${user.id}]`)
    .addField('Responsible moderator:', `${message.author.username}#${message.author.discriminator}`);

    message.channel.send("", embed)
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 2
};

exports.help = {
    name: 'unban',
    description: 'Unbans the mentioned user from the server.',
    usage: 'ban [user] [reason]'
};

module.exports.help = {
  name:"unban",
  aliases: []
}