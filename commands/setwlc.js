const Discord = require('discord.js')
const fs = require('fs');
let kanal = JSON.parse(fs.readFileSync("./handle/guild.json", "utf8"));

var prefix = ">";

exports.run = async (client, message, args) => {
if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`You do not have permission to do that!`);
  
  let channel = message.mentions.channels.first()
    if (!channel) {
        message.channel.send(`:x: | Please enter a channel name! | Ex: ${prefix}setwlc #welcome-bye`)
        return
    }
    if(!kanal[message.guild.id]){
        kanal[message.guild.id] = {
            resim: channel.id
        };
    }
    fs.writeFile("./handle/guild.json", JSON.stringify(kanal), (err) => {
        console.log(err)
    })
    message.channel.send(`:white_check_mark: | ** The welcome and bye channel has been set ! The new channel is ${channel}.** `)
}
module.exports.help = {
  name:"setwlc",
  aliases: [""]
}
    