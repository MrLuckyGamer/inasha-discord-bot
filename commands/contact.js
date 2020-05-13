const Discord = require('discord.js');

exports.run = async (client, message, args, params) => {
    if(message.channel.type == "dm")  return;
  if(message.channel.type !== "text") return;
  let reason = args.join(" ")
  var channel = client.channels.find('id', '646418685312892959')
    const asdf = await client.channels.get(message.channel.id).createInvite()
  message.delete();
  const embed = new Discord.RichEmbed()
  .setTitle("»  Bot | Hystant Support")
  .setDescription("Thank you for contacting Hystant Support. You will receive an answer as soon as possible.")
  .setFooter(`We will not receive the message if you didn't type a reason for contacting ${message.author.username}`)
 message.channel.send(embed)
      const invite = new Discord.RichEmbed()
  .setAuthor("» Hystant Support | A report arrived")
  .addField('» Username: ', message.author.username + '#' + message.author.discriminator)
  .addField('» Server name: ', message.guild.name)
  .addField("» Reason: ", reason)
  .setDescription(asdf.url)
      channel.send(invite)
};

module.exports.help = {
  name:"contact",
  aliases: ["ct"]
}