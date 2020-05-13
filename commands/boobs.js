const discord = require('discord.js');

const superagent = require('superagent')



exports.run = (client, msg, args) => {

  if (msg.channel.nsfw === true) {

    superagent.get('https://nekobot.xyz/api/image')

    .query({ type: 'boobs'})

    .end((err, response) => {

      msg.channel.send({ file: response.body.message });

    });
msg.channel.send('**OooOOooO-**')
  } else {

    msg.channel.send("This isn't NSFW channel!")

  }

};

module.exports.help = {
  name:"boobs",
  aliases: ["bob"]
}
