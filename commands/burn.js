module.exports.run = async (bot, message, args) => {
  if (!message.mentions.users.first()) { return message.channel.send('Mention someone.') }
  message.channel.send(`**${message.author.username}** *burned*  **${message.mentions.users.first().username}**\nYou need some ice for that bud? :snowflake:\nhttps://c.tenor.com/UBwavZVvFvkAAAAC/tenor.gif`)
}

module.exports.help = {
  name:"burn",
  aliases: ["burn"]
}