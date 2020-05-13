const { Command } = require('discord.js-commando');
const cow = require('cow');
const rn = require('random-number');

module.exports.run = async (bot, message, args) => {

    const options = {
        min: 0,
        max: cow().length - 1,
        integer: true
    };
    const random = rn(options);
    message.channel.send(cow()[random], { code: ''});

}
module.exports.help = {
  name:"cow",
  aliases: [""]
}