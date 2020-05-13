const Discord = require('discord.js');
exports.run = (client, message, args) => {
    let reason = args.slice(1).join(' ');
    let user = args[0]
    if (reason.length < 1) return message.reply('you must supply a reason to unban the mentioned user.');
    if (!user) return message.reply('you must supply a `UserResolvable`, i.e. a user ID.').catch(console.error);
    message.guild.unban(user);
    
    const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .addField('Action:', 'Unban')
    .addField('Target:', `${user.username}#${user.discriminator} [ID: ${user.id}]`)
    .addField('Responsible moderator:', `${message.author.username}#${message.author.discriminator}`);
   message.channel.send('The user has been unbanned!')
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
  aliases: [""]
}