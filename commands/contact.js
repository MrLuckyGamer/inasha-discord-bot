const Discord = require('discord.js');

exports.run = async (client, message, args, params) => {
  if(message.channel.type == "dm") { return; }
  if(message.channel.type !== "text") { return; }
  let reason = args.join(" ")
  var channel = client.channels.cache.find(c => { return c.id === '320407113887252482'; })
  const asdf = await client.channels.cache.get(message.channel.id).createInvite()

  const embed = new Discord.MessageEmbed()
  .setTitle("»  Bot | Inasha Support")
  .setDescription("Thank you for contacting Inasha Support. You will receive an answer as soon as possible.")
  .setFooter(`We will not receive the message if you didn't type a reason for contacting ${message.author.username}`)
  message.channel.send(embed)

  const invite = new Discord.MessageEmbed()
  .setAuthor("» Inasha Support | A report arrived")
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