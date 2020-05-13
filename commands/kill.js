const kill = ["https://imgur.com/gallery/IzMIQx1","https://imgur.com/gallery/fzj9yt0","https://giphy.com/gifs/horror-season-1-zombie-ANi4XNGPsGSgU","https://giphy.com/gifs/zombie-zombies-simon-pegg-4Sm7D7rlopgqs","https://giphy.com/gifs/zombies-XKmwJc9esWhdC"]
const rn = require('random-number')

module.exports.run = async (bot, message, args) => {
    if (!message.mentions.users.first()) return message.channel.send("Well you can't kill the air...");
    let r = rn({
        min: 0,
        max: kill.length - 1,
        integer: true
    });
    let image = kill[r];
    message.channel.send('**' + message.author.username + '** * killed * **' + message.mentions.users.first().username + '** \n' + image);
}

module.exports.help = {
    name: "mock",
  aliases:[""]
}