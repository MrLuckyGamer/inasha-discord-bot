module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("MANAGE_MESSAGES")) { return message.channel.sendMessage("You don't have the `Manage Messages` premission") }
    let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);
    if(!toMute) { return message.channel.sendMessage("Please mention an user or ID to mute!"); }

    let role = message.guild.roles.cache.find(r => { return r.name === "Inasha Mute"; })
    if(!role || !toMute.roles.cache.has(role.id)) { return message.channel.send("This user is not muted!"); }

    await toMute.removeRole(role);
    message.channel.send("The user has been unmuted!");
}
    
module.exports.help = {
  name: "unmute",
  aliases: []
}