const db = require("quick.db")
const discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
    
    //OWNER ONLY COMMAND
    if(!message.author.id === "694585818383122472 , 537697699323969536") {
      return message.channel.send("This command can only be used by owner")
    }
    //ARGUMENT
    if(!args.length) {
      return message.channel.send("Please give status message")
    }
    
 db.set(`status`, args.join(" "))
   await message.channel.send("Updated the bot status")
    process.exit(1);
    
  }
