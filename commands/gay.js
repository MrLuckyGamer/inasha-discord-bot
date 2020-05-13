const Discord = require("discord.js")
 
 module.exports.run = async (bot, message, args) => {

    //!8ball question
let gay = Math.round(Math.random() * 100)
 let mentionedUser = message.mentions.users.first() || message.author;
    let ballembed = new Discord.RichEmbed()
   
    .setColor("#00ff00")
    .setDescription(`${mentionedUser} is ${gay}% gay!`)

    message.channel.send(ballembed)


 }

    module.exports.help = {
        name: "gay",
      aliases: [""]
    } 