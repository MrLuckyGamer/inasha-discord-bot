const ms = require("ms");

module.exports.run = async (bot, message, args) => {
  let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
  if(!tomute) { return message.channel.send("Please tag user to mute!"); }
  if(!message.member.hasPermission("MANAGE_MESSAGES")) { return message.channel.send("Sorry, you don't have permissions to use this!"); }
  if (tomute.id === message.author.id) { return message.channel.send("You cannot mute yourself!"); }
  let muterole = message.guild.roles.cache.find(r => { return r.name === 'Inasha Mute'; });

  if(!muterole){
    try {
      muterole = await message.guild.roles.create("Inasha Mute", {
        color: "#000000",
        permissions:[]
      })

      message.guild.channels.cache.forEach(async (channel, id) => {
        await channel.overwritePermissions([{
          id: muterole.id,
          deny: [
            "SEND_MESSAGES", "ADD_REACTIONS"
          ]
        }]);
      });
    } catch(e){
      console.log(e.stack);
    }
  }

  let mutetime = args[1];
  if(!mutetime) return message.channel.send("You didn't specify a time!");

  await(tomute.roles.add(muterole.id));
  message.reply(`<@${tomute.id}> has been muted for ${ms(ms(mutetime))}`);

  setTimeout(function(){
    tomute.roles.remove(muterole.id);
    message.channel.send(`<@${tomute.id}> has been unmuted!`);
  }, ms(mutetime));
}

module.exports.help = {
  name: "mute",
  aliases: []
}